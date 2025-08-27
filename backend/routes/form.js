require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");

const router = express.Router();

// Multer config to keep files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/submit-form", upload.array("blueprintFiles"), async (req, res) => {
  try {
    const { body: formData, files = [] } = req;

    // Parse rooms.* fields
    const rooms = {};
    Object.keys(formData).forEach((key) => {
      if (key.startsWith("rooms.")) {
        const roomType = key.split(".")[1];
        rooms[roomType] = parseInt(formData[key] || "0", 10);
      }
    });

    // HTML content for email & PDF
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px;">
        <h2>Client Information</h2>
        <p><strong>Name:</strong> ${formData.fullName ?? "N/A"}</p>
        <p><strong>Phone:</strong> ${formData.phone ?? "N/A"}</p>
        <p><strong>Email:</strong> ${formData.email ?? "N/A"}</p>

        <h2>Project Details</h2>
        <p><strong>Project Type:</strong> ${formData.projectType ?? "N/A"}</p>
        <p><strong>Project Scope:</strong> ${formData.projectScope ?? "N/A"}</p>
        <p><strong>Vision:</strong> ${formData.vision ?? "N/A"}</p>

        <h2>Room Summary</h2>
        <ul>
          ${Object.entries(rooms)
            .map(([key, val]) => `<li><strong>${key}:</strong> ${val}</li>`)
            .join("")}
        </ul>
      </div>
    `;

    // Generate PDF using Puppeteer
    let pdfBuffer;
    try {
      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(emailHtml, { waitUntil: "networkidle0", timeout: 60000 });

      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
      });

      await browser.close();
    } catch (pdfErr) {
      console.error("❌ PDF generation failed:", pdfErr.message);
      return res.status(500).json({ success: false, message: "PDF generation failed", error: pdfErr.message });
    }

    // Nodemailer email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Bela Nepal Website" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
      replyTo: formData.email ?? process.env.SMTP_USER,
      subject: "New Project Info Submission",
      html: emailHtml,
      attachments: [
        ...files.map(({ originalname, buffer }) => ({ filename: originalname, content: buffer })),
        { filename: "ProjectSubmission.pdf", content: pdfBuffer },
      ],
    });

    res.json({ success: true, message: "Form submitted and email sent with PDF." });
  } catch (err) {
    console.error("🚨 Unexpected error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
