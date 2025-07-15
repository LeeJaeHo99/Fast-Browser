import { normalizeUrl } from "../utils/urlUtils";

export default function SelectedLink({ link, url }: { link?: string; url?: string }) {
    const normalizedUrl = normalizeUrl(url || '');
    
    return (
        <a href={normalizedUrl} className="selected-link" target="_blank" rel="noopener noreferrer">
            <img
                src="/assets/icons/earth.png"
                alt="logo"
                className="selected-link--icon"
            />
            <div className="selected-link--title">{link}</div>
        </a>
    );
}