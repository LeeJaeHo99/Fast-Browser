const { contextBridge } = require("electron");
const fs = require("fs");
const path = require("path");
const os = require("os");

const appDataPath = path.join(os.homedir(), "Library", "Application Support", "fast-browser");
const dataFilePath = path.join(appDataPath, "links.json");

if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
}

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
});