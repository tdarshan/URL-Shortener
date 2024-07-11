/* eslint-disable react/prop-types */
import { UrlState } from "@/context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { BarLoader } from "react-spinners";

const RequireAuth = ({childern}) => {

    const navigate = useNavigate();

    const {loading, isAuthenticated} = UrlState();

    useEffect(() => {

        if(!isAuthenticated && loading == false) {
            navigate("/auth");
        }

    }, [isAuthenticated, loading]);

    if(loading) {
        return <BarLoader width={"100%"} color="#36d7b7" />
    }
  
    if(isAuthenticated) {
        return <> {childern} </>;
    }

    return null;
}

export default RequireAuth