const { contextBridge, shell, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const os = require("os");

// 데이터 저장 경로 설정 (macOS 기준)
const appDataPath = path.join(os.homedir(), "Library", "Application Support", "fast-browser");
const dataFilePath = path.join(appDataPath, "links.json");

// 폴더가 없으면 생성
if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
}

// 파일에서 데이터 읽기
function readData() {
    try {
        if (fs.existsSync(dataFilePath)) {
            const fileContent = fs.readFileSync(dataFilePath, 'utf8');
            return JSON.parse(fileContent);
        }
        return [];
    } catch (error) {
        console.error("Error reading data:", error);
        return [];
    }
}

// 파일에 데이터 쓰기
function writeData(data) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

contextBridge.exposeInMainWorld("electronAPI", {
    saveUrl: (url, name) => {
        const data = readData();
        data.push({ name, url });
        writeData(data);
    },
    getUrls: () => {
        return readData();
    },
    clearUrls: () => {
        writeData([]);
    },
    setUrls: (urls) => {
        writeData(urls);
    },
    openUrl: (url) => {
        shell.openExternal(url);
        // 링크를 연 후 앱 숨기기
        ipcRenderer.send('hide-app');
    },
});