import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    return (
        <main
            className={styles.mapContainer}
            onClick={(e) => {
                navigate("form");
            }}
        >
            <h1>Map</h1>
            <h2>
                position: {lat}, {lng}
            </h2>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setSearchParams({ lat: 20, lng: 5 });
                }}
            >
                Change position
            </button>
        </main>
    );
}

export default Map;
