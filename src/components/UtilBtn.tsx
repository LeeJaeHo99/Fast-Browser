export default function UtilBtn({
    children,
    className,
    tooltip,
    onClick,
}: {
    children: React.ReactNode;
    className: string;
    tooltip: string;
    onClick: () => void;
}) {
    return (
        <div className={`util-btn ${className}`} onClick={onClick}>
            <div>{children}</div>
            <div className="util-btn--tooltip">{tooltip}</div>
        </div>
    );
}