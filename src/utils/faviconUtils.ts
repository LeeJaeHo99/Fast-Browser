/**
 * URL에서 도메인을 추출합니다
 */
export function extractDomain(url: string): string | null {
    try {
        // URL이 프로토콜이 없으면 추가
        let normalizedUrl = url;
        if (!url.includes('://')) {
            normalizedUrl = 'https://' + url;
        }
        
        const urlObj = new URL(normalizedUrl);
        return urlObj.hostname;
    } catch (error) {
        console.error('도메인 추출 실패:', error);
        return null;
    }
}

/**
 * Google Favicon API를 사용해서 파비콘 URL을 생성합니다
 */
export function getFaviconUrl(url: string, size: number = 32): string | null {
    const domain = extractDomain(url);
    if (!domain) return null;
    
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${domain}`;
}

/**
 * 파비콘이 로딩되었는지 확인합니다
 */
export function checkFaviconExists(faviconUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = faviconUrl;
    });
} 