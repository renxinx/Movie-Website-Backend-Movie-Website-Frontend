import React from "react";
import { GoogleLogout } from "react-google-login";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Logout({ setUser }){
    const onSuccess = () => {
        setUser(null);
        console.log('Logout made successfully');
    };

    return (
        <div>
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            ></GoogleLogout>
        </div>
    );
}

export default Logout;