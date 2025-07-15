import { Check, CircleX } from "lucide-react";

export default function Notification({ notification }: { notification: string }) {
    switch (notification) {
        case "loading":
            return <Loading className="loading" />;
        case "success":
            return <Success className="success" />;
        case "error":
            return <Error className="error" />;
        default:
            return null;
    }
}


function Loading({ className }: { className: string }) {
    return (
        <div className={`notification ${className}`}>
            <div className="loading-icon"></div>
            <div className="loading-text">Loading...</div>
        </div>
    );
}

function Success({ className }: { className: string }) {
    return (
        <div className={`notification ${className}`}>
            <div className="success-icon">
                <Check size={24} />
            </div>
            <div className="success-text">Success</div>
        </div>
    );
}

function Error({ className }: { className: string }) {
    return (
        <div className={`notification ${className}`}>
            <div className="error-icon">
                <CircleX size={36} />
            </div>
            <div className="error-text">Error</div>
        </div>
    );
}
