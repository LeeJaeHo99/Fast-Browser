type Link = {
    name: string;
    url: string;
};

// 저장된 데이터를 불러오는 함수
export const loadLinkData = (): Link[] => {
    if (typeof window !== 'undefined') {
        if (window.electronAPI) {
            console.log("Loading data with electronAPI");
            return window.electronAPI.getUrls();
        } else {
            console.log("Loading data from localStorage (development fallback)");
            // 개발 환경 fallback: localStorage 사용
            return JSON.parse(localStorage.getItem("dev-urls") || "[]");
        }
    }
    return [];
};

// 새 링크를 저장하는 함수
export const saveLinkData = (url: string, name: string): void => {
    if (typeof window !== 'undefined') {
        if (window.electronAPI) {
            window.electronAPI.saveUrl(url, name);
        } else {
            // 개발 환경 fallback: localStorage 사용
            const savedUrls = JSON.parse(localStorage.getItem("dev-urls") || "[]");
            savedUrls.push({ name, url });
            localStorage.setItem("dev-urls", JSON.stringify(savedUrls));
        }
    }
};

// 초기 데이터 (개발용, 실제로는 저장된 데이터를 사용)
export let linkData: Link[] = [];

// 컴포넌트에서 사용할 데이터 업데이트 함수
export const refreshLinkData = (): Link[] => {
    linkData = loadLinkData();
    return linkData;
};