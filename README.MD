# Sequelize CLI GUI 🚀

A graphical user interface for Sequelize CLI commands, built with Node.js, Express, and Bootstrap.

## ✨ Features

- Execute Sequelize CLI commands through a web interface
- View command descriptions and options
- Select files for specific commands
- Display command output in real-time

## 🛠️ Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/ntkhang03/sequelize-cli-gui.git
    cd sequelize-cli-gui
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the server:

    ```sh
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3001`.

## 📖 Usage

1. Enter the folder path to your Sequelize project in the "Choose Folder" section.
2. Select a command from the "Commands" section.
3. If applicable, select a file from the dropdown menu.
4. Optionally, enter a custom command in the "Custom Command" input field.
5. Click the "Execute" button to run the command.
6. View the output in the "Output" section.

## 🗂️ Project Structure

- `public/js/renderAccordion.js`: Contains the logic to render the accordion items dynamically.
- `public/js/index.js`: Contains the main logic for handling user interactions and executing commands.
- `views/sequelizeGUI.ejs`: The main HTML template for the GUI.
- `app.js`: The main server file that handles API requests and serves the GUI.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## 📸 Screenshots

![Screenshot-1.png](/screenshots/demo.png)

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
