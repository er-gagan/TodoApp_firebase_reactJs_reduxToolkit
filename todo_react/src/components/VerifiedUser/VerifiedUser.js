import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { baseUrl } from '../../Environment'
import { deleteAllTodos } from '../../reducers/todos'
import { addToken } from '../../reducers/token'

const VerifiedUser = (props) => {
    let auth_token = props.match.params.auth_token
    let history = useHistory()
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
        history.push('/login')
    }, [dispatch, history])

    useEffect(() => {
        try {
            if (auth_token) {
                fetch(`${baseUrl}api/verify/${auth_token}`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                }).then((result) => {
                    console.log(result);
                    if (result.status === 200) {
                        logOut()
                        notify("success", "Your account is successfully verified! Please login", 4000)
                    }
                    else if (result.status === 208) {
                        logOut()
                        notify("info", "Your account is already verified! Please login", 4000)
                    }
                    else {
                        notify("error", "Something went wrong! Please check your internet connection")
                        history.push('/signup')
                    }
                })
            }
            else {
                notify("error", "Something went wrong! Please check your internet connection")
                history.push('/signup')
            }
        }
        catch {
            notify("error", "Something went wrong! Please check your internet connection")
            history.push('/signup')
        }
    }, [auth_token, history, logOut])

    return (
        <div className="text-center">
            <h3>Processiong...</h3>
            <h4>Your email is verifying...</h4>
            <h2>Please Wait...</h2>
        </div>
    )
}

export default VerifiedUser