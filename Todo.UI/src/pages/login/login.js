import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, FormGroup, Grid } from '@material-ui/core';
import { UserContext } from '../../context/userContext';
import { useFormInput, setUserSession } from '../../utils/common';
import { useHistory } from "react-router-dom";
import './login.scss';
import { ErrorContext } from '../../context/errorContext';
import { validateFields } from '../../utils/common';
import { LoaderContext } from '../../context/loaderContext';

export function Login() {
    const { setLoading } = useContext(LoaderContext);
    const { setUser } = useContext(UserContext);
    const { setErrors } = useContext(ErrorContext);
    const history = useHistory();
    const username = useFormInput('');
    const password = useFormInput('');

    const AuthenticateUser = async (username, password) => {
        setLoading(true);
        let err = validateFields([
            {
                msg: "Username is required",
                value: username.value
            },
            {
                msg: "Password is required",
                value: password.value
            },
        ]);
        setErrors(err);

        if (err.length === 0) {
            axios.post('http://localhost:5000/api/auth', { email: username.value, password: password.value }).then(response => {
                const { data } = response;               
                setLoading(false);
                setUserSession(data.token, username.value, data.expires);
                setUser(username.value)
                history.push('/');
            }).catch(error => {
                setLoading(false);
                if (error.response.status === 400) setErrors([{ msg: error.response.data.title + " - Incorrect username or password" }]);
                else if (error.response.status === 401) setErrors([{ msg: error.response.data.title }]);
                else setErrors([{ msg: "Something went wrong. Please try again later." }]);
            });
        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        setErrors(null);
    }, [setErrors]);

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className="center-content"
        >
            <div className="login">
                <h2>Login</h2>
                <FormGroup>
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
                </FormGroup>
            </div >
        </Grid>
    );
}