const { app, BrowserWindow, Tray, nativeImage, globalShortcut, ipcMain, Menu } = await import("electron");
const path = await import("path");
const { fileURLToPath } = await import("url");
const AutoLaunch = (await import("auto-launch")).default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.isPackaged를 사용하여 정확한 환경 감지
const isDev = !app.isPackaged;

let mainWindow;
let tray;

// 전역 단축키 설정 (원하는 단축키로 변경 가능)
const GLOBAL_SHORTCUT = 'CommandOrControl+Shift+X';

// 자동 시작 설정
const autoLauncher = new AutoLaunch({
    name: 'Fast Browser',
    path: app.getPath('exe'), // 실행 파일 경로
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 480,
        height: 470,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
            contextIsolation: true,
            sandbox: false,
            devTools: isDev,
            preload: path.join(__dirname, "preload.cjs"),
        },
        titleBarStyle: 'hiddenInset',
        show: false, // 시작 시 창을 숨김 (상단바에만 아이콘 표시)
        skipTaskbar: true, // 독(Dock)에서 숨김
        alwaysOnTop: true, // 항상 최상위에 표시
        frame: false, // 프레임 제거
        closable: false,      // X 버튼 제거
        minimizable: false,   // 최소화 버튼 제거
        maximizable: false,   // 최대화 버튼 제거
        resizable: false,     // 크기 조정 불가
        movable: false,       // 창 이동 불가
    });

    const url = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(url);

    if (isDev) {
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

    mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
        console.error("❌ Failed to load:", errorDescription);
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

    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            showWindow();
        }
    });

    tray.on('right-click', () => {
                const contextMenu = Menu.buildFromTemplate([
                    {
                        label: '종료하기',
                        click: () => {
                            app.quit();
                            mainWindow.hide();
                        }
                    }
                ]);
                tray.popUpContextMenu(contextMenu);
    });
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

// 중복 실행 방지
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    // 이미 다른 인스턴스가 실행 중이면 종료
    app.quit();
} else {
    // 두 번째 인스턴스가 실행되려 할 때 기존 창을 표시
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
    
    // 자동 시작 설정 (프로덕션 환경에서만)
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
    
    // 전역 단축키 등록
    globalShortcut.register(GLOBAL_SHORTCUT, () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            showWindow();
        }
    });
    
    // 링크 클릭 시 앱 숨기기 이벤트 리스너
    ipcMain.on('hide-app', () => {
        if (mainWindow && mainWindow.isVisible()) {
            mainWindow.hide();
        }
    });
});

app.on("window-all-closed", (e) => {
    e.preventDefault();
});

// 앱 완전 종료 시 트레이와 단축키 정리
app.on('before-quit', () => {
    // 전역 단축키 해제
    globalShortcut.unregisterAll();
    
    if (tray) {
        tray.destroy();
    }
});