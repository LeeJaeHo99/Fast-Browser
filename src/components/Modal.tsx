import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "../types/type";
import { saveLinkData } from "../data/data";
import { getFaviconUrl } from "../utils/faviconUtils";

export default function Modal({
    modalType,
    closeModal,
    onDataChange,
    linkData,
    handleNotification,
}: {
    modalType: string;
    closeModal: () => void;
    onDataChange: () => void;
    linkData: Link[];
    handleNotification: (notification: string) => void;
}) {
    switch (modalType) {
        case "add":
            return (
                <AddModal
                    closeModal={closeModal}
                    onDataChange={onDataChange}
                    handleNotification={handleNotification}
                />
            );
        case "trash":
            return (
                <TrashModal
                    closeModal={closeModal}
                    linkData={linkData}
                    onDataChange={onDataChange}
                    handleNotification={handleNotification}
                />
            );
        default:
            return null;
    }
}

function AddModal({
    closeModal,
    onDataChange,
    handleNotification,
}: {
    closeModal: () => void;
    onDataChange: () => void;
    handleNotification: (notification: string) => void;
}) {
    const urlRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (url.length > 0 && name.length > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    };
    const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        if (url.length > 0 && name.length > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (name.trim() && url.trim()) {
                if (url.includes("https://") || url.includes("http://")) {
                    saveLinkData(url, name);
                } else {
                    saveLinkData("https://" + url, name);
                }

                onDataChange?.();

                handleNotification("loading");
                setTimeout(() => {
                    closeModal();
                    handleNotification("success");

                    setTimeout(() => {
                        handleNotification("");
                    }, 1500);
                }, 1000);
            }
        } catch (error) {
            handleNotification("error");
            setTimeout(() => {
                handleNotification("");
            }, 1500);
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
                            placeholder="URL"
                            id="url"
                            ref={urlRef}
                            value={url}
                            onChange={handleUrl}
                        />
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
                    <button
                        type="submit"
                        className={isDisabled ? "disabled" : ""}
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
}

function TrashModal({
    closeModal,
    linkData,
    onDataChange,
    handleNotification,
}: {
    closeModal: () => void;
    linkData: Link[];
    onDataChange: () => void;
    handleNotification: (notification: string) => void;
}) {
    const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
    const [faviconUrls, setFaviconUrls] = useState<{ [key: string]: string }>(
        {}
    );

    useEffect(() => {
        const loadFavicons = async () => {
            const faviconMap: { [key: string]: string } = {};

            for (const link of linkData) {
                const faviconUrl = getFaviconUrl(link.url, 32);

                if (faviconUrl) {
                    // 각 파비콘이 로딩되는지 확인
                    const img = new Image();
                    await new Promise<void>((resolve) => {
                        img.onload = () => {
                            faviconMap[link.name] = faviconUrl;
                            resolve();
                        };
                        img.onerror = () => {
                            faviconMap[link.name] = "/assets/icons/earth.png";
                            resolve();
                        };
                        img.src = faviconUrl;
                    });
                } else {
                    faviconMap[link.name] = "/assets/icons/earth.png";
                }
            }

            setFaviconUrls(faviconMap);
        };

        if (linkData.length > 0) {
            loadFavicons();
        }
    }, [linkData]);

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
        try {
            handleNotification("loading");

            if (selectedLinks.length > 0) {
                const remainingLinks = linkData.filter(
                    (link) => !selectedLinks.includes(link.name)
                );

                if (window.electronAPI) {
                    window.electronAPI.setUrls(remainingLinks);
                }
            }
            onDataChange?.();

            setTimeout(() => {
                closeModal();
                handleNotification("success");

                setTimeout(() => {
                    handleNotification("");
                }, 1500);
            }, 1000);
        } catch (error) {
            handleNotification("error");
            setTimeout(() => {
                handleNotification("");
            }, 1500);
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
                        <label
                            className="link-item"
                            key={link.name}
                            htmlFor={link.name}
                        >
                            <input
                                type="checkbox"
                                onChange={handleCheckbox}
                                value={link.name}
                                id={link.name}
                                checked={selectedLinks.includes(link.name)}
                            />
                            <div className="link-item-content">
                                <img
                                    src={
                                        faviconUrls[link.name] ||
                                        "/assets/icons/earth.png"
                                    }
                                    alt="사이트 아이콘"
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
