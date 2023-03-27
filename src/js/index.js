"use strict";
const ipcRenderer = require("electron").ipcRenderer;
const os = require("os");
const axios = require("axios");
const button_import = document.getElementById("import");
const fichier_label = document.getElementById("fichier");
function importer_donnees(fileName, filePath) {
    axios
        .post("http://127.0.0.1:5000/import_data", {
        file_name: fileName,
        file_path: filePath,
    })
        .then(function (response) {
        console.log("It says: ", response.data);
    })
        .catch(function (error) {
        console.log(error);
    });
}
if (button_import && fichier_label) {
    button_import.addEventListener("click", function (event) {
        ipcRenderer.send("open-file-dialog");
    });
    ipcRenderer.on("selected-file", function (event, filePath) {
        var _a, _b;
        let fileName = "";
        if (os.type() == "Windows_NT") {
            fileName = (_a = filePath.split("\\").pop()) !== null && _a !== void 0 ? _a : "Unknown file";
        }
        else {
            fileName = (_b = filePath.split("/").pop()) !== null && _b !== void 0 ? _b : "Unknown file";
        }
        fichier_label.innerText = fileName;
        sessionStorage.setItem("label_text", fileName);
        importer_donnees(fileName, filePath);
    });
}
const button_transfo = document.getElementById("transf");
if (button_transfo) {
    button_transfo.addEventListener("click", function () {
        window.location.href = "main.html?menu=1";
    });
}
const button_creatio = document.getElementById("creati");
if (button_creatio) {
    button_creatio.addEventListener("click", function () {
        window.location.href = "main.html?menu=2";
    });
}
const button_visual = document.getElementById("visual");
if (button_visual) {
    button_visual.addEventListener("click", function () {
        window.location.href = "main.html?menu=3";
    });
}
const button_settings = document.getElementById("settings");
if (button_settings) {
    button_settings.addEventListener("click", () => {
        ipcRenderer.send("menu-item");
    });
}