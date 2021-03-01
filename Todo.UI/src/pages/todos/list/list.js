import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { ListContext } from '../../../context/listContext';
import { getToken } from '../../../utils/common';
import { Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Link } from "react-router-dom";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import './list.scss';
import { Checkbox } from '@material-ui/core';

export function List() {

    const { listItems, setListItems } = useContext(ListContext);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const columns = [
        { id: 'title', label: 'Title', minWidth: 170, align: 'left', },
        { id: 'description', label: 'Description', minWidth: 170, align: 'left', },
        { id: 'isComplete', label: 'Complete', minWidth: 170, align: 'right', format: Boolean },
        { id: 'id', label: '', align: 'right', format: "Delete" },
    ];

    const GetListItems = () => {
        axios.get('http://localhost:5000/api/todos', {
            headers: { Authorization: `Bearer ${getToken()}` }
        }).then(response => {
            // setLoading(false);    

            setListItems(response.data);

            console.log(response.data);
        }).catch(error => {
            //setLoading(false);
            // if (error.response.status === 401) setError(error.response.data.message);
            // else setError("Something went wrong. Please try again later.");
        });
    }

    const DeleteTodo = (id) => {
        axios.delete('http://localhost:5000/api/todos/' + id, {
            headers: { Authorization: `Bearer ${getToken()}` }
        }).then(response => {
            // setLoading(false);            
            GetListItems();
        }).catch(error => {
            //setLoading(false);
            // if (error.response.status === 401) setError(error.response.data.message);
            // else setError("Something went wrong. Please try again later.");
        });
    }

    const ToggleComplete = (id, isComplete) => {
        axios.put('http://localhost:5000/api/todos/' + id + '/IsComplete', {
            value: isComplete ? false : true
        }, {
            headers: { Authorization: `Bearer ${getToken()}` }
        }).then(response => {
            // setLoading(false);            
            GetListItems();
        }).catch(error => {
            //setLoading(false);
            // if (error.response.status === 401) setError(error.response.data.message);
            // else setError("Something went wrong. Please try again later.");
        });
    }

    useEffect(() => {
        GetListItems();
    }, [])

    return (
        <div>
            {listItems && listItems.length > 0 ? (
                <div>
                    <TableContainer >
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'boolean'
                                                            ?
                                                            <Checkbox checked={value} name="IsComplete" onChange={() => {
                                                                ToggleComplete(row["id"], row["isComplete"]);
                                                            }} />
                                                            :
                                                            column.format && column.format == "Delete"
                                                                ?
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    onClick={() => { console.log(value); DeleteTodo(value); }} >
                                                                    <DeleteForeverIcon style={{ color: "#fff" }}></DeleteForeverIcon>
                                                                </Button>
                                                                :
                                                                value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={listItems.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </div>
            ) : (
                    <p>You do not have any Todos at the moment. <Link to="/todo/create">Create your first Todo</Link></p>
                )
            }
        </div >
    );
}
