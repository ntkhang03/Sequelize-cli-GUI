const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

// Hàm thực thi lệnh Sequelize CLI
function executeCommand(command, callback) {
  exec(`npx sequelize ${command}`, (error, stdout, stderr) => {
    callback({ error, stdout, stderr });
  });
}

// API endpoint để lấy danh sách file migration/seed
app.get("/api/files/:type", (req, res) => {
  const type = req.params.type;
  let folder = "";

  if (type === "migrations") {
    folder = "./migrations"; // Thay đổi đường dẫn nếu cần
  } else if (type === "seeders") {
    folder = "./seeders"; // Thay đổi đường dẫn nếu cần
  } else {
    return res.status(400).json({ error: "Invalid type" });
  }

  fs.readdir(folder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(files);
  });
});

// API endpoint để thực thi lệnh
app.post("/api/execute", (req, res) => {
  const { command, selectedFile, customCommand } = req.body;
  let fullCommand = command;

  if (selectedFile) {
    fullCommand += ` --name ${selectedFile}`;
  } else if (customCommand) {
    fullCommand = customCommand;
  }

  executeCommand(fullCommand, (result) => {
    // replace color to ""
    result.stderr = result.stderr?.replace(/\u001b\[.*?m/g, "");
    result.stdout = result.stdout?.replace(/\u001b\[.*?m/g, "");
    res.json(result);
  });
});

// Route chính hiển thị giao diện
app.get("/", (req, res) => {
  res.render("sequelizeGUI");
});

app.listen(port, () => {
  console.log(`Sequelize GUI app listening at http://localhost:${port}`);
});
