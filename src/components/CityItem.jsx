import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";

function CityItem({ city }) {
    const { currentCity, deleteCity } = useCities();
    const formatDate = (date) =>
        new Intl.DateTimeFormat("en", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    const { position, id } = city;

    return (
        <li>
            <Link
                className={`${styles.cityItem} ${
                    currentCity.id === id ? styles["cityItem--active"] : ""
                }`}
                to={`${city.id}?lat=${position.lat}&lng=${position.lng}`}
            >
                <span className={styles.emoji}>{city.emoji}</span>
                <h3 className={styles.name}>{city.cityName}</h3>
                <time className={styles.date}>{formatDate(city.date)}</time>
                <button
                    className={styles.deleteBtn}
                    onClick={(e) => {
                        deleteCity(id);
                        e.preventDefault();
                    }}
                >
                    &times;
                </button>
            </Link>
        </li>
    );
}

export default CityItem;
