import { Link } from "../types/type";

export const linkData: Link[] = [];

export const loadLinkData = (): Link[] => {
    if (typeof window !== 'undefined') {
        if (window.electronAPI) {
            return window.electronAPI.getUrls();
        }
    }
    return [];
};

export const saveLinkData = (url: string, name: string): void => {
    if (typeof window !== 'undefined') {
        if (window.electronAPI) {
            window.electronAPI.saveUrl(url, name);
        }
    }
};