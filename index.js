// require("node-fetch");
require("@tensorflow/tfjs-node-gpu");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const toxicity = require("@tensorflow-models/toxicity");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/query", async (req, res) => {
  // Input data in Bahasa Indonesia
  let queryText = req.body.sentence;

  // Translated input data (English)
  var data = "";

  // Tranlsating queryText (ID -> EN)
  query(queryText).then((response) => {
    data = response[0].translation_text;
  });

  const threshold = 0.8;

  console.log("Predicting...  ");

  const model = toxicity.load(threshold);

  model.then((model) => {
    const sentences = [data];

    model.classify(sentences).then((predictions) => {
      const isToxic = predictions.some(
        (prediction) => prediction.results[0].match
      );
      // console.log({ sentences, isToxic });
      console.log(isToxic);
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
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model_hf}`,
    {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}
