import { useState, useEffect } from "react";
import Title from "./components/Title";
import SelectedLink from "./components/SelectedLink";
import UtilBtn from "./components/UtilBtn";
import Notification from "./components/Notification";
import Modal from "./components/Modal";
import { Plus, Trash2, Smile } from "lucide-react";
import { loadLinkData } from "./data/data";
import { Link } from "./types/type";

function App() {
    const [notification, setNotification] = useState<string>("");
    const [modal, setModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>("");
    const [linkData, setLinkData] = useState<Link[]>([]);

    window.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a") {
            setModalType("add");
            setModal(true);
        }
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
            setModalType("trash");
            setModal(true);
        }
    });

    useEffect(() => {
        const savedData = loadLinkData();
        setLinkData(savedData);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey && !event.shiftKey && !event.altKey && !event.ctrlKey) {
                const number = parseInt(event.key);
                
                if (number >= 1 && number <= 6) {
                    event.preventDefault();
                    
                    const targetIndex = number - 1;
                    
                    if (linkData[targetIndex] && window.electronAPI) {
                        window.electronAPI.openUrl(linkData[targetIndex].url);
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [linkData]);

    const refreshData = () => {
        const updatedData = loadLinkData();
        setLinkData(updatedData);
    };

    const closeModal = () => {
        setModal(false);
        setModalType("");
    };

    const clickPlus = () => {
        setModal(true);
        setModalType("add");
    };

    const clickTrash = () => {
        setModal(true);
        setModalType("trash");
    };

    const handleNotification = (notification: string) => {
        setNotification(notification);
    };

    return (
        <div className="App">
            <Title title="Fast Browser" />
            <LinkContainer linkData={linkData} />
            <UtilBtnContainer
                clickPlus={clickPlus}
                clickTrash={clickTrash}
                length={linkData.length}
            />
            <Notification notification={notification} />
            {modal && (
                <Modal
                    modalType={modalType}
                    closeModal={closeModal}
                    onDataChange={refreshData}
                    linkData={linkData}
                    handleNotification={handleNotification}
                />
            )}
        </div>
    );
}

function LinkContainer({ linkData }: { linkData: Link[] }) {
    return (
        <div className="selected-link--container">
            {linkData.length === 0 ? (
                <div className="empty-link">
                    <Smile />
                    <span>Add Your Links!</span>
                </div>
            ) : (
                linkData.map((link, index) => {
                    return (
                        <SelectedLink
                            link={link?.name}
                            url={link?.url}
                            index={index + 1}
                            key={link?.name}
                        />
                    );
                })
            )}
        </div>
    );
}

function UtilBtnContainer({
    clickPlus,
    clickTrash,
    length,
}: {
    clickPlus: () => void;
    clickTrash: () => void;
    length: number;
}) {
    return (
        <div className="util-btn--container">
            <UtilBtn
                className="plus"
                tooltip="Add Link"
                onClick={clickPlus}
                disabled={length === 6}
            >
                <Plus size={18} />
            </UtilBtn>
            <UtilBtn
                className="trash"
                tooltip="Delete Link"
                onClick={clickTrash}
                disabled={length === 0}
            >
                <Trash2 size={18} />
            </UtilBtn>
        </div>
    );
}

export default App;
