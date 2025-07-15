const { app, BrowserWindow, Tray, nativeImage, Menu } = await import("electron");
const path = await import("path");
const isDev = await import("electron-is-dev");
const { fileURLToPath } = await import("url");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let tray;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 640,
        height: 495,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
            contextIsolation: true,
            sandbox: false,
            devTools: isDev,
            preload: path.join(__dirname, "preload.cjs"),
        },
        titleBarStyle: 'hiddenInset',
        show: false, // 처음에 창을 숨김
        skipTaskbar: true, // 독(Dock)에서 숨김
        alwaysOnTop: true, // 항상 최상위에 표시
        frame: false, // 프레임 제거
        resizable: false, // 크기 조정 불가
    });

    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

    if (isDev){
        mainWindow.webContents.openDevTools({ mode: "detach" });
    } 

    mainWindow.on('blur', () => {
        if (!mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.hide();
        }
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

function createTray() {
    // 트레이 아이콘 생성 - 상단바용 아이콘 사용
    // macOS는 다크/라이트 모드에 따라 자동으로 색상 반전
    const iconPath = path.join(__dirname, 'assets/icons/logo.png');
    let trayIcon = nativeImage.createFromPath(iconPath);
    
    // 상단바에 맞게 크기 조정 (16x16, 32x32 자동 선택)
    trayIcon = trayIcon.resize({ width: 16, height: 16 });
    trayIcon.setTemplateImage(true); // macOS 다크모드 지원 (검은색 부분이 자동 반전)
    
    tray = new Tray(trayIcon);
    tray.setToolTip('Fast Browser - ⌘+숫자로 빠른 링크 열기');
    
    // 트레이 클릭 시 창 토글
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            showWindow();
        }
    });
    
    // 우클릭 컨텍스트 메뉴 추가
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Fast Browser 열기',
            click: () => {
                showWindow();
            }
        },
        {
            type: 'separator'
        },
        {
            label: '종료',
            click: () => {
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(contextMenu);
}

function showWindow() {
    if (!mainWindow) {
        createWindow();
        return;
    }
    
    // 트레이 아이콘 위치 가져오기
    const trayBounds = tray.getBounds();
    const windowBounds = mainWindow.getBounds();
    
    // 창을 트레이 아이콘 아래에 위치시키기
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
    const y = Math.round(trayBounds.y + trayBounds.height);
    
    mainWindow.setPosition(x, y, false);
    mainWindow.show();
    mainWindow.focus();
}

app.dock.hide(); // 독(Dock)에서 앱 숨김

app.on("ready", () => {
    createWindow();
    createTray();
});

app.on("activate", () => {
    // macOS에서는 트레이 앱이므로 창을 다시 만들지 않음
});

app.on("window-all-closed", (e) => {
    // 창이 모두 닫혀도 앱을 종료하지 않음 (트레이에 남아있음)
    e.preventDefault();
});

// 앱 완전 종료 시 트레이도 정리
app.on('before-quit', () => {
    if (tray) {
        tray.destroy();
    }
});