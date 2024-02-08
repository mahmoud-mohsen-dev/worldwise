import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./User.module.css";

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?img=50",
    // avatar: "https://i.pravatar.cc/100?u=a",
};

function User() {
    const user = FAKE_USER;
    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleClick() {
        logout();
        navigate("/");
    }

    return (
        <div className={styles.user}>
            <img src={user.avatar} alt={user.name} />
            <span>Welcome, {user.name}</span>
            <button onClick={handleClick}>Logout</button>
        </div>
    );
}

export default User;
