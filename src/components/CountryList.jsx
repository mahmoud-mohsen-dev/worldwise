import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";

function CountryList({ cities, isLoading }) {
    const countries = [];
    for (let i = 0; i < cities.length; i++) {
        const isUinque = countries.every((country) => {
            return cities[i].country !== country.country;
        });
        if (isUinque) {
            countries.push({
                country: cities[i].country,
                emoji: cities[i].emoji,
                id: "random" + i,
            });
        }
    }
    if (isLoading) return <Spinner />;
    if (!countries.length)
        return (
            <Message message="Add your first city by clicking on a city on the map" />
        );
    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                <CountryItem country={country} key={country.id} />
            ))}
        </ul>
    );
}

export default CountryList;
