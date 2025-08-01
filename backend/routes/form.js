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

    // Debug: log incoming formData to check keys and values
    console.log("Received formData:", formData);
    console.log("Raw formData keys and values:");
Object.entries(formData).forEach(([key, value]) => console.log(`${key}: ${value}`));


    // Parse rooms safely if it's a JSON string or object
   // Reconstruct rooms object from keys like "rooms.bedroom"
const rooms = {};
Object.getOwnPropertyNames(formData).forEach((key) => {
  if (key.startsWith("rooms.")) {
    const roomKey = key.split(".")[1];
    rooms[roomKey] = parseInt(formData[key] || "0", 10);
  }
});
console.log("🧾 Final parsed rooms:", rooms);

    // Create email HTML content dynamically (update as needed)
    const emailHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; border: 1px solid #ccc; padding: 24px;">
    <!-- Header -->
    <header style="display: flex; align-items: center; border-bottom: 3px solid #EF7E1A; padding-bottom: 16px; margin-bottom: 20px;">
      <img src="https://belanepal.com.np/wp-content/uploads/Logo-2.png" alt="Bela Nepal Logo" style="max-height: 80px; margin-right: 16px;" />
      <div>
        <h1 style="margin: 0; font-size: 26px; color: #002147;">Bela Nepal Industries Pvt. Ltd.</h1>
        <p style="margin: 4px 0 0; color: #444;">www.belanepal.com.np | +977-9802375303</p>
      </div>
    </header>

    <!-- Body -->
    <section style="margin-top: 24px;">
      <h2 style="color: #002147; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Client Information</h2>
      <div style="display: flex; justify-content: space-between;">
        <div style="width: 48%;">
          <p><strong>Name:</strong> ${formData.fullName ?? "N/A"}</p>
          <p><strong>Phone:</strong> ${formData.phone ?? "N/A"}</p>
          <p><strong>Email:</strong> ${formData.email ?? "N/A"}</p>
        </div>
        <div style="width: 48%;">
          <p><strong>Province:</strong> ${formData.province ?? ""}</p>
          <p><strong>District:</strong> ${formData.district ?? ""}</p>
          <p><strong>Municipality:</strong> ${formData.municipality ?? ""}</p>
          <p><strong>Ward:</strong> ${formData.ward ?? ""}</p>
        </div>
      </div>

      <h2 style="margin-top: 32px; color: #002147; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Project Details</h2>
      <div style="display: flex; justify-content: space-between;">
        <div style="width: 48%;">
          <p><strong>Type:</strong> ${formData.projectType ?? ""}</p>
          <p><strong>Scope:</strong> ${formData.projectScope ?? ""}</p>
          <p><strong>Land Area:</strong> ${formData.landArea ?? ""}</p>
          <p><strong>Square Footage:</strong> ${formData.squareFootage ?? ""}</p>
        </div>
        <div style="width: 48%;">
          <p><strong>Completion Date:</strong> ${formData.completionDate ?? ""}</p>
          <p><strong>Vision:</strong> ${formData.vision ?? ""}</p>
        </div>
      </div>

      <h2 style="margin-top: 32px; color: #002147; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Site & Design Planning</h2>
      <div style="display: flex; justify-content: space-between;">
        <div style="width: 48%;">
          <p><strong>Storeys:</strong> ${formData.storeys ?? ""}</p>
          <p><strong>Topography:</strong> ${formData.siteTopography ?? ""}</p>
          <p><strong>Drainage:</strong> ${formData.waterDrainage ?? ""}</p>
        </div>
        <div style="width: 48%;">
          <p><strong>Direction:</strong> ${formData.direction ?? ""}</p>
          <p><strong>Road Type:</strong> ${Array.isArray(formData.roadType) ? formData.roadType.join(", ") : formData.roadType ?? ""}</p>
          <p><strong>Road Access Size:</strong> ${formData.roadAccessSize ?? ""}</p>
        </div>
      </div>

      <h2 style="margin-top: 32px; color: #002147;">Room Summary</h2>
      <ul style="columns: 2; -webkit-columns: 2; -moz-columns: 2; padding-left: 20px;">
        ${
          [
            "bedroom",
            "bathroom",
            "dining",
            "kitchen",
            "living",
            "balcony",
            "office",
            "parking",
            "pantry",
            "prayer",
            "storage",
            "outdoor",
          ]
            .map((room) => {
              const label = room[0].toUpperCase() + room.slice(1);
              const value = rooms[room] ?? 0;
              return `<li><strong>${label}:</strong> ${value}</li>`;
            })
            .join("")
        }
      </ul>

      <h2 style="margin-top: 32px; color: #002147;">Additional Information</h2>
      <p><strong>Additional Spaces:</strong> ${formData.additionalSpaces ?? ""}</p>
      <p><strong>Accessibility Needs:</strong> ${formData.accessibility ?? ""}</p>
      <p><strong>Other Details:</strong> ${formData.otherDetails ?? ""}</p>
      <p><strong>Heard From:</strong> ${Array.isArray(formData.heardFrom) ? formData.heardFrom.join(", ") : formData.heardFrom ?? ""}</p>
    </section>

    <!-- Footer -->
    <footer style="text-align: center; margin-top: 40px; padding-top: 16px; border-top: 3px solid #EF7E1A; color: #444;">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Bela Nepal Industries Pvt. Ltd. All rights reserved.</p>
    </footer>
  </div>
`;

    // Generate PDF from HTML
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(emailHtml, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // Nodemailer transport setup
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true if 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Mail options including PDF + uploaded files
    const mailOptions = {
      from: `"Bela Nepal Website" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL ?? process.env.SMTP_USER,
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
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent with PDF attachment successfully" });
  } catch (error) {
    console.error("Error sending email or generating PDF:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
