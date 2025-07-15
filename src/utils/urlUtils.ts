/**
 * URL을 정규화하여 프로토콜이 없으면 https://를 자동으로 추가합니다
 * @param url 입력된 URL
 * @returns 정규화된 URL
 */
export const normalizeUrl = (url: string): string => {
    if (!url) return '';
    
    // 이미 프로토콜이 있는 경우 그대로 반환
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // 프로토콜이 없는 경우 https:// 추가
    return `https://${url}`;
};

/**
 * URL이 유효한지 검사합니다
 * @param url 검사할 URL
 * @returns 유효한 URL인지 여부
 */
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(normalizeUrl(url));
        return true;
    } catch {
        return false;
    }
}; 