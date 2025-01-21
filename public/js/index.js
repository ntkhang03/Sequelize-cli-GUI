document.addEventListener("DOMContentLoaded", () => {
  const commandButtons = document.querySelectorAll(".command-btn");
  const fileSelectContainer = document.getElementById("file-select-container");
  const fileSelect = document.getElementById("file-select");
  const customCommandInput = document.getElementById("custom-command");
  const executeButton = document.getElementById("execute-btn");
  const outputArea = document.getElementById("output");
  const outputContainer = document.getElementById("output-container");
  const commandDescription = document.getElementById("command-description");
  const folderPath = document.getElementById("folder-path");

  let selectedCommand = "";

  commandButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCommand = button.dataset.command;
      fileSelectContainer.style.display = "none";
      fileSelect.innerHTML = "";
      customCommandInput.value = "";
      commandDescription.textContent = button.dataset.description;
      commandDescription.classList.remove("d-none");

      if (
        selectedCommand === "db:migrate:undo" ||
        selectedCommand === "db:seed:undo"
      ) {
        // Load migration files
        loadFileOptions("migrations");
      } else if (selectedCommand === "db:seed") {
        loadFileOptions("seeders");
      } else if (selectedCommand === "db:migrate") {
        loadFileOptions("migrations");
      }

      customCommandInput.value = selectedCommand;
    });
  });

  customCommandInput.addEventListener("input", () => {
    selectedCommand = customCommandInput.value || "";
    fileSelectContainer.style.display = "none";
    fileSelect.innerHTML = "";
    const description =
      Array.from(commandButtons).find(
        (button) =>
          selectedCommand.split(" ")[0] == button.dataset.command &&
          selectedCommand.startsWith(button.dataset.command)
      )?.dataset.description || "";
    commandDescription.textContent = description;
    if (!commandDescription.textContent) {
      commandDescription.classList.add("d-none");
    } else {
      commandDescription.classList.remove("d-none");
    }
  });

  function loadFileOptions(type) {
    fetch(`/api/files/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ folderPath: folderPath.value })
    })
      .then((response) => response.json())
      .then((files) => {
        fileSelectContainer.style.display = "block";
        files.forEach((file) => {
          const option = document.createElement("option");
          option.value = file;
          option.text = file;
          fileSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error loading files:", error);
        outputArea.textContent = `Error loading files: ${error.message}`;
      });
  }

  if (localStorage.getItem("folderPath")) {
    folderPath.value = localStorage.getItem("folderPath");
  }

  folderPath.addEventListener("input", () => {
    const folder = folderPath.value;
    localStorage.setItem("folderPath", folder);
  });

  executeButton.addEventListener("click", () => {
    executeButton.disabled = true;
    // add loading spinner
    executeButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

    const selectedFile = fileSelect.value;
    const customCommand = customCommandInput.value;

    const requestBody = {
      command: selectedCommand,
      selectedFile: selectedFile,
      customCommand: customCommand,
      folderPath: folderPath.value
    };

    console.log(requestBody);
    fetch("/api/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => response.json())
      .then((result) => {
        outputArea.textContent = "";
        if (result.error) {
          outputContainer.classList.remove("alert-success");
          outputContainer.classList.add("alert-danger");

          outputArea.textContent += `Error: ${typeof result.error === "string" ? result.error : JSON.stringify(result.error, null, 2)}\n`;

          if (result.stderr) {
            outputArea.textContent += `${result.stderr}`;
          }
        } else {
          outputContainer.classList.remove("alert-danger");
          outputContainer.classList.add("alert-success");
          if (selectedCommand == "db:migrate:status") {
            // replace "up" and "down" with icons
            result.stdout = result.stdout.replace(
              /up/g,
              '<i class="bi bi-arrow-up-circle-fill text-success"></i> up'
            );
            result.stdout = result.stdout.replace(
              /down/g,
              '<i class="bi bi-arrow-down-circle-fill text-danger"></i> down'
            );
          }
          outputArea.innerHTML = `${result.stdout}\n`;
        }
      })
      .catch((error) => {
        console.error("Error executing command:", error);
        outputArea.textContent = `Error executing command: ${error.message?.trim()}`;
      })
      .finally(() => {
        executeButton.disabled = false;
        executeButton.innerHTML = "Execute";
      });
  });
});
