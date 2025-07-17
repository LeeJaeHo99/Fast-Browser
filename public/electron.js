const { app, BrowserWindow, Tray, nativeImage, globalShortcut, ipcMain, Menu } = await import("electron");
const path = await import("path");
const { fileURLToPath } = await import("url");
const AutoLaunch = (await import("auto-launch")).default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
const GLOBAL_SHORTCUT = 'CommandOrControl+Shift+X';
const DEV_URL = 'http://localhost:3000';
const PRODUCT_URL = `file://${path.join(__dirname, '../build/index.html')}`;
let mainWindow;
let tray;
const autoLauncher = new AutoLaunch({
    name: 'Fast Browser',
    path: process.execPath,
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 380,
        height: 420,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
            contextIsolation: true,
            sandbox: false,
            devTools: isDev,
            preload: path.join(__dirname, "preload.cjs"),
        },
        titleBarStyle: 'hiddenInset',
        show: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        frame: false,
        closable: false,
        minimizable: false,
        maximizable: false,
        resizable: false,
        movable: false,
    });

    mainWindow.loadURL(isDev ? DEV_URL : PRODUCT_URL);

    if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });

    mainWindow.on('blur', () => !mainWindow.webContents.isDevToolsOpened() && mainWindow.hide());
    mainWindow.on("closed", () => mainWindow = null);

    mainWindow.webContents.on("did-fail-load", (e, err, errDescription) => {
        console.error("❌ Failed to load:", errDescription);
    });
}

function createTray() {
    const iconPath = path.join(__dirname, 'assets/icons/logo.png');
    let trayIcon = nativeImage.createFromPath(iconPath);

    trayIcon = trayIcon.resize({ width: 16, height: 16 });
    trayIcon.setTemplateImage(true);

    tray = new Tray(trayIcon);
    tray.setToolTip('Fast Browser - ⌘+숫자로 빠른 링크 열기');

    tray.on('click', () => mainWindow.isVisible() ? mainWindow.hide() : showWindow());

    tray.on('right-click', () => {
        const quitMenu = Menu.buildFromTemplate([
            {
                label: '종료하기',
                click: () => {
                    app.quit();
                    mainWindow.hide();
                }
            }
        ]);
        tray.popUpContextMenu(quitMenu);
    });
}

function showWindow() {
    if (!mainWindow) {
        createWindow();
        return;
    }

    const trayBounds = tray.getBounds();
    const windowBounds = mainWindow.getBounds();

    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
    const y = Math.round(trayBounds.y + trayBounds.height);

    mainWindow.setPosition(x, y, false);
    mainWindow.show();
    mainWindow.focus();
}

app.dock.hide();

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (!mainWindow.isVisible()) {
                showWindow();
            }
            mainWindow.focus();
        }
    });
}

app.on("ready", () => {
    createWindow();
    createTray();
    
    if (!isDev) {
        autoLauncher.isEnabled()
            .then((isEnabled) => {
                if (!isEnabled) {
                    return autoLauncher.enable();
                }
            })
            .catch((err) => {
                console.error('❌ 자동 시작 설정 실패:', err);
            });
    }

    globalShortcut.register(GLOBAL_SHORTCUT, () => mainWindow.isVisible() ? mainWindow.hide() : showWindow());
    
    ipcMain.on('hide-app', () => {
        if (mainWindow && mainWindow.isVisible()) {
            mainWindow.hide();
        }
    });
});

app.on("window-all-closed", (e) => {
    e.preventDefault();
});

app.on('before-quit', () => {
    globalShortcut.unregisterAll();
    
    if (tray) {
        tray.destroy();
    }
});