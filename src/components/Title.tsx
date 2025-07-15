export default function Title({title}: {title: string}) {
    return(
        <div className="title-container">
            <div className="logo">🌎</div>
            <h1>{title}</h1>
        </div>
    );
}