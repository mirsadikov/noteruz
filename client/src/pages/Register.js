import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { registerUser } from "../actions/userActions";
import Auth from "../components/Auth";
import Loader from "../components/Loader";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { profile, error, registerError, ok, loading, logging } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        if (ok && !error && !registerError && profile) navigate("/");
    }, [ok, error, registerError, navigate, profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(registerUser(email, password));
    };

    return (
        <div>
            <h1>Register</h1>
            {!logging && !registerError && <Auth />}
            {logging && loading && <Loader />}
            {registerError && <p>{registerError}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input type="submit" />
            </form>
        </div>
    );
}

export default Register;
