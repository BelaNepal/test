require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit"); // Use PDFKit instead of Puppeteer
const streamBuffers = require("stream-buffers");

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

    // HTML content for email (kept for email body)
    const emailHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; position: relative;">
    <div style="position: absolute; top: 35%; left: 0; width: 100%; text-align: center; opacity: 0.06; z-index: 0;">
      <img src="https://belanepal.com.np/wp-content/uploads/Logo-2.png" style="max-width: 400px;" />
    </div>

    <div style="position: relative; z-index: 1;">
      <header style="display: flex; align-items: center; border-bottom: 3px solid #EF7E1A; padding-bottom: 12px; margin-bottom: 20px;">
        <img src="https://belanepal.com.np/wp-content/uploads/Logo-2.png" alt="Bela Nepal Logo" style="max-height: 60px; margin-right: 16px;" />
        <div>
          <h1 style="margin: 0; font-size: 24px; color: #002147;">Bela Nepal Industries Pvt. Ltd.</h1>
          <p style="margin: 4px 0 0; color: #444;">www.belanepal.com.np | +977-9802375303</p>
        </div>
      </header>

      <div style="columns: 2; -webkit-columns: 2; column-gap: 40px;">
        <div class="section">
          <h2>Client Information</h2>
          <p><strong>Name:</strong> ${formData.fullName ?? "N/A"}</p>
          <p><strong>Phone:</strong> ${formData.phone ?? "N/A"}</p>
          <p><strong>Email:</strong> ${formData.email ?? "N/A"}</p>
        </div>

        <div class="section">
          <h2>Location</h2>
          <p><strong>Province:</strong> ${formData.province ?? "N/A"}</p>
          <p><strong>District:</strong> ${formData.district ?? "N/A"}</p>
          <p><strong>Municipality:</strong> ${formData.municipality ?? "N/A"}</p>
          <p><strong>Ward:</strong> ${formData.ward ?? "N/A"}</p>
        </div>

        <div class="section">
          <h2>Project Details</h2>
          <p><strong>Project Type:</strong> ${formData.projectType ?? "N/A"}</p>
          <p><strong>Project Scope:</strong> ${formData.projectScope ?? "N/A"}</p>
          <p><strong>Vision:</strong> ${formData.vision ?? "N/A"}</p>
          <p><strong>Square Footage:</strong> ${formData.squareFootage ?? "N/A"}</p>
          <p><strong>Land Area:</strong> ${formData.landArea ?? "N/A"}</p>
          <p><strong>Completion Date:</strong> ${formData.completionDate ?? "N/A"}</p>
        </div>

        <div class="section">
          <h2>Site & Design Planning</h2>
          <p><strong>Storeys:</strong> ${formData.storeys ?? "N/A"}</p>
          <p><strong>Topography:</strong> ${formData.siteTopography ?? "N/A"}</p>
          <p><strong>Drainage:</strong> ${formData.waterDrainage ?? "N/A"}</p>
          <p><strong>Direction:</strong> ${formData.direction ?? "N/A"}</p>
          <p><strong>Road Type:</strong> ${Array.isArray(formData.roadType) ? formData.roadType.join(", ") : (formData.roadType ?? "N/A")}</p>
          <p><strong>Road Access Size:</strong> ${formData.roadAccessSize ?? "N/A"}</p>
        </div>

        <div class="section">
          <h2>Room Summary</h2>
          <ul style="margin: 0; padding-left: 20px;">
            ${Object.entries(rooms)
              .map(([key, val]) => `<li><strong>${key}:</strong> ${val}</li>`)
              .join("")}
          </ul>
        </div>

        <div class="section">
          <h2>Additional Info</h2>
          <p><strong>Additional Spaces:</strong> ${formData.additionalSpaces ?? "N/A"}</p>
          <p><strong>Accessibility:</strong> ${formData.accessibility ?? "N/A"}</p>
          <p><strong>Other Details:</strong> ${formData.otherDetails ?? "N/A"}</p>
          <p><strong>Heard From:</strong> ${Array.isArray(formData.heardFrom) ? formData.heardFrom.join(", ") : (formData.heardFrom ?? "N/A")}</p>
        </div>
      </div>

      <footer style="border-top: 3px solid #EF7E1A; margin-top: 40px; text-align: center; color: #555; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Bela Nepal Industries Pvt. Ltd. All rights reserved.</p>
      </footer>
    </div>
  </div>
`;

    // Generate PDF with PDFKit
    let pdfBuffer;
    try {
      const doc = new PDFDocument({ margin: 40 });
      const writableStream = new streamBuffers.WritableStreamBuffer();
      doc.pipe(writableStream);

      // Add header/logo
      doc.image("https://belanepal.com.np/wp-content/uploads/Logo-2.png", { width: 150, align: "center" });
      doc.moveDown();

      // Add sections (same order as HTML)
      doc.fontSize(16).text("Client Information", { underline: true });
      doc.fontSize(12)
        .text(`Name: ${formData.fullName ?? "N/A"}`)
        .text(`Phone: ${formData.phone ?? "N/A"}`)
        .text(`Email: ${formData.email ?? "N/A"}`);
      doc.moveDown();

      doc.fontSize(16).text("Location", { underline: true });
      doc.fontSize(12)
        .text(`Province: ${formData.province ?? "N/A"}`)
        .text(`District: ${formData.district ?? "N/A"}`)
        .text(`Municipality: ${formData.municipality ?? "N/A"}`)
        .text(`Ward: ${formData.ward ?? "N/A"}`);
      doc.moveDown();

      doc.fontSize(16).text("Project Details", { underline: true });
      doc.fontSize(12)
        .text(`Project Type: ${formData.projectType ?? "N/A"}`)
        .text(`Project Scope: ${formData.projectScope ?? "N/A"}`)
        .text(`Vision: ${formData.vision ?? "N/A"}`)
        .text(`Square Footage: ${formData.squareFootage ?? "N/A"}`)
        .text(`Land Area: ${formData.landArea ?? "N/A"}`)
        .text(`Completion Date: ${formData.completionDate ?? "N/A"}`);
      doc.moveDown();

      doc.fontSize(16).text("Site & Design Planning", { underline: true });
      doc.fontSize(12)
        .text(`Storeys: ${formData.storeys ?? "N/A"}`)
        .text(`Topography: ${formData.siteTopography ?? "N/A"}`)
        .text(`Drainage: ${formData.waterDrainage ?? "N/A"}`)
        .text(`Direction: ${formData.direction ?? "N/A"}`)
        .text(`Road Type: ${Array.isArray(formData.roadType) ? formData.roadType.join(", ") : (formData.roadType ?? "N/A")}`)
        .text(`Road Access Size: ${formData.roadAccessSize ?? "N/A"}`);
      doc.moveDown();

      doc.fontSize(16).text("Room Summary", { underline: true });
      Object.entries(rooms).forEach(([key, val]) => {
        doc.fontSize(12).text(`${key}: ${val}`);
      });
      doc.moveDown();

      doc.fontSize(16).text("Additional Info", { underline: true });
      doc.fontSize(12)
        .text(`Additional Spaces: ${formData.additionalSpaces ?? "N/A"}`)
        .text(`Accessibility: ${formData.accessibility ?? "N/A"}`)
        .text(`Other Details: ${formData.otherDetails ?? "N/A"}`)
        .text(`Heard From: ${Array.isArray(formData.heardFrom) ? formData.heardFrom.join(", ") : (formData.heardFrom ?? "N/A")}`);

      doc.end();
      pdfBuffer = writableStream.getContents();
    } catch (pdfErr) {
      console.error("❌ PDF generation failed:", pdfErr.message);
      return res.status(500).json({ success: false, message: "PDF generation failed", error: pdfErr.message });
    }

    // Nodemailer email setup
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Bela Nepal Website" <${process.env.SMTP_USER}>`,
        to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
        replyTo: formData.email ?? process.env.SMTP_USER,
        subject: "New Project Info Submission",
        html: emailHtml,
        attachments: [
          ...files.map(({ originalname, buffer }) => ({
            filename: originalname,
            content: buffer,
          })),
          {
            filename: "ProjectSubmission.pdf",
            content: pdfBuffer,
          },
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
