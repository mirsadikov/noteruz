import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight } from "akar-icons";

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
        <div className="box form">
            <h1 className="form-label">Register</h1>
            {!logging && !registerError && <Auth />}
            {logging && loading && <Loader />}
            {registerError && <p className="error">{registerError}</p>}
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
            <Link to="/login" className="link reference">
                Login here <ArrowRight strokeWidth={2} size={12} />
            </Link>
        </div>
    );
}

export default Register;
