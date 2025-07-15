const { contextBridge, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const os = require("os");

// 데이터 저장 경로 설정 (macOS 기준)
const appDataPath = path.join(os.homedir(), "Library", "Application Support", "fast-browser");
const dataFilePath = path.join(appDataPath, "links.json");

// 폴더가 없으면 생성
if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
    console.log("Created data directory:", appDataPath);
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
        console.log("Data saved to:", dataFilePath);
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

contextBridge.exposeInMainWorld("electronAPI", {
    saveUrl: (url, name) => {
        console.log("Saving URL:", url, name);
        const data = readData();
        data.push({ name, url });
        writeData(data);
    },
    getUrls: () => {
        console.log("Getting URLs");
        return readData();
    },
    clearUrls: () => {
        console.log("Clearing URLs");
        writeData([]);
    },
    setUrls: (urls) => {
        console.log("Setting URLs:", urls);
        writeData(urls);
    },
    openUrl: (url) => {
        console.log("Opening URL in default browser:", url);
        shell.openExternal(url);
    },
});