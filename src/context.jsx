/* eslint-disable react/prop-types */

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "./db/apiAuth";
import useFetch from "./hooks/useFetch";

const UrlContext = createContext();

const UrlProvider = ({ children }) => {
    const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser);

    const isAuthenticated = (user?.role === "authenticated") ? true : false;

    let [siteOrigin, setSiteOrigin] = useState("");

    useEffect(() => {
        fetchUser();

        setSiteOrigin(window.location.origin);

    }, []);

    return (
        <UrlContext.Provider value={{ user, fetchUser, loading, isAuthenticated, siteOrigin }}>
            {children}
        </UrlContext.Provider>
    );
};

export const UrlState = () => {
    return useContext(UrlContext);
};

export default UrlProvider;