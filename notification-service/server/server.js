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
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Missing 'to', 'subject' or 'message'" });
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
      text: message  // detta är korrekt
    });

    res.status(200).json({ message: "Email sent!" });
  } catch (err) {
    console.error("SMTP error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});


const fromRegex = /^[A-Za-z0-9 _åäö]{3,11}$/i;

app.post("/send-sms", async (req, res) => {
  const {
    to,
    message,
    from = "TrafikInfo",
    testMode = false
  } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: "Missing 'to' or 'message'" });
  }

  if (!fromRegex.test(from)) {
    return res.status(400).json({
      error: "Invalid sender name",
      details:
        "Sender must be 3–11 characters and contain only letters, numbers, spaces, underscores, or åäö."
    });
  }

  const recipients = Array.isArray(to) ? to : [to];

  const auth = Buffer.from(`${process.env.SMS_USER}:${process.env.SMS_PASS}`).toString("base64");

  try {
    const response = await axios.post(
      "https://api.hellosms.se/api/v1/sms/send",
      {
        to: recipients,
        from,
        message,
        testMode
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );

    res.status(200).json({
      message: "SMS sent",
      actualFrom: from,
      apiResponse: response.data
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to send SMS",
      details: err.response?.data || err.message
    });
  }
});



app.listen(PORT, () => {
  console.log(`✅ Notification server running on port ${PORT}`);
});
