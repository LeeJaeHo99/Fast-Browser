import { useState } from "react";
import Title from "./components/Title";
import SelectedLink from "./components/SelectedLink";
import UtilBtn from "./components/UtilBtn";
import Notification from "./components/Notification";
import Modal from "./components/Modal";
import { Plus, Trash2, Smile } from "lucide-react";
import { clickPlusBtn, clickTrashBtn } from "./utils/clickUtilBtn";
import { linkData } from "./data/data";

function App() {
    const [notification, setNotification] = useState<string>("");
    const [modal, setModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>("");

    const closeModal = () => {
        setModal(false);
        setModalType("");
    };

    const clickPlus = () => {
        setModal(true);
        setModalType("add");
        clickPlusBtn();
    };

    const clickTrash = () => {
        setModal(true);
        setModalType("trash");
        clickTrashBtn();
    };

    return (
        <div className="App">
            <Title title="Fast Browser" />
            <LinkContainer />
            <UtilBtnContainer
                clickPlus={clickPlus}
                clickTrash={clickTrash}
                length={linkData.length}
            />
            <Notification notification={notification} />
            {modal && <Modal modalType={modalType} closeModal={closeModal} />}
        </div>
    );
}

function LinkContainer() {
    return (
        <div className="selected-link--container">
            {linkData.length === 0 ? (
                <div className="empty-link">
                    <Smile />
                    <span>Please add your link!</span>
                </div>
            ) : (
                linkData.map((link) => {
                    return (
                        <SelectedLink
                            link={link?.name}
                            url={link?.url}
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
                <Plus size={20} />
            </UtilBtn>
            <UtilBtn
                className="trash"
                tooltip="Delete Link"
                onClick={clickTrash}
                disabled={length === 0}
            >
                <Trash2 size={20} />
            </UtilBtn>
        </div>
    );
}

export default App;
