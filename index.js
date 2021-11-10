// require("node-fetch");
require("@tensorflow/tfjs-node-gpu");

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const toxicity = require("@tensorflow-models/toxicity");

const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kindboard.digithon@gmail.com",
    pass: "kindboardpastimenang",
  },
  debug: true,
  logger: true,
  ignoreTLS: true,
});

const mailOptions = {
  from: "kindboard.digithon@gmail.com",
  to: "ariqathallah38@gmail.com",
  subject: "Sending Email via Node.js",
  text: "That was easy!",
};

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.post("/query", async (req, res) => {
  // Input data in Bahasa Indonesia

  let queryText = req.body.sentence;
  // console.log(queryText);

  // Translated input data (English)
  var data = "";

  // Tranlsating queryText (ID -> EN)
  query(queryText).then((response) => {
    data = response[0].translation_text;
    // console.log(data);
  });

  const threshold = 0.8;

  console.log("Predicting...  ");

  const model = toxicity.load(threshold);

  model.then((model) => {
    const sentences = [data];

    model.classify(sentences).then((predictions) => {
      const isToxic = predictions.some((prediction) => prediction.results[0].match);
      // console.log({ sentences, isToxic });
      console.log(isToxic);
      if (isToxic) {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes();
        mailOptions["subject"] = "Anak Anda Terdeteksi Mengirim Ujaran Berunsur Cyberbullying, Simak Untuk Melihat!";
        mailOptions["text"] = `Kalimat yang dikirimkan : "${queryText}"\nWaktu : ${time}`;
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
      res.send(isToxic);
    });
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

// Huggingface Translation Inference API
const API_TOKEN = "api_cKgtdgpQoVbBLiRwWInSDNIaDiwvJanYnx";

const model_hf = "Helsinki-NLP/opus-mt-id-en";

async function query(data) {
  const response = await fetch(`https://api-inference.huggingface.co/models/${model_hf}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}
