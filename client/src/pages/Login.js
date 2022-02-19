import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { loginUser } from "../actions/userActions";
import Auth from "../components/Auth";
import Loader from "../components/Loader";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { profile, error, loginError, ok, loading, logging } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        if (ok && !error && !loginError && profile) navigate("/");
    }, [ok, error, loginError, navigate, profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(loginUser(email, password));
    };

    return (
        <div>
            <h1>Login</h1>
            {!logging && <Auth />}
            {logging && loading && <Loader />}
            {loginError && <p>{loginError}</p>}
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

            <hr/>
            <Link to="/register">Register here</Link>
        </div>
    );
}

export default Login;
