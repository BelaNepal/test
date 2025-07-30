const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/submit-form
router.post("/submit-form", async (req, res) => {
  const form = req.body;

const output = `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #ccc; padding: 30px;">
    <!-- Letterhead -->
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ef7e1a; padding-bottom: 20px; margin-bottom: 30px;">
      <div>
        <img src="https://belanepal.com/Logo-Bela.svg" alt="Bela Nepal Logo" style="height: 60px;" />
      </div>
      <div style="text-align: right; font-size: 14px; color: #444;">
        <strong>Bela Nepal Pvt. Ltd.</strong><br/>
        Chhauni-15, Kathmandu<br/>
        +977-9802375303<br/>
        info@belanepal.com
      </div>
    </header>

    <!-- Title -->
    <h2 style="color: #1e2d4d;">New Project Information Submission</h2>

    <!-- Body Content -->
    <table cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
      <tbody>
        <tr><td><strong>Full Name:</strong></td><td>${form.fullName}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${form.phone}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${form.email}</td></tr>
        <tr><td><strong>Date:</strong></td><td>${form.date}</td></tr>
        <tr><td><strong>Province:</strong></td><td>${form.province}</td></tr>
        <tr><td><strong>District:</strong></td><td>${form.district}</td></tr>
        <tr><td><strong>Municipality:</strong></td><td>${form.municipality}</td></tr>
        <tr><td><strong>Ward:</strong></td><td>${form.ward}</td></tr>
        <tr><td><strong>Street:</strong></td><td>${form.street}</td></tr>
        <tr><td><strong>House No.:</strong></td><td>${form.houseNo}</td></tr>
        <tr><td><strong>Project Type:</strong></td><td>${form.projectType} ${form.projectTypeOther || ""}</td></tr>
        <tr><td><strong>Land Area:</strong></td><td>${form.landArea}</td></tr>
        <tr><td><strong>Square Footage:</strong></td><td>${form.squareFootage}</td></tr>
        <tr><td><strong>Completion Date:</strong></td><td>${form.completionDate}</td></tr>
        <tr><td><strong>Project Scope:</strong></td><td>${form.projectScope}</td></tr>
        <tr><td><strong>Vision:</strong></td><td>${form.vision}</td></tr>
      </tbody>
    </table>

    <!-- Footer -->
    <footer style="border-top: 2px solid #ef7e1a; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #777;">
      <p style="margin: 0;">This form was submitted via Bela Nepal’s project inquiry system.</p>
      <p style="margin: 0;">Please contact us if you have any questions or need clarification.</p>
    </footer>
  </div>
`;


  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_PASS, // your app password
      },
    });

    await transporter.sendMail({
      from: `"Bela Nepal" <${process.env.GMAIL_USER}>`,
      to: "belanepal2025@gmail.com",
      subject: "New Project Submission from Website",
      html: output,
    });

    res.status(200).json({ success: true, message: "Form submitted successfully." });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

module.exports = router;
