import {
    createContext,
    useEffect,
    useCallback,
    useContext,
    useReducer,
} from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:8000";

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "cities/loaded":
            return {
                ...state,
                cities: action.payload,
                isLoading: false,
            };
        case "city/loaded":
            return {
                ...state,
                currentCity: action.payload,
                isLoading: false,
            };
        case "city/created":
            return {
                ...state,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
                isLoading: false,
            };
        case "city/deleted":
            return {
                ...state,
                cities: [
                    ...state.cities.filter((city) => {
                        return city.id !== action.payload;
                    }),
                ],
                isLoading: false,
            };
        case "Loading":
            return {
                ...state,
                isLoading: true,
            };
        case "rejected":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            throw new Error("Action Type Is Not Defined.");
    }
}

function CitiesProvider({ children }) {
    const [citiesReducer, dispatch] = useReducer(reducer, initialState);
    const { cities, isLoading, currentCity, error } = citiesReducer;

    useEffect(() => {
        async function fetchCities() {
            try {
                dispatch({ type: "Loading" });
                const res = await fetch(`${BASE_URL}/cities`);
                if (!res.ok) throw new Error(res.status);
                const data = await res.json();
                dispatch({ type: "cities/loaded", payload: data });
            } catch (err) {
                dispatch({
                    type: "rejected",
                    payload: "There was an error loading cities...",
                });
                console.log(err);
            }
        }
        fetchCities();
    }, []);

    const getCity = useCallback(
        function getCity(id) {
            if (Number(id) === currentCity.id) return;
            async function fetchCity() {
                try {
                    dispatch({ type: "Loading" });
                    const res = await fetch(`${BASE_URL}/cities/${id}`);
                    if (!res.ok) throw new Error(res.status);
                    const data = await res.json();
                    dispatch({
                        type: "city/loaded",
                        payload: data,
                    });
                } catch (err) {
                    dispatch({
                        type: "rejected",
                        payload: "There was an error loading current city...",
                    });
                    console.log(err);
                }
            }
            fetchCity();
        },
        [currentCity.id]
    );

    async function postCity(newCity) {
        try {
            dispatch({ type: "Loading" });
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCity),
            });
            if (!res.ok) throw new Error(res.status);

            const data = await res.json();
            // console.log(data);
            dispatch({
                type: "city/created",
                payload: data,
            });
        } catch (err) {
            dispatch({
                type: "rejected",
                payload: "There was an error creating new city...",
            });
            console.log(err);
        }
    }

    async function deleteCity(cityId) {
        // if (cityId === city.id) return
        try {
            dispatch({ type: "Loading" });
            const res = await fetch(`${BASE_URL}/cities/${cityId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error(res.status);
            }
            // console.log(res);
            dispatch({
                type: "city/deleted",
                payload: cityId,
            });
        } catch (err) {
            alert("There Was an error deleting city...");
            console.log(err);
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                error,
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
