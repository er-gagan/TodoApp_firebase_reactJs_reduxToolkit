import { getAuthorizedData } from '../../Credentials/Firebase/SocialAuthentication/getAuthData';
import firebase from '../../Credentials/Firebase/firebaseCredential';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { deleteAllTodos } from '../../reducers/todos';
import { confirmAlert } from 'react-confirm-alert';
import { addToken } from '../../reducers/token';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [profilePic, setProfilePic] = useState('')

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
        notify("warning", "Something went wrong, Please check your internet and information!", 4000)
    }, [dispatch])

    // Get user info
    useEffect(() => {
        try {
            firebase.auth().onAuthStateChanged((user) => {
                const userInfo = getAuthorizedData(user)
                setUsername(userInfo['username'])
                setEmail(userInfo['email'])
                setProfilePic(userInfo['photoUrl'])
            })
        }
        catch {
            logOut()
        }
    }, [logOut])

    // Delete Btn Functionality
    useEffect(() => {
        document.getElementById("deleteBtn").addEventListener("click", (e) => {
            e.preventDefault()
            confirmAlert({
                title: 'Delete Account',
                message: 'Are you sure to delete your account permanently.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            try {
                                firebase.auth().onAuthStateChanged((user) => {
                                    user.delete().then(() => {
                                        localStorage.clear()
                                        dispatch(deleteAllTodos([]))
                                        dispatch(addToken(null))
                                        history.push('/')
                                        notify("success", "Your account is deleted permanently!", 5000)
                                    })
                                })
                            }
                            catch {
                                logOut()
                            }
                        }
                    },
                    {
                        label: 'No'
                    }
                ]
            });
        })
    }, [dispatch, history, logOut]);

    return (
        <div className="container my-2">
            <h3>Your Information</h3>
            {profilePic ?
                <img src={profilePic} id="showImg" alt="NoImg" width="10%" />
                : <></>
            }
            <div className="row">
                {
                    username ?
                        <>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input disabled required type="text" className="form-control" id="username" value={username} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input disabled required type="email" className="form-control" id="email" placeholder="name@example.com" value={email} />
                                </div>
                            </div>
                        </>
                        :
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input disabled required type="email" className="form-control" id="email" placeholder="name@example.com" value={email} />
                        </div>
                }
            </div>

            <div className="text-center">
                <input type="button" id="deleteBtn" value="Delete Account" className="btn btn-info btn-sm" />
            </div>
        </div>
    )
}

export default UserProfile