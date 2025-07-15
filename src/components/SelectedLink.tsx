export default function SelectedLink({ link, url }: { link?: string; url?: string }) {
    const handleClick = () => {
        if (url && window.electronAPI) {
            window.electronAPI.openUrl(url);
        }
    };

    return (
        <div className="selected-link" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <img
                src="/assets/icons/earth.png"
                alt="logo"
                className="selected-link--icon"
            />
            <div className="selected-link--title">{link}</div>
        </div>
    );
}