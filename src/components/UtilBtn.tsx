export default function UtilBtn({
    children,
    className,
}: {
    children: React.ReactNode;
    className: string;
}) {
    return <div className={`util-btn ${className}`}>{children}</div>;
}
