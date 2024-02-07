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
                alert("There was an error Loading data...");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCity();
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                setCurrentCity,
                getCity,
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
