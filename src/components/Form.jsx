import { useEffect, useState } from "react";
import Button from "./Button";
import styles from "./Form.module.css";
import BackButton from "./BackButton";
import useUrlPosition from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;

function Form() {
    const { postCity, isLoading } = useCities();
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [emoji, setEmoji] = useState("");
    const [date, setDate] = useState(new Date());
    const [isLoadingGeolocation, setIsLoadingGeoLocation] = useState(false);
    const [notes, setNotes] = useState("");
    const [lat, lng] = useUrlPosition();
    const [geocodingError, setGeocodingError] = useState("");
    const navigateOnSubmit = useNavigate();

    useEffect(() => {
        if (!lat && !lng) return;
        async function reverseGeocode() {
            try {
                setIsLoadingGeoLocation(true);
                setGeocodingError("");
                const res = await fetch(
                    `${BASE_URL}?latitude=${lat}&longitude=${lng}`
                );
                const data = await res.json();
                setCityName(data.city || data.locality || "");
                setCountry(data.countryName);
                const emojiCode = convertToEmoji(data.countryCode);
                setEmoji(emojiCode);
                if (!data.countryCode) {
                    throw new Error(
                        "That doesn't seem to be a city. Click somewhere else 😉"
                    );
                }
            } catch (err) {
                setGeocodingError(err.message);
            } finally {
                setIsLoadingGeoLocation(false);
            }
        }
        reverseGeocode();
    }, [lat, lng]);

    function handleSubmit(e) {
        e.preventDefault();

        if (!date || !cityName) return;

        const newCity = {
            cityName,
            country,
            emoji,
            date,
            notes,
            position: {
                lat: lat,
                lng: lng,
            },
        };

        postCity(newCity);
        navigateOnSubmit("/app/cities");
    }

    if (!lat && !lng) return <Message message="Start by clicking on the map" />;
    if (geocodingError) return <Message message={geocodingError} />;
    if (isLoadingGeolocation) return <Spinner />;

    return (
        <form
            className={`${styles.form} ${isLoading ? styles.loading : ""}`}
            onSubmit={handleSubmit}
        >
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) => setCityName(e.target.value)}
                    value={
                        isLoadingGeolocation
                            ? "Loading..."
                            : `${cityName} , ${country}`
                    }
                />
                <span className={styles.flag}>{emoji}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <DatePicker
                    id="date"
                    selected={date}
                    onChange={(date) => setDate(date)}
                    dateFormat="dd/MM/yyyy"
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">
                    Notes about your trip to {cityName}
                </label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <Button type="primary">Add</Button>
                <BackButton />
            </div>
        </form>
    );
}

export default Form;
