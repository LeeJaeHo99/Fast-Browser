export default function UtilBtn({
    children,
    className,
    tooltip,
    onClick,
    disabled,
}: {
    children: React.ReactNode;
    className: string;
    tooltip: string;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <div
            className={`util-btn ${className} ${disabled ? "disabled" : ""}`}
            onClick={disabled ? undefined : onClick}
        >
            <div>{children}</div>
            <div className="util-btn--tooltip">{tooltip}</div>
        </div>
    );
}