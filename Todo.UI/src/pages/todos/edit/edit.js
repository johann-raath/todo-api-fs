import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { TextField, Button, Checkbox, FormGroup, FormControlLabel, Grid } from '@material-ui/core';
import { getToken, validateFields } from '../../../utils/common';
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router';
import './edit.scss';
import { LoaderContext } from '../../../context/loaderContext';
import { ErrorContext } from '../../../context/errorContext';

export function Edit() {
    const { setLoading } = useContext(LoaderContext);
    const { setErrors } = useContext(ErrorContext);
    const history = useHistory();
    const [todo, setTodo] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [complete, setComplete] = useState("");
    const [reopen, setReopen] = useState(false);
    const { id } = useParams();

    const GetTodo = async () => {
        axios.get('http://localhost:5000/api/todos/' + id, {
            headers: { Authorization: `Bearer ${getToken()}` }
        }).then(response => {
            setLoading(false);
            const { data } = response;
            setTitle(data.title);
            setDescription(data.description);
            setComplete(data.isComplete);
            setTodo(data);
        }).catch(error => {
            setLoading(false);
            if (error.response.status === 401) setErrors([{ msg: error.response.data.title }]);
            else setErrors([{ msg: "Something went wrong. Please try again later." }]);
        });
    }

    const UpdateTodo = async () => {
        setLoading(true);
        let err = validateFields([
            {
                msg: "Title is required",
                value: title
            },
            {
                msg: "Description is required",
                value: description
            },
        ]);
        setErrors(err);

        if (err.length === 0) {
            axios.put('http://localhost:5000/api/todos/' + todo.id, {
                title: title,
                description: description,
                isComplete: complete
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            }).then(response => {
                setLoading(false);
                history.push('/');
            }).catch(error => {
                setLoading(false);
                if (error.response.status === 400) setErrors([{ msg: error.response.data.title }]);
                else if (error.response.status === 401) setErrors([{ msg: error.response.data.title }]);
                else setErrors([{ msg: "Something went wrong. Please try again later." }]);
            });
        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetTodo();
    }, []);

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className="center-content"
        >
            <div class="text-center">
                <h2>Edit</h2>
                <p><strong>Last updated:</strong> {todo && Date(todo.lastUpdate.ToStrin)}</p>
                <br />
                <div className="edit">
                    <FormGroup>
                        <TextField
                            id="todoTitle"
                            label="Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                            }}
                        />
                        <TextField
                            id="todoDescription"
                            label="Description"
                            variant="outlined"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                        />
                        {(complete || reopen) &&
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={() => {
                                                setComplete(false);
                                                setReopen(true);
                                            }}
                                            name="checkedB"
                                            color="primary"
                                        />
                                    }
                                    label="Task is marked as complete, reopen task?"
                                />
                            </FormGroup>
                        }
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                UpdateTodo();
                            }}
                        >
                            Update
                    </Button>
                    </FormGroup>
                </div>
            </div>
        </Grid>
    );
}