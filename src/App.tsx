import { useState } from "react";

import Title from "./components/Title";
import SelectedLink from "./components/SelectedLink";
import UtilBtn from "./components/UtilBtn";
import Notification from "./components/Notification";
import { Plus, Trash2, Settings } from "lucide-react";
import {
    clickPlusBtn,
    clickTrashBtn,
    clickSettingBtn,
} from "./utils/clickUtilBtn";

function App() {
    const [notification, setNotification] = useState<string>("");

    return (
        <div className="App">
            <Title title="Fast Browser" />
            <LinkContainer />
            <UtilBtnContainer />
            <Notification notification={notification} />
        </div>
    );
}


function LinkContainer() {
    return (
        <div className="selected-link--container">
            <SelectedLink link="Naver" />
            <SelectedLink link="Naver" />
            <SelectedLink link="Naver" />
            <SelectedLink link="Naver" />
            <SelectedLink link="Naver" />
            <SelectedLink link="Naver" />
        </div>
    );
}

function UtilBtnContainer() {
    return (
        <div className="util-btn--container">
            <UtilBtn className="plus" tooltip="Add Link" onClick={clickPlusBtn}>
                <Plus size={20} />
            </UtilBtn>
            <UtilBtn
                className="trash"
                tooltip="Delete Link"
                onClick={clickTrashBtn}
            >
                <Trash2 size={20} />
            </UtilBtn>
            <UtilBtn
                className="setting"
                tooltip="Settings"
                onClick={clickSettingBtn}
            >
                <Settings size={20} />
            </UtilBtn>
        </div>
    );
}

export default App;
