export default function SelectedLink({ link, url }: { link: string; url: string }) {
    return (
        <a href={url} className="selected-link">
            <img
                src="/assets/icons/earth.png"
                alt="logo"
                className="selected-link--icon"
            />
            <div className="selected-link--title">{link}</div>
        </a>
    );
}