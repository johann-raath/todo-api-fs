import React, { Component, useContext } from 'react'
import './header.scss';
import { Grid } from "@material-ui/core"
import { Link } from "react-router-dom";
import { UserContext } from '../../context/userContext';
import { Button } from '@material-ui/core';
import { removeUserSession } from "../../utils/common"

export function Header() {
    const { user, setUser } = useContext(UserContext);

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
        >
            <h1>TODO</h1>

            {user && (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        <Link to="/">My Todos</Link>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        <Link to="/todo/create">Create</Link>
                    </Button>
                </div>
            )}

            {user ? (
                <div>
                    <span>{"Welcome " + user}</span>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setUser(null);
                            removeUserSession();
                        }}>
                        Logout
                </Button>
                </div>
            ) : (
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                        >
                            <Link to="/register">Register</Link>
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                        >
                            <Link to="/login">Login</Link>
                        </Button>
                    </div>
                )
            }
        </Grid>
    );
}