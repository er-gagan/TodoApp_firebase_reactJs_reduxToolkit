import { getAuthorizedData } from '../../Credentials/Firebase/SocialAuthentication/getAuthData.js';
import firebase from '../../Credentials/Firebase/firebaseCredential'
import { deleteAllTodos } from '../../reducers/todos.js'
import { ToastContainer, toast } from 'react-toastify';
import { setDatefun } from './setDateTimeModule.js'
import { addToken } from '../../reducers/token.js';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import React, { useState, useEffect, useCallback } from 'react'
import cuid from 'cuid'

const Form = () => {
    const history = useHistory()
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [userUID, setUserUID] = useState('')
    const [allTodos, setAllTodos] = useState([])
    const dispatch = useDispatch()

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
        notify("warning", "Something went wrong! Please check your network", 3000)
    },[dispatch, history])

    useEffect(() => {
        try {
            firebase.auth().onAuthStateChanged((user) => {
                const userInfo = getAuthorizedData(user)
                if(userInfo){
                    setUserUID(userInfo['uid'])
                }
            })
            if (userUID.toString()) {
                const unsubscribe = firebase.firestore().collection("todos").doc(userUID.toString()).onSnapshot(docSnap => {
                    if (docSnap.exists) {
                        setAllTodos(docSnap.data().todos)
                    }
                })
                return () => {
                    unsubscribe()
                }
            }
        }
        catch (error) {
            logOut()
        }
    }, [userUID, logOut])

    const handleFormSubmit = (e) => {
        e.preventDefault()
        let dateObj = setDatefun()
        let todoInfo = {
            'id': cuid(),
            'Title': title,
            'Description': desc,
            'Date': String(new Date(dateObj.yyyy, dateObj.mm, dateObj.dd, dateObj.hours, dateObj.minutes, dateObj.seconds))
        }
        try {
            // If collection isn't exist then created.
            firebase.firestore().collection("todos").doc(userUID.toString()).set({ todos: [...allTodos, todoInfo] })
            dispatch(deleteAllTodos([]))
            notify("success", "Todo is added successfully!", 2000)
        }
        catch (error) {
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