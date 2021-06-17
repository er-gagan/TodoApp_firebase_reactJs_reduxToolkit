import { addTodo, deleteAllTodos, deleteTodo, updateTodo } from '../../reducers/todos.js'
import { setDatefun, setTimefun, Datefun } from './setDateTimeModule.js'
import { useSelector, useDispatch } from 'react-redux'
import { addToken } from '../../reducers/token.js';
import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../Environment.js';

const Card = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [id, setId] = useState('')
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [searchTodos, setSearchTodos] = useState('')

    const notify = (type, msg, autoClose) => {
        toast(msg, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar',
            autoClose: autoClose,
            type: type,
        });
    }

    const logOut = useCallback(() => {
        localStorage.clear()
        dispatch(deleteAllTodos([]))
        dispatch(addToken(null))
        history.push("/login");
        notify("warning", "Something went wrong! Please check your network and re-loggin", 3000)
    }, [dispatch, history])

    useEffect(() => {
        try {

            fetch(`${baseUrl}api/todos`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    'Authorization': "Bearer " + localStorage.getItem("token")
                },
            }).then((result) => {
                if (result.status === 200) {
                    result.json().then((response) => {
                        response.map(todo => {
                            dispatch(addTodo(todo))
                            return true
                        })
                    })
                }
                else {
                    logOut()
                }
            })
        }
        catch {
            logOut()
        }
    }, [dispatch, logOut]);

    const todos = useSelector((state) => state.todos.data);

    const openbtn = (id, title, desc, date) => {
        setId(id)
        setTitle(title)
        setDesc(desc)
        setDate(Datefun(new Date(date)))
        setTime(setTimefun(new Date(date)))
    }

    const deletebtn = (id) => {
        try {
            fetch(`${baseUrl}api/todos`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    'Authorization': "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ 'id': id })
            }).then((result) => {
                if (result.status === 200) {
                    dispatch(deleteTodo(id))
                    notify("success", "Todo is deleted successfully!", 2000)
                }
                else {
                    logOut()
                }
            })
        }
        catch {
            logOut()
        }
    }

    const todoUpdate = () => {
        let newTitle = document.getElementById("editTitle").value
        let newDesc = document.getElementById("editDesc").value
        let dateObj = setDatefun()

        let updatedTodo = {
            'id': id,
            'Title': newTitle,
            'Description': newDesc,
            'Date': String(new Date(dateObj.yyyy, dateObj.mm, dateObj.dd, dateObj.hours, dateObj.minutes, dateObj.seconds))
        }

        try {
            fetch(`${baseUrl}api/todos`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    'Authorization': "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify(updatedTodo)
            }).then((result) => {
                if (result.status === 200) {
                    dispatch(updateTodo(updatedTodo))
                    notify("success", "Todo is updated successfully!", 2000)
                }
                else {
                    logOut()
                }
            })
        }
        catch {
            logOut()
        }
    }

    // sort todos date and time wise
    const mySortedTodos = todos.slice().sort((a, b) => new Date(b.Date) - new Date(a.Date))

    // search todos title and description wise
    const filteredCountries = mySortedTodos.filter((todoItem) => {
        return (
            todoItem.Title.toLowerCase().indexOf(searchTodos.toLowerCase()) !== -1 ||
            todoItem.Description.toLowerCase().indexOf(searchTodos.toLowerCase()) !== -1
        )
    });

    if (todos.length) {
        const taskItems = filteredCountries.map((item) => {
            return (
                <div key={item.id} className="col-md-3">
                    <div className="card my-2 shadow bg-body rounded" style={{ width: "16rem" }}>
                        <div className="card-body">
                            <h5 className="card-title">{(item.Title.length > 15) ? item.Title.slice(0, 15) + "..." : item.Title}</h5>
                            <hr />
                            <h6 className="card-subtitle mb-2 text-muted">Description</h6>
                            <p className="card-text" style={{ textAlign: 'justify' }}>{(item.Description.length > 100) ? item.Description.slice(0, 100) + "..." : item.Description}</p>

                            <div className="text-center">
                                <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-info btn-sm" onClick={() => openbtn(item.id, item.Title, item.Description, item.Date)}>Open</button>

                                <button className="btn btn-warning btn-sm mx-3" onClick={() => deletebtn(item.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })

        return (
            <>
                {/* Modal for open button start */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <span className="modal-title h4" id="exampleModalLabel">Edit Todo&nbsp;</span>
                                <span className="modal-title h5">{date}&nbsp;</span>
                                <span className="modal-title h5">{time}</span>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="editTitle" className="form-label">Title</label>
                                    <input type="text" onChange={(e) => setTitle(e.target.value)} className="form-control" id="editTitle" value={title} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="editDesc" className="form-label">Description</label>
                                    <textarea type="text" className="form-control" id="editDesc" onChange={(e) => setDesc(e.target.value)} value={desc} rows="5" ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" onClick={() => todoUpdate()} className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal for open button end */}

                <div className="row">
                    <div className="col-md-5">
                        <input type="search" onChange={(e) => setSearchTodos(e.target.value)} value={searchTodos} className="form-control my-3" id="search" placeholder="Enter keywords for search todos.." />
                    </div>
                </div>
                {taskItems}
                {/* <ToastContainer /> */}
            </>
        )
    }
    else {
        return (
            <>
            </>
        )
    }
}

export default Card