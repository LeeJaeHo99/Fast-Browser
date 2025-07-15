import { useRef, useState } from "react";
import { X } from "lucide-react";

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
        case "setting":
            return <SettingModal closeModal={closeModal} />;
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
            <h2>📍 Add Link 📍</h2>
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
    return (
        <div className="modal" onClick={closeModal}>
            TrashModal
        </div>
    );
}

function SettingModal({ closeModal }: { closeModal: () => void }) {
    return (
        <div className="modal" onClick={closeModal}>
            SettingModal
        </div>
    );
}
