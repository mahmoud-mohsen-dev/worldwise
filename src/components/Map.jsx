import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";

function Map() {
    const [mapPosition, setMapPosition] = useState([
        30.04010515281878, 31.241950789456556,
    ]);
    const { cities } = useCities();

    const {
        isLoading: isLoadingPosition,
        position: geoLoactionPosition,
        getPosition,
    } = useGeolocation();

    const [lat, lng] = useUrlPosition();

    useEffect(() => {
        if (!lat || !lng) return;
        setMapPosition([lat, lng]);
    }, [lat, lng]);

    useEffect(() => {
        if (geoLoactionPosition) {
            setMapPosition([geoLoactionPosition.lat, geoLoactionPosition.lng]);
        }
    }, [geoLoactionPosition]);
    return (
        <main className={styles.mapContainer}>
            {!geoLoactionPosition && (
                <Button type="position" onClick={getPosition}>
                    {isLoadingPosition ? "Loading..." : "Use Your position"}
                </Button>
            )}

            <MapContainer
                center={mapPosition}
                zoom={6}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) => {
                    return (
                        <Marker
                            position={[city.position.lat, city.position.lng]}
                            key={city.id}
                        >
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    );
                })}

                <ChangeViewMap position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </main>
    );
}

const ChangeViewMap = ({ position }) => {
    const view = useMap();
    view.setView(position);
    return null;
};

const DetectClick = () => {
    const navigate = useNavigate();

    useMapEvent({
        click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    });
};

export default Map;
