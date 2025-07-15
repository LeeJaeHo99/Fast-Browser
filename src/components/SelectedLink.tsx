import { useState, useEffect } from 'react';
import { getFaviconUrl } from '../utils/faviconUtils';

export default function SelectedLink({ link, url }: { link?: string; url?: string }) {
    const [faviconUrl, setFaviconUrl] = useState<string>('/assets/icons/earth.png');
    const [faviconLoading, setFaviconLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!url) return;

        setFaviconLoading(true);
        const favicon = getFaviconUrl(url, 32);
        
        if (favicon) {
            const img = new Image();
            img.onload = () => {
                setFaviconUrl(favicon);
                setFaviconLoading(false);
            };
            img.onerror = () => {
                setFaviconUrl('/assets/icons/earth.png');
                setFaviconLoading(false);
            };
            img.src = favicon;
        } else {
            setFaviconUrl('/assets/icons/earth.png');
            setFaviconLoading(false);
        }
    }, [url]);

    const handleClick = () => {
        if (url && window.electronAPI) {
            window.electronAPI.openUrl(url);
        }
    };

    return (
        <div className="selected-link" onClick={handleClick}>
            <img
                src={faviconUrl}
                alt={faviconLoading ? "로딩 중..." : "사이트 아이콘"}
                className="selected-link--icon"
            />
            <div className="selected-link--title">{link}</div>
        </div>
    );
}