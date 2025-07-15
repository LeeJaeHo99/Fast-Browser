interface Window {
    electronAPI: {
        saveUrl: (url: string, name: string) => void;
        getUrls: () => { name: string; url: string }[];
        clearUrls: () => void;
        setUrls: (urls: { name: string; url: string }[]) => void;
        openUrl: (url: string) => void;
    };
}