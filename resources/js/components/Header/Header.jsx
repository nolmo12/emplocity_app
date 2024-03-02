import tempLogo from "../images/tempLogo.png";
import tempIcon from "../images/ico.png";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./header.module.css";
export default function Header() {
    return (
        <header>
            <img src={tempLogo} alt="Logo"></img>
            <SearchBar />
            <img src={tempIcon} alt="Icon"></img>
        </header>
    );
}
