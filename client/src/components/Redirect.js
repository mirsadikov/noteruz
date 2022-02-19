import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Redirect() {
    let [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const redirectUrl = searchParams.get("redirect");
        if (redirectUrl) {
            navigate(redirectUrl);
        }
    }, [navigate, searchParams]);
    return <></>;
}

export default Redirect;
