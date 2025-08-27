require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const streamBuffers = require("stream-buffers");
const axios = require("axios");

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

    // HTML content for email
    const emailHtml = `<div style="font-family: Arial, sans-serif;">...</div>`; // keep your previous HTML

    // Fetch logo as buffer
    let logoBuffer;
    try {
      const response = await axios.get(
        "https://belanepal.com.np/wp-content/uploads/Logo-2.png",
        { responseType: "arraybuffer" }
      );
      logoBuffer = Buffer.from(response.data, "binary");
    } catch (err) {
      console.warn("⚠️ Failed to fetch logo, PDF will be generated without it.");
      logoBuffer = null;
    }

    // Generate PDF
    let pdfBuffer;
    try {
      const doc = new PDFDocument({ margin: 40 });
      const writableStream = new streamBuffers.WritableStreamBuffer();
      doc.pipe(writableStream);

      // Add logo if available
      if (logoBuffer) {
        doc.image(logoBuffer, { width: 150, align: "center" });
      }
      doc.moveDown();

      // Client Information
      doc.fontSize(16).text("Client Information", { underline: true });
      doc.fontSize(12)
        .text(`Name: ${formData.fullName ?? "N/A"}`)
        .text(`Phone: ${formData.phone ?? "N/A"}`)
        .text(`Email: ${formData.email ?? "N/A"}`);
      doc.moveDown();

      // Location
      doc.fontSize(16).text("Location", { underline: true });
      doc.fontSize(12)
        .text(`Province: ${formData.province ?? "N/A"}`)
        .text(`District: ${formData.district ?? "N/A"}`)
        .text(`Municipality: ${formData.municipality ?? "N/A"}`)
        .text(`Ward: ${formData.ward ?? "N/A"}`);
      doc.moveDown();

      // Project Details
      doc.fontSize(16).text("Project Details", { underline: true });
      doc.fontSize(12)
        .text(`Project Type: ${formData.projectType ?? "N/A"}`)
        .text(`Project Scope: ${formData.projectScope ?? "N/A"}`)
        .text(`Vision: ${formData.vision ?? "N/A"}`)
        .text(`Square Footage: ${formData.squareFootage ?? "N/A"}`)
        .text(`Land Area: ${formData.landArea ?? "N/A"}`)
        .text(`Completion Date: ${formData.completionDate ?? "N/A"}`);
      doc.moveDown();

      // Site & Design Planning
      doc.fontSize(16).text("Site & Design Planning", { underline: true });
      doc.fontSize(12)
        .text(`Storeys: ${formData.storeys ?? "N/A"}`)
        .text(`Topography: ${formData.siteTopography ?? "N/A"}`)
        .text(`Drainage: ${formData.waterDrainage ?? "N/A"}`)
        .text(`Direction: ${formData.direction ?? "N/A"}`)
        .text(`Road Type: ${Array.isArray(formData.roadType) ? formData.roadType.join(", ") : (formData.roadType ?? "N/A")}`)
        .text(`Road Access Size: ${formData.roadAccessSize ?? "N/A"}`);
      doc.moveDown();

      // Room Summary
      doc.fontSize(16).text("Room Summary", { underline: true });
      Object.entries(rooms).forEach(([key, val]) => {
        doc.fontSize(12).text(`${key}: ${val}`);
      });
      doc.moveDown();

      // Additional Info
      doc.fontSize(16).text("Additional Info", { underline: true });
      doc.fontSize(12)
        .text(`Additional Spaces: ${formData.additionalSpaces ?? "N/A"}`)
        .text(`Accessibility: ${formData.accessibility ?? "N/A"}`)
        .text(`Other Details: ${formData.otherDetails ?? "N/A"}`)
        .text(`Heard From: ${Array.isArray(formData.heardFrom) ? formData.heardFrom.join(", ") : (formData.heardFrom ?? "N/A")}`);
      
      // Footer
      doc.moveDown(2);
      doc.fontSize(10).text(`© ${new Date().getFullYear()} Bela Nepal Industries Pvt. Ltd. All rights reserved.`, { align: "center" });

      doc.end();
      pdfBuffer = writableStream.getContents();
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
      console.error("❌ Email sending failed:", emailErr.message);
      return res.status(500).json({ success: false, message: "Email sending failed", error: emailErr.message });
    }

    res.json({ success: true, message: "Form submitted and email sent with PDF." });

  } catch (err) {
    console.error("🚨 Unexpected error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
