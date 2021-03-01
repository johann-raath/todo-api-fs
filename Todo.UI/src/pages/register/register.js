import React, { useContext } from 'react'
import axios from 'axios';
import { TextField, Button, FormGroup } from '@material-ui/core';
import { UserContext } from '../../context/userContext';
import { useFormInput, removeUserSession, validateFields } from '../../utils/common';
import { useHistory } from "react-router-dom";
import './register.scss';
import { LoaderContext } from '../../context/loaderContext';
import { ErrorContext } from '../../context/errorContext';

export function Register() {
    const { setLoading } = useContext(LoaderContext);
    const { setErrors } = useContext(ErrorContext);
    const history = useHistory();
    const username = useFormInput('');
    const password = useFormInput('');
    const confirmpassword = useFormInput('');

    const RegisterUser = async (username, password, confirmpassword) => {
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
            {
                msg: "Confirm Password is required",
                value: confirmpassword.value
            }
        ]);
        setErrors(err);

        console.log(password.value, confirmpassword.value);

        if (err.length == 0) {
            if (password.value === confirmpassword.value) {
                axios.post('http://localhost:5000/api/auth/register', { email: username.value, password: password.value }).then(response => {
                    setLoading(false);
                    removeUserSession();
                    history.push('/login');
                }).catch(error => {
                    setLoading(false);
                    if (error.response.status === 422) setErrors([{ msg: error.response.data }]);
                    else if (error.response.status === 401) setErrors([{ msg: error.response.data.title }]);
                    else setErrors([{ msg: "Something went wrong. Please try again later." }]);
                });
            } else {
                setLoading(false);
                setErrors([{ msg: "Password and Confirm Password must match" }]);
            }
        } else {
            setLoading(false);
        }
    }

    return (
        <div className="register">
            <h2>Register</h2>
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
                        await RegisterUser(username, password, confirmpassword);
                    }}>
                    Register
            </Button>
            </FormGroup>
        </div>
    );
}