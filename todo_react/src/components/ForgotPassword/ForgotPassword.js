import { checkLength, undefinedValueLength, MainFieldValidationCheck } from './Validation'
import firebase from '../../Credentials/Firebase/firebaseCredential'
import { deleteAllTodos } from '../../reducers/todos'
import React, { useState, useEffect } from 'react'
import { addToken } from '../../reducers/token'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [email, setEmail] = useState('')
    // state for validation
    const [emailValidate, setEmailValidate] = useState(false)

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
        notify("warning", "Something went wrong, May be network issue or session expiry!", 5000)
    }

    const emailValidation = (e) => {
        let Value = e.target.value
        setEmail(Value)
        let regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/gi
        let emailMsg = document.getElementById("emailMsg")
        if (Value) {
            if (Value.match(regex) !== null) {
                Value = Value.match(regex).join("")
                setEmail(Value)
                if (checkLength(Value, 10, 40, e, emailMsg)) {
                    setEmailValidate(true)
                }
                else {
                    setEmailValidate(false)
                }
            }
            else {
                setEmail(Value)
                let msg = "** Invallid Email"
                MainFieldValidationCheck(e, emailMsg, msg)
                setEmailValidate(false)
            }
        }
        else {
            undefinedValueLength(e, emailMsg)
        }
    }
    useEffect(() => {
        if (emailValidate) {
            document.getElementById('emailBtn').disabled = false
        }
        else {
            document.getElementById('emailBtn').disabled = true
        }
    }, [emailValidate]);

    const emailSubmit = (e) => {
        e.preventDefault()
        try {
            firebase.auth().sendPasswordResetEmail(email).then(() => {
                notify("success", `Email has successfully sent on ${email}`, 5000)
                localStorage.clear()
                dispatch(deleteAllTodos([]))
                dispatch(addToken(null))
                history.push("/login");
            }).catch(error => {
                notify("error", `Something went wrong! ${error.message}`, 5000)
            })
        }
        catch {
            logOut()
        }
    }

    return (
        <div className="container my-2">
            <h3>Forgot Password</h3>
            <form onSubmit={emailSubmit}>
                <div className="mb-3">
                    <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="email" className="form-label">Email address</label>
                    <input autoFocus required type="email" className="form-control" id="email" placeholder="name@example.com" onChange={(e) => emailValidation(e)} value={email} />
                    <div id="emailMsg"></div>
                </div>

                <div className="text-center">
                    <input type="submit" id="emailBtn" value="Submit Email" className="btn btn-danger btn-sm w-25" />
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword