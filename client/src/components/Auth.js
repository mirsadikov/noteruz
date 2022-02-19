import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserProfile } from "../actions/userActions";
import Loader from "./Loader";

function Auth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { profile, error, ok, loading } = useSelector((state) => state.user);

    useEffect(() => {
        if (!error && !profile) {
            dispatch(getUserProfile());
        } else if (!ok && location.pathname !== "/register") navigate("/login");
    }, [profile, ok, dispatch, error, navigate, location.pathname]);

    return <div>{loading && <Loader />}</div>;
}

export default Auth;
