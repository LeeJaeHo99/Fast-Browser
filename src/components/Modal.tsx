import { useRef, useState } from "react";
import { X } from "lucide-react";
import { normalizeUrl, isValidUrl } from "../utils/urlUtils";

type Link = {
    name: string;
    url: string;
};

export default function Modal({
    modalType,
    closeModal,
    onDataChange,
    linkData = [],
}: {
    modalType: string;
    closeModal: () => void;
    onDataChange?: () => void;
    linkData?: Link[];
}) {
    switch (modalType) {
        case "add":
            return <AddModal closeModal={closeModal} onDataChange={onDataChange} />;
        case "trash":
            return <TrashModal closeModal={closeModal} onDataChange={onDataChange} linkData={linkData} />;
        default:
            return null;
    }
}

function AddModal({ 
    closeModal,
    onDataChange 
}: { 
    closeModal: () => void;
    onDataChange?: () => void;
}) {
    const urlRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [urlError, setUrlError] = useState<string>("");

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    
    const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputUrl = e.target.value;
        setUrl(inputUrl);
        
        // URL 유효성 검사
        if (inputUrl && !isValidUrl(inputUrl)) {
            setUrlError("올바른 URL 형식이 아닙니다");
        } else {
            setUrlError("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && url.trim() && !urlError) {
            const normalizedUrl = normalizeUrl(url);
            
            // electronAPI 존재 확인 및 fallback 처리
            if (typeof window !== 'undefined' && window.electronAPI) {
                console.log("Saving with electronAPI:", normalizedUrl, name);
                window.electronAPI.saveUrl(normalizedUrl, name);
                onDataChange?.(); // 데이터 변경 알림
                closeModal();
            } else {
                console.warn("electronAPI not available. Running in development mode?");
                // 개발 환경에서는 localStorage를 fallback으로 사용
                const savedUrls = JSON.parse(localStorage.getItem("dev-urls") || "[]");
                savedUrls.push({ name, url: normalizedUrl });
                localStorage.setItem("dev-urls", JSON.stringify(savedUrls));
                onDataChange?.();
                closeModal();
            }
        }
    };

    return (
        <div className="modal add-modal">
            <h2>Add Link</h2>
            <button className="close-btn" onClick={closeModal}>
                <X />
            </button>
            <div className="modal--content">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="url">
                        <span>URL</span>
                        <input
                            type="text"
                            placeholder="예: www.naver.com 또는 https://www.naver.com"
                            id="url"
                            ref={urlRef}
                            value={url}
                            onChange={handleUrl}
                            className={urlError ? "error" : ""}
                        />
                        {urlError && <span className="error-message">{urlError}</span>}
                        {url && !urlError && (
                            <span className="url-preview">
                                링크: {normalizeUrl(url)}
                            </span>
                        )}
                    </label>
                    <label htmlFor="name">
                        <span>Site Name</span>
                        <input
                            type="text"
                            placeholder="Site Name"
                            id="name"
                            value={name}
                            onChange={handleName}
                        />
                    </label>
                    <button type="submit" disabled={!name.trim() || !url.trim() || !!urlError}>
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
}

function TrashModal({ 
    closeModal,
    onDataChange,
    linkData 
}: { 
    closeModal: () => void;
    onDataChange?: () => void;
    linkData: Link[];
}) {
    const [selectedLinks, setSelectedLinks] = useState<string[]>([]);

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedLinks([...selectedLinks, e.target.value]);
        } else {
            setSelectedLinks(
                selectedLinks.filter((link) => link !== e.target.value)
            );
        }
    };

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedLinks.length > 0) {
            // 선택된 링크들을 제외한 나머지만 다시 저장
            const remainingLinks = linkData.filter(link => !selectedLinks.includes(link.name));
            
            // 새로운 배열로 전체 데이터를 업데이트
            if (window.electronAPI) {
                window.electronAPI.setUrls(remainingLinks);
            }
            
            onDataChange?.(); // 데이터 변경 알림
            closeModal();
        }
    };

    return (
        <div className="modal delete-modal">
            <h2>Delete Link</h2>
            <button className="close-btn" onClick={closeModal}>
                <X />
            </button>
            <div className="modal--content">
                <form onSubmit={handleDelete}>
                    {linkData.map((link) => (
                        <label className="link-item" key={link.name} htmlFor={link.name}>
                            <input
                                type="checkbox"
                                onChange={handleCheckbox}
                                value={link.name}
                                id={link.name}
                                checked={selectedLinks.includes(link.name)}
                            />
                            <div className="link-item-content">
                                <img
                                    src="/assets/icons/earth.png"
                                    alt="site-icon"
                                />
                                <span>{link.name}</span>
                            </div>
                        </label>
                    ))}
                    <button type="submit">Delete</button>
                </form>
            </div>
        </div>
    );
}