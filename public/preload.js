const { contextBridge } = require("electron");
const Store = require("electron-store");

try{
    const store = new Store();

    contextBridge.exposeInMainWorld("electronAPI", {
        saveUrl: (url, name) => {
            const prev = store.get("urls", []);
            store.set("urls", [...prev, { name, url }]);
        },
        getUrls: () => {
            return store.get("urls", []);
        },
        clearUrls: () => {
            store.set("urls", []);
        },
        setUrls: (urls) => {
            store.set("urls", urls);
        },
    });
}catch(error){
    console.error("Error initializing store:", error);
}

