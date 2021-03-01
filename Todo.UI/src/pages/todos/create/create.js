import React from 'react'
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';
import { getToken, useFormInput } from '../../../utils/common';
import { useHistory } from "react-router-dom";
import './create.scss';

export function Create() {
    const history = useHistory();
    const title = useFormInput('');
    const description = useFormInput('');

    const CreateTodo = async (title, description) => {
        axios.post('http://localhost:5000/api/todos', {
            title: title.value,
            description: description.value,
            isComplete: false
        }, {
            headers: { Authorization: `Bearer ${getToken()}` }
        }).then(response => {
            // setLoading(false);          
            history.push('/');
        }).catch(error => {
            //setLoading(false);
            // if (error.response.status === 401) setError(error.response.data.message);
            // else setError("Something went wrong. Please try again later.");
        });
    }

    return (
        <div>
            <h2>Create</h2>
            <TextField
                id="todoTitle"
                label="Title"
                variant="outlined"
                {...title}
            />
            <TextField
                id="todoDescription"
                label="Description"
                variant="outlined"
                {...description}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                    await CreateTodo(title, description);
                }}>
                Create
            </Button>
        </div>
    );
}