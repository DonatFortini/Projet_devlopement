const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  dialog,
} = require("electron");
const path = require("path");
const { PythonShell } = require("python-shell");

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

let mainWindow: {
  webContents: any;
  loadFile: (arg0: any) => void;
  on: (arg0: string, arg1: () => void) => void;
} | null;

function createWindow() {
  let options: any = {
    mode: "text",
  };
  let pyshell: any = new PythonShell("src/gorfou_api/", options);

  pyshell.on("message", function (message: string) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log("from flask : " + message);
  });

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "../resources/logo_gorfou.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow!.loadFile(path.join(__dirname, "../index.html"));

  mainWindow!.on("closed", function () {
    mainWindow = null;
  });

  mainWindow!.webContents.openDevTools();
}

app.on("ready", createWindow);

//on attend le signal de main.ts
ipcMain.on(
  "open-file-dialog",
  function (event: { reply: (arg0: string, arg1: any) => void }) {
    dialog //avec le module dialog on ouvre une fenêtre
      .showOpenDialog(mainWindow, {
        properties: ["openFile"], //on choisit que la fenêtre est un explorateur de fichier
        filters: [{ name: "CSV", extensions: ["csv"] }], //on filtre pour les csv
      })
      .then((result: { canceled: any; filePaths: string | any[] }) => {
        if (!result.canceled && result.filePaths.length > 0) {
          event.reply("selected-file", result.filePaths[0]); //si l'user a choisis un fichier on répond a main.ts
        } //et on lui envoie le nom du fichier
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
);

//on attend le signal de main.ts
ipcMain.on(
  "show-message-box",
  (
    event: { sender: { send: (arg0: string, arg1: any) => void } },
    arg: any
  ) => {
    const options = {
      //on crée les options de la fenêtre
      type: "question",
      buttons: ["Oui", "Non"],
      message: "êtes-vous sûr de vouloir finaliser le notebook?",
      defaultId: 0, //oui
      title: "Confirmation",
      cancelId: 1, //non
    };
    dialog.showMessageBox(options).then((result: { response: any }) => {
      //avec dialog on crée la fenêtre
      if (result.response === 0) {
        event.sender.send("yes", result.response); //si on clique sur oui on envoie la réponse a main.ts
      }
      event.sender.send("message-box-closed", result.response);
    });
  }
);

ipcMain.on("quit-app", () => {
  app.quit();
});

//on crée un menu sur l'appel de main.ts
ipcMain.on("menu-item", (event: any) => {
  const menu = new Menu(); // on crée menu et on ajoute des item pour chaque options désirées
  menu.append(
    new MenuItem({
      label: "Settings",
      click: function () {
        console.log("Settings clicked");
      },
    })
  );
  menu.append(
    new MenuItem({
      label: "Settings",
      click: function () {
        console.log("Settings clicked");
      },
    })
  );
  menu.append(
    new MenuItem({
      label: "Settings",
      click: function () {
        console.log("Settings clicked");
      },
    })
  );
  menu.append(
    new MenuItem({
      label: "Settings",
      click: function () {
        console.log("Settings clicked");
      },
    })
  );
  menu.append(
    new MenuItem({
      label: "profil",
      click: function () {
        console.log("Settings clicked");
      },
    })
  );
  menu.popup(BrowserWindow.fromWebContents(event.sender));
});
