const { contextBridge } = require("electron");
const Store = require("electron-store");

console.log("Preload script is loading...");

try {
    const store = new Store();
    
    console.log("Electron Store initialized");
    
    contextBridge.exposeInMainWorld("electronAPI", {
        saveUrl: (url, name) => {
            console.log("Saving URL:", url, name);
            const prev = store.get("urls", []);
            store.set("urls", [...prev, { name, url }]);
        },
        getUrls: () => {
            const urls = store.get("urls", []);
            console.log("Getting URLs:", urls);
            return urls;
        },
        clearUrls: () => {
            console.log("Clearing URLs");
            store.set("urls", []);
        },
        setUrls: (urls) => {
            console.log("Setting URLs:", urls);
            store.set("urls", urls);
        },
    });
    
    console.log("electronAPI exposed to main world");
} catch (error) {
    console.error("Error in preload script:", error);
}