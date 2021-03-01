import React, { useContext } from 'react'
import './header.scss';
import { Grid } from "@material-ui/core"
import { Link, useHistory } from "react-router-dom";
import { UserContext } from '../../context/userContext';
import { Button } from '@material-ui/core';
import { removeUserSession } from "../../utils/common"

export function Header() {
    const { user, setUser } = useContext(UserContext);
    const history = useHistory();

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
        >
            <h1>TODO</h1>

            {user && (
                <div className="userActions">
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
                    <span className="salutation">{"Welcome " + user}</span>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setUser(null);
                            removeUserSession();
                            history.push("/");
                        }}>
                        Logout
                </Button>
                </div>
            ) : (
                    <div className="userActions">
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