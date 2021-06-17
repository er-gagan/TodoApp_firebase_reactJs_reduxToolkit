import { addTodo, deleteAllTodos } from '../../reducers/todos.js'
import { ToastContainer, toast } from 'react-toastify';
import { setDatefun } from './setDateTimeModule.js'
import { addToken } from '../../reducers/token.js';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import React, { useState } from 'react'
import cuid from 'cuid'
import { baseUrl } from '../../Environment.js';

const Form = () => {
    const history = useHistory()
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const dispatch = useDispatch()

    const notify = (type, msg, autoClose) => {
        toast(msg, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar',
            autoClose: autoClose,
            type: type,
        });
    }

    const logOut = () => {
        localStorage.clear()
        dispatch(deleteAllTodos([]))
        dispatch(addToken(null))
        history.push("/login");
        notify("warning", "Something went wrong! Please check your network", 3000)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        let dateObj = setDatefun()
        let user = {
            'id': cuid(),
            'Title': title,
            'Description': desc,
            'Date': String(new Date(dateObj.yyyy, dateObj.mm, dateObj.dd, dateObj.hours, dateObj.minutes, dateObj.seconds))
        }
        try {
            fetch(`${baseUrl}api/todos`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    'Authorization': "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify(user)
            }).then((result) => {
                if (result.status === 200) {
                    dispatch(addTodo(user))
                    notify("success", "Todo is added successfully!", 2000)
                }
                else {
                    logOut()
                }
            })
        }
        catch {
            logOut()
        }

        document.getElementById("myForm").reset();
        document.getElementById("title").focus()
    }

    return (
        <>
            <form onSubmit={handleFormSubmit} id="myForm">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input required autoFocus type="text" className="form-control" onChange={(e) => setTitle(e.target.value)} id="title" placeholder="Enter work title" />
                </div>

                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Description</label>
                    <textarea required type="text" className="form-control" onChange={(e) => setDesc(e.target.value)} id="desc" placeholder="Enter work description" rows="5"></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-danger btn-sm w-25">Submit</button>
                </div>
            </form>
            <ToastContainer />
        </>
    )
}

export default Form