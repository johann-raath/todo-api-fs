import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';
import { getToken, useFormInput } from '../../../utils/common';
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router';
import './edit.scss';

export function Edit() {
    const history = useHistory();
    const [todo, setTodo] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { id } = useParams();

    const GetTodo = async () => {
        axios.get('http://localhost:5000/api/todos/' + id, {
            headers: { Authorization: `Bearer ${getToken()}` }
        }).then(response => {
            // setLoading(false); 
            const { data } = response;
            setTitle(data.title);
            setDescription(data.description);
            setTodo(data);
            console.log(data);
        }).catch(error => {
            //setLoading(false);
            // if (error.response.status === 401) setError(error.response.data.message);
            // else setError("Something went wrong. Please try again later.");
        });
    }

    const UpdateTodo = async () => {
        axios.put('http://localhost:5000/api/todos/' + todo.id, {
            title: title,
            description: description,
            isComplete: todo.isComplete
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

    useEffect(() => {
        GetTodo();
    }, []);

    return (
        <div>
            <h2>Edit</h2>
            <div>
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        UpdateTodo();
                    }}
                >
                    Update
                    </Button>
            </div>

        </div>
    );
}