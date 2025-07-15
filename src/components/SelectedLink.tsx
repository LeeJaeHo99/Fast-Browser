export default function SelectedLink({link}: {link: string}) {
    return(
        <a href='www.naver.com' className="selected-link">
            <img src="/assets/icons/earth.png" alt="logo" className="selected-link--icon"/>
            <div className="selected-link--title">{link}</div>
        </a>
    );
}