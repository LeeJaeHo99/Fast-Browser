import Title from "./components/Title";
import SelectedLink from "./components/SelectedLink";
import UtilBtn from "./components/UtilBtn";
import { Plus, Trash2, Settings } from "lucide-react";

function App() {
    return (
        <div className="App">
            <Title title="Fast Browser" />
            <div className="selected-link--container">
                <SelectedLink link="Naver" />
                <SelectedLink link="Naver" />
                <SelectedLink link="Naver" />
                <SelectedLink link="Naver" />
                <SelectedLink link="Naver" />
                <SelectedLink link="Naver" />
            </div>
            <div className="util-btn--container">
                <UtilBtn className="plus">
                    <Plus size={20}/>
                </UtilBtn>
                <UtilBtn className="trash">
                    <Trash2 size={20}/>
                </UtilBtn>
                <UtilBtn className="setting">
                    <Settings size={20}/>
                </UtilBtn>
            </div>
        </div>
    );
}

export default App;