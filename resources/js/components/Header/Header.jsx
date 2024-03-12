
import tempLogo from "./tempLogo.png";
import { Link } from "react-router-dom";
import tempIcon from "./ico.png";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./header.module.css";
import AuthUser from "../AuthUser";

export default function Header() {
    const { getToken, logout } = AuthUser();
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <>
            <header>
                <img src={tempLogo} alt="Logo" id={styles.imgLogo}></img>
                <SearchBar />
                <img
                    src={tempIcon}
                    alt="Icon"
                    id={styles.imgIcon}
                    onClick={toggleMenu}
                ></img>
            </header>
            {showMenu && (
                <ul id={styles.menu}>
                    <li>
                        <Link to="/register">
                            <button id={styles.register}>Register</button>
                        </Link>
                    </li>
                    {!getToken() && (
                        <li>
                            <Link to="/login">
                                <button id={styles.login}>Login</button>
                            </Link>
                        </li>
                    )}
                    <li>
                        <button onClick={logout} id={styles.logout}>Logout</button>
                    </li>
                </ul>
            )}
        </>
    );
}