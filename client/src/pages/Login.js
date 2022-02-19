import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight } from "akar-icons";

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
        <div className="box form">
            <h1 className="form-label">Login</h1>
            {!logging && <Auth />}
            {logging && loading && <Loader />}
            {loginError && <p className="error">{loginError}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                />
                <input type="submit" />
            </form>

            <Link to="/register" className="link reference">
                Register here <ArrowRight strokeWidth={2} size={12} />
            </Link>
        </div>
    );
}

export default Login;
