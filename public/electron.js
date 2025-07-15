const { app, BrowserWindow } = await import("electron");
const path = await import("path");
const isDev = await import("electron-is-dev");
const { fileURLToPath } = await import("url");

// ES 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
    const preloadPath = path.join(__dirname, "preload.js");
    console.log("Preload path:", preloadPath);
    
    mainWindow = new BrowserWindow({
        width: 640,
        height: 476,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            devTools: isDev,
            preload: preloadPath,
        },
        titleBarStyle: 'hiddenInset',
    });

    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: "detach" });
        
        // 페이지 로드 완료 후 electronAPI 확인
        mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents.executeJavaScript(`
                console.log("Checking electronAPI...");
                console.log("window.electronAPI:", window.electronAPI);
                if (window.electronAPI) {
                    console.log("electronAPI methods:", Object.keys(window.electronAPI));
                } else {
                    console.error("electronAPI is not defined!");
                }
            `);
        });
    }

    mainWindow.setResizable(true);
    mainWindow.on("closed", () => {
        mainWindow = null;
        app.quit();
    });
    mainWindow.focus();
}

app.on("ready", createWindow);

app.on("activate", () => {
    if (mainWindow === null) createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});