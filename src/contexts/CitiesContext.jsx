import { useContext } from "react";
import { createContext, useState, useEffect } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:8000";

function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});

    useEffect(() => {
        async function fetchCities() {
            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                setCities(data);
            } catch (err) {
                alert("There was an error Loading data...");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCities();
    }, []);

    function getCity(id) {
        async function fetchCity() {
            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                setCurrentCity(data);
            } catch (err) {
                alert("There was an error loading data...");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCity();
    }

    async function postCity(newCity) {
        try {
            setIsLoading(true);
            console.log(newCity);
            console.log(JSON.stringify(newCity));
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCity),
            });

            const data = await res.json();
            console.log(data);
            setCities([...cities, data]);
        } catch (err) {
            alert("There Was an error creating data...");
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteCity(cityId) {
        try {
            setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities/${cityId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                console.log(res);
                setCities((prevCities) => {
                    return [...prevCities.filter((city) => city.id !== cityId)];
                });
            }
        } catch (err) {
            alert("There Was an error deleting data...");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                setCurrentCity,
                getCity,
                postCity,
                deleteCity,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

function useCities() {
    const value = useContext(CitiesContext);
    if (value === undefined)
        throw new Error("CitiesContext was used outside the CitiesProvider");
    return value;
}

export { CitiesProvider, useCities };
