import { useRef, useState } from "react";
import { X } from "lucide-react";
import { Link } from "../types/type";
import { saveLinkData } from "../data/data";

export default function Modal({
    modalType,
    closeModal,
    onDataChange,
    linkData,
}: {
    modalType: string;
    closeModal: () => void;
    onDataChange: () => void;
    linkData: Link[];
}) {
    switch (modalType) {
        case "add":
            return (
                <AddModal closeModal={closeModal} onDataChange={onDataChange} />
            );
        case "trash":
            return (
                <TrashModal
                    closeModal={closeModal}
                    linkData={linkData}
                    onDataChange={onDataChange}
                />
            );
        default:
            return null;
    }
}

function AddModal({
    closeModal,
    onDataChange,
}: {
    closeModal: () => void;
    onDataChange: () => void;
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
        if (name.trim() && url.trim()) {
            saveLinkData("https://" + url, name);
            onDataChange?.();
            closeModal();
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
                    <button type="submit" className={isDisabled ? "disabled" : ""}>Add</button>
                </form>
            </div>
        </div>
    );
}

function TrashModal({
    closeModal,
    linkData,
    onDataChange,
}: {
    closeModal: () => void;
    linkData: Link[];
    onDataChange: () => void;
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
            const remainingLinks = linkData.filter(
                (link) => !selectedLinks.includes(link.name)
            );

            if (window.electronAPI) {
                window.electronAPI.setUrls(remainingLinks);
            }

            onDataChange?.();
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