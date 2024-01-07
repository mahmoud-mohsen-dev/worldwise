import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";
function AppNav() {
    return (
        <div className={styles.nav}>
            <nav>
                <ul>
                    <li>
                        <NavLink to="cities">Cities</NavLink>
                    </li>
                    <li>
                        <NavLink to="countries">countries</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default AppNav;
