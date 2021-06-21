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
import { checkLength, MainFieldValidationCheck, undefinedValueLength, InvallidEmailValue } from './Validation'

const UserProfile = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [newProfilePic, setNewProfilePic] = useState('')
    // state for submit button validation start
    const [usernameValidate, setUsernameValidate] = useState(true)
    const [emailValidate, setEmailValidate] = useState(true)
    const [profilePicValidate, setProfilePicValidate] = useState(true)

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

    const usernameValidation = (e) => {
        let Value = e.target.value
        setUsername(Value)
        let regex = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{5,15}$/
        let usernameMsg = document.getElementById("usernameMsg")
        if (Value) {
            if (Value.match(regex) !== null) {
                setUsername(Value)
                if (checkLength(Value, 5, 15, e, usernameMsg)) {   // Value, MinValue, MaxValue, event, usernameMsg
                    setUsernameValidate(true)
                }
                else {
                    setUsernameValidate(false)
                }
            }
            else {
                setUsername(Value)
                let msg = "** Username Incorrect"
                MainFieldValidationCheck(e, usernameMsg, msg)
                setUsernameValidate(false)
            }
        }
        else {
            undefinedValueLength(e, usernameMsg)
        }
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
                InvallidEmailValue(e, emailMsg)
                setEmailValidate(false)
            }
        }
        else {
            undefinedValueLength(e, emailMsg)
        }
    }

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

    const uploadProfilePic = useCallback((user) => {
        const storageRef = firebase.storage().ref().child(`/users/${user.uid}/profile`)
        const uploadTask = storageRef.put(newProfilePic)
        uploadTask.on('state_changed', (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
        }, (error) => {
            console.log(error.message);
            setProfilePicValidate(false)
        }, () => {
            setProfilePicValidate(true)
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                user.updateProfile({ photoURL: downloadURL })
            });
        })
    }, [newProfilePic])

    // Update btn hide and show logic
    useEffect(() => {
        let updateBtn = document.getElementById("updateBtn")
        if (usernameValidate && emailValidate && profilePicValidate) {
            updateBtn.disabled = false
        } else {
            updateBtn.disabled = true
        }
    }, [usernameValidate, emailValidate, profilePicValidate])

    useEffect(() => {
        if (newProfilePic) {
            setProfilePicValidate(false)
            const user = firebase.auth().currentUser
            uploadProfilePic(user)
        }else{
            setProfilePicValidate(true)
        }
    }, [newProfilePic, uploadProfilePic])

    const updateInformation = (e) => {
        e.preventDefault()
        const user = firebase.auth().currentUser
        try {
            user.updateProfile({ displayName: username }).then(() => {
                user.updateEmail(email).then(() => {
                    notify("success", "Information is updated successfully", 4000)
                }).catch(error => {
                    notify("error", error.message, 5000)
                })
            }).catch(error => {
                notify("error", error.message, 5000)
            })
        } catch {
            logOut()
        }
    }

    return (
        <div className="container my-2">
            <h3>Your Information</h3>

            {profilePic ?
                <img src={profilePic} id="showImg" alt="NoImg" width="10%" />
                : <></>
            }
            <form onSubmit={(e) => updateInformation(e)}>
                <div className="row">

                    <div className="col-md-6">
                        <div className="mb-3">
                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="username" className="form-label">Username</label>
                            <input required type="text" className="form-control" id="username" placeholder="Please type a username" onChange={(e) => usernameValidation(e)} value={username} />
                            <div id="usernameMsg"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="email" className="form-label">Email address</label>
                            <input required type="email" className="form-control" id="email" placeholder="name@example.com" onChange={(e) => emailValidation(e)} value={email} />
                            <div id="emailMsg"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="formFile" className="form-label">Upload profile pic</label>
                        <div className="mb-3 input-group">
                            <input className="form-control" type="file" id="formFile" accept="image/*" onChange={(e) => setNewProfilePic(e.target.files[0])} />
                            {newProfilePic ?
                                <img src={URL.createObjectURL(newProfilePic)} width="8%" className="input-group-text" alt="No Img" />
                                : <></>
                            }
                        </div>
                    </div>

                </div>
                <div className="text-center">
                    <input type="submit" id="updateBtn" value="Update Information" className="btn btn-danger btn-sm w-25" />
                </div>
            </form>

            <div className="text-center">
                <input type="button" id="deleteBtn" value="Delete Account" className="btn btn-info btn-sm" />
            </div>
        </div>
    )
}

export default UserProfile
