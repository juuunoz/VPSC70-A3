const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { spawn, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  const reqPath = path.join(__dirname, "requirements.txt");
  if (fs.existsSync(reqPath)) {
    console.log("Installing Python dependencies...");
    execSync(`pip install -r "${reqPath}"`, { stdio: "inherit" });
  } else {
    console.warn("requirements.txt not found, skipping pip install.");
  }
} catch (err) {
  console.error("Failed to install Python dependencies:", err.message);
}

const app = express();
app.use(cors());

// Setup file upload destination
const upload = multer({ dest: "uploads/" });

app.get("/ping", (req, res) => {
  res.json({ data: "hello, world" });
});

app.post("/predict", upload.single("image"), (req, res) => {
  console.log("received image")
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  console.log("starting prediction")
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
    const cleanResult = result.trim().split("\n").pop();  // last line
    const output = JSON.parse(cleanResult);
    res.json(output);
  } catch (e) {
    console.error("Raw Python output:", result);
    res.status(500).json({ error: "Failed to parse prediction output" });
  }
});

});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
