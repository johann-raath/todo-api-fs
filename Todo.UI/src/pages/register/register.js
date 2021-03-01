import React, { useContext } from 'react'
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';
import { UserContext } from '../../context/userContext';
import { useFormInput, removeUserSession } from '../../utils/common';
import { useHistory } from "react-router-dom";
import './register.scss';

export function Register() {
    const { setUser } = useContext(UserContext);
    const history = useHistory();
    const username = useFormInput('');
    const password = useFormInput('');
    const confirmpassword = useFormInput('');

    const RegisterUser = async (username, password) => {

        axios.post('http://localhost:5000/api/auth/register', { email: username.value, password: password.value }).then(response => {
            // setLoading(false);
            removeUserSession();
            history.push('/login');
        }).catch(error => {
            //setLoading(false);
            // if (error.response.status === 401) setError(error.response.data.message);
            // else setError("Something went wrong. Please try again later.");
        });
    }

    return (
        <div>
            <h2>Register</h2>
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
            <TextField
                id="userConfirmPassword"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                {...confirmpassword}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                    await RegisterUser(username, password);
                }}>
                Register
            </Button>
        </div>
    );
}