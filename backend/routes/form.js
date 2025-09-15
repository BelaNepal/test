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

    // HTML template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px;">
        <header style="display: flex; align-items: center; border-bottom: 3px solid #EF7E1A; padding-bottom: 12px; margin-bottom: 20px;">
          <img src="https://belanepal.com.np/wp-content/uploads/Logo-2.png" alt="Logo" style="max-height:60px; margin-right:16px;" />
          <div>
            <h1 style="margin:0; font-size:24px; color:#002147;">Bela Nepal Industries Pvt. Ltd.</h1>
            <p style="margin:4px 0 0; color:#444;">www.belanepal.com.np | +977-9802375303</p>
          </div>
        </header>

        <h2>Client Information</h2>
        <p><strong>Name:</strong> ${formData.fullName ?? "N/A"}</p>
        <p><strong>Phone:</strong> ${formData.phone ?? "N/A"}</p>
        <p><strong>Email:</strong> ${formData.email ?? "N/A"}</p>

        <h2>Location</h2>
        <p><strong>Province:</strong> ${formData.province ?? "N/A"}</p>
        <p><strong>District:</strong> ${formData.district ?? "N/A"}</p>
        <p><strong>Municipality:</strong> ${formData.municipality ?? "N/A"}</p>
        <p><strong>Ward:</strong> ${formData.ward ?? "N/A"}</p>

        <h2>Project Details</h2>
        <p><strong>Project Type:</strong> ${formData.projectType ?? "N/A"}</p>
        <p><strong>Project Scope:</strong> ${formData.projectScope ?? "N/A"}</p>
        <p><strong>Vision:</strong> ${formData.vision ?? "N/A"}</p>

        <h2>Room Summary</h2>
        <ul>
          ${Object.entries(rooms).map(([key, val]) => `<li><strong>${key}:</strong> ${val}</li>`).join("")}
        </ul>

        <footer style="border-top:3px solid #EF7E1A; margin-top:40px; text-align:center; color:#555; font-size:12px;">
          &copy; ${new Date().getFullYear()} Bela Nepal Industries Pvt. Ltd.
        </footer>
      </div>
    `;

    // Puppeteer PDF
    let pdfBuffer;
    try {
      const CHROME_PATH = "/opt/render/.cache/puppeteer/chrome/linux-139.0.7258.138/chrome";

      const browser = await puppeteer.launch({
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
      console.error("❌ neration failed:", pdfErr);
      return res.status(500).json({ success: false, message: "PDF generation failed", error: pdfErr.message });
    }

    // Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    try {
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
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
      return res.status(500).json({ success: false, message: "Email sending failed", error: emailErr.message });
    }

    res.json({ success: true, message: "Form submitted and email sent with PDF." });
  } catch (err) {
    console.error("🚨 Unexpected error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
