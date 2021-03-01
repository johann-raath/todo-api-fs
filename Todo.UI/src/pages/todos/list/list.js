import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
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
import { LoaderContext } from '../../../context/loaderContext';
import { ErrorContext } from '../../../context/errorContext';

export function List() {
    const { setLoading } = useContext(LoaderContext);
    const { setErrors } = useContext(ErrorContext);
    const [listItems, setListItems] = useState([]);
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
        { id: 'isComplete', label: 'Complete', minWidth: 170, align: 'left', format: Boolean },
        { id: 'title', label: 'Title', minWidth: 170, align: 'left' },
        { id: 'description', label: 'Description', minWidth: 170, align: 'left' },
        { id: 'id', label: '', minWidth: 170, align: 'right', format: "Edit" },
        { id: 'id', label: '', align: 'right', format: "Delete" },
    ];

    const GetListItems = () => {
        // setLoading(true);
        axios.get('http://localhost:5000/api/todos', {
            headers: { Authorization: `Bearer ${getToken()}` }
        }).then(response => {
            setLoading(false);
            const { data } = response;
            setListItems(data);
        }).catch(error => {
            setLoading(false);
            if (error.response.status === 401) setErrors([{ msg: error.response.data.title }]);
            else setErrors([{ msg: "Something went wrong. Please try again later." }]);
        });
    };

    const DeleteTodo = (id) => {
        // setLoading(true);
        axios.delete('http://localhost:5000/api/todos/' + id, {
            headers: { Authorization: `Bearer ${getToken()}` }
        }).then(response => {
            // setLoading(false);            
            GetListItems();
        }).catch(error => {
            //setLoading(false);
            if (error.response.status === 401) setErrors([{ msg: error.response.data.title }]);
            else setErrors([{ msg: "Something went wrong. Please try again later." }]);
        });
    }

    const ToggleComplete = (id, isComplete) => {
        // setLoading(true);
        axios.put('http://localhost:5000/api/todos/' + id + '/IsComplete', {
            value: isComplete ? false : true
        }, {
            headers: { Authorization: `Bearer ${getToken()}` }
        }).then(response => {
            // setLoading(false);      
            GetListItems();
        }).catch(error => {
            //setLoading(false);
            if (error.response.status === 401) setErrors([{ msg: error.response.data.title }]);
            else setErrors([{ msg: "Something went wrong. Please try again later." }]);
        });
    }

    useEffect(() => {
        setErrors(null);
        GetListItems();
    }, []);

    const renderTableCell = (column, row) => {
        const value = row[column.id];
        switch (column.format) {
            case Boolean:
                return (
                    <Checkbox checked={value} name="IsComplete" onChange={() => {
                        ToggleComplete(row["id"], row["isComplete"]);
                    }} />
                );
            case "Edit":
                return (
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        <Link to={"/todo/edit/" + row["id"]}>Edit</Link>
                    </Button>
                );
            case "Delete":
                return (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => { DeleteTodo(value); }} >
                        <DeleteForeverIcon style={{ color: "#fff" }}></DeleteForeverIcon>
                    </Button>
                );
            default:
                return 'foo';
        }
    }

    return (
        <div>
            {listItems.length > 0 ? (
                <div>
                    <TableContainer >
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column, idx) => (
                                        <TableCell
                                            key={"header" + idx}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIdx) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={"row" + rowIdx}>
                                            {columns.map((column, colIdx) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={"row" + rowIdx + "-col" + colIdx} align={column.align}>
                                                        {
                                                            column.format ? renderTableCell(column, row) : value
                                                        }
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
                    <p>You do not have any Todos at the moment. <Button variant="contained" color="primary"><Link to="/todo/create">Create your first Todo</Link></Button></p>
                )
            }
        </div >
    );
}
