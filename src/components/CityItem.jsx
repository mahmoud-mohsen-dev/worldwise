import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";

function CityItem({ city }) {
    const formatDate = (date) =>
        new Intl.DateTimeFormat("en", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    const { position } = city;
    return (
        <li>
            <Link
                className={styles.cityItem}
                to={`${city.id}?lat=${position.lat}&lng=${position.lng}`}
            >
                <span className={styles.emoji}>{city.emoji}</span>
                <h3 className={styles.name}>{city.cityName}</h3>
                <time className={styles.date}>{formatDate(city.date)}</time>
                <button className={styles.deleteBtn}>&times;</button>
            </Link>
        </li>
    );
}

export default CityItem;
