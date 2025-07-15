import Title from "./components/Title";
import SelectedLink from "./components/SelectedLink";

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
        </div>
    );
}

export default App;