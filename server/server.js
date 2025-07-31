const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());

// Setup file upload destination
const upload = multer({ dest: "uploads/" });

app.get("/ping", (req, res) => {
  res.json({ data: "hello, world" });
});

app.post("/predict", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const python = spawn("python", ["predict.py", req.file.path]);

  let result = "";
  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Prediction script failed" });
    }
    try {
      const output = JSON.parse(result);
      res.json(output);
    } catch (e) {
      res.status(500).json({ error: "Failed to parse prediction output" });
    }
  });
});

app.listen(80, () => {
  console.log("Server running on http://localhost:80");
});
