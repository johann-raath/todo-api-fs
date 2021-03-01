import React, { useContext, useEffect } from 'react'
import axios from 'axios';
import { TextField, Button, FormGroup } from '@material-ui/core';
import { getToken, useFormInput, validateFields } from '../../../utils/common';
import { useHistory } from "react-router-dom";
import './create.scss';
import { LoaderContext } from '../../../context/loaderContext';
import { ErrorContext } from '../../../context/errorContext';

export function Create() {
    const { setLoading } = useContext(LoaderContext);
    const { setErrors } = useContext(ErrorContext);
    const history = useHistory();
    const title = useFormInput('');
    const description = useFormInput('');

    const CreateTodo = async (title, description) => {
        setLoading(true);
        let err = validateFields([
            {
                msg: "Title is required",
                value: title.value
            },
            {
                msg: "Description is required",
                value: description.value
            },
        ]);
        setErrors(err);

        // TODO : check if todo already exists and prompt to update instead if not completed.

        if (err.length == 0) {
            axios.post('http://localhost:5000/api/todos', {
                title: title.value,
                description: description.value,
                isComplete: false
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
        setErrors(null);
    }, []);

    return (
        <div className="create">
            <h2>Create</h2>
            <FormGroup>
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
            </FormGroup>
        </div>
    );
}