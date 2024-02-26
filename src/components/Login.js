import React from 'react';
import { useGoogleLogin, GoogleLogin} from 'react-google-login';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Login({ setUser }){

    const onSuccess = (res) => {
        console.log('Login Success: currentUser:', res.profileObj);
        setUser(res.profileObj)
    };

    const onFailure = (res) => {
        console.log('Login failed: res:', res);
    }

    useGoogleLogin({
        onSuccess,
        onFailure,
        clientId,
    });

    return (
        <div>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                style={{ marginTop:'100px'}}
                isSignedIn={true}
            />
        </div>
    );
}

export default Login;