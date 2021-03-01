import React, { useContext } from 'react';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';
import { UserContext } from '../../context/userContext';
import { useFormInput, setUserSession } from '../../utils/common';
import { useHistory } from "react-router-dom";
import './login.scss';

export function Login() {
    const { setUser } = useContext(UserContext);
    const history = useHistory();
    const username = useFormInput('');
    const password = useFormInput('');

    const AuthenticateUser = async (username, password) => {

        axios.post('http://localhost:5000/api/auth', { email: username.value, password: password.value }).then(response => {
            // setLoading(false);
            setUserSession(response.data.token, username.value);
            setUser(username.value)
            history.push('/');
        }).catch(error => {
            //setLoading(false);
            // if (error.response.status === 401) setError(error.response.data.message);
            // else setError("Something went wrong. Please try again later.");
        });
    }

    return (
        <div>
            <h2>Login</h2>
            <TextField
                id="userName"
                label="User Name"
                variant="outlined"
                {...username}
            />
            <TextField
                id="userPassword"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                {...password}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                    await AuthenticateUser(username, password);
                }}>
                Login
            </Button>
        </div>
    );
}