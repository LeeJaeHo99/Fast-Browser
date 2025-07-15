import { useRef, useState } from "react";
import { X } from "lucide-react";
import { linkData } from "../data/data";

export default function Modal({
    modalType,
    closeModal,
}: {
    modalType: string;
    closeModal: () => void;
}) {
    switch (modalType) {
        case "add":
            return <AddModal closeModal={closeModal} />;
        case "trash":
            return <TrashModal closeModal={closeModal} />;
        default:
            return null;
    }
}

function AddModal({ closeModal }: { closeModal: () => void }) {
    const urlRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState<string>("");
    const [url, setUrl] = useState<string>("");

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    return (
        <div className="modal add-modal">
            <h2>Add Link</h2>
            <button className="close-btn" onClick={closeModal}>
                <X />
            </button>
            <div className="modal--content">
                <form>
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
                    <button type="submit">Add</button>
                </form>
            </div>
        </div>
    );
}

function TrashModal({ closeModal }: { closeModal: () => void }) {
    const [selectedLinks, setSelectedLinks] = useState<string[]>([]);

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedLinks([...selectedLinks, e.target.value]);
        } else {
            setSelectedLinks(
                selectedLinks.filter((link) => link !== e.target.value)
            );
        }
        console.log(selectedLinks);
    };

    return (
        <div className="modal delete-modal">
            <h2>Delete Link</h2>
            <button className="close-btn" onClick={closeModal}>
                <X />
            </button>
            <div className="modal--content">
                <form action="">
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