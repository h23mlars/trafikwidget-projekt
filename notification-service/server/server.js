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

app.get("/trafikinfo/:county", async (req, res) => {
  try {
    const countyId = req.params.county;
    
    const response = await axios.post('https://api.trafikinfo.trafikverket.se/v2/data.json', {
      auth: {
        key: process.env.TRAFIKVERKET_API_KEY
      },
      query: [
        {
          objecttype: 'Situation',
          filter: {
            and: [
              {
                eq: {
                  property: 'CountyNo',
                  value: countyId
                }
              },
              {
                in: {
                  property: 'DeviationType',
                  values: ['ACCIDENT', 'ROADWORKS', 'SPEED_CAMERA']
                }
              }
            ]
          },
          include: ['Message', 'StartTime', 'EndTime', 'DeviationType']
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const updates = response.data.RESPONSE.RESULT[0].Situation.map(situation => ({
      title: situation.Message,
      description: `Typ: ${situation.DeviationType}`,
      timestamp: situation.StartTime,
      endTime: situation.EndTime
    }));

    res.json(updates);
  } catch (error) {
    console.error('Fel vid hämtning av trafikuppdateringar:', error);
    res.status(500).json({ error: 'Kunde inte hämta trafikuppdateringar' });
  }
});

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

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
  const responses = [];

  for (const number of recipients) {
    const formatted = number.replace(/\s+/g, "");

    try {
      const response = await axios.post(
        "https://api.46elks.com/a1/sms",
        new URLSearchParams({
          from: sender,
          to: formatted,
          message
        }),
        {
          auth: {
            username: process.env.ELKS_USER,
            password: process.env.ELKS_PASS
          }
        }
      );

      responses.push({
        to: formatted,
        id: response.data.id,
        status: response.status
      });
    } catch (err) {
      console.error("SMS error:", err.response?.data || err.message);
      responses.push({
        to: formatted,
        id: "error",
        error: err.response?.data || err.message
      });
    }
  }

  res.status(200).json({ results: responses });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});