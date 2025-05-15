import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing 'to', 'subject' or 'text'" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text
    });

    res.status(200).json({ message: "Email sent!" });
  } catch (err) {
    console.error("SMTP error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.post("/send-sms", async (req, res) => {
  const { to, message, sender = "TrafikInfo" } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: "Missing 'to' or 'message'" });
  }

  const recipients = Array.isArray(to) ? to : [to];

  // Base64-auth header for HelloSMS
  const auth = Buffer.from(`${process.env.SMS_USER}:${process.env.SMS_PASS}`).toString("base64");

  // Use HelloSMS endpoint
  try {
    const response = await axios.post(
      "https://api.hellosms.se/api/v1/sms/send", // kontrollera exakt endpoint från dokumentationen
      {
        to: recipients,
        message,
        sender
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ HelloSMS response:", response.data);

    res.status(200).json({ message: "SMS sent!", results: response.data });
  } catch (err) {
    console.error("SMS error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to send SMS", details: err.response?.data || err.message });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Notification server running on port ${PORT}`);
});
