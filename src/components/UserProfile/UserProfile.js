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

    // delete profile pic api logic
    const deleteProfilePic = useCallback((user) => {
        let storageRef = firebase.storage().ref();
        let desertRef = storageRef.child(`/users/${user.uid}/profile`)
        desertRef.delete().then(() => {
            setProfilePic("")
            user.updateProfile({ photoURL: "" })
        }).catch(error => {
            notify("error", error.message, 5000)
        })
    }, [])

    // Delete account permanently Btn Functionality
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
                                deleteProfilePic(firebase.auth().currentUser)
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
    }, [dispatch, history, logOut, deleteProfilePic]);

    // upload profile Pic pure logic api
    const uploadProfilePic = useCallback((user) => {
        const storageRef = firebase.storage().ref().child(`/users/${user.uid}/profile`)
        const uploadTask = storageRef.put(newProfilePic)
        uploadTask.on('state_changed', (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
        }, (error) => {
            notify("error", error.message, 5000);
            setProfilePicValidate(false)
            deleteProfilePic(user)
        }, () => {
            setProfilePicValidate(true)
            notify("success", "Pic updated successfully", 3000)
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                user.updateProfile({ photoURL: downloadURL })
                setProfilePic(downloadURL)
            });
        })
    }, [newProfilePic, deleteProfilePic])

    // Update btn hide and show logic
    useEffect(() => {
        let updateBtn = document.getElementById("updateBtn")
        if (usernameValidate && emailValidate && profilePicValidate) {
            updateBtn.disabled = false
        } else {
            updateBtn.disabled = true
        }
    }, [usernameValidate, emailValidate, profilePicValidate])

    // Pic_delete icon logo functionality
    useEffect(() => {
        const deletePicIcon = document.getElementById("deletePicIcon")
        let iTag = document.getElementById("iTag")
        if (deletePicIcon) {
            deletePicIcon.addEventListener("mouseover", () => {
                iTag.classList = "bi bi-trash-fill"
                deletePicIcon.style.cursor = "pointer"
                deletePicIcon.onclick = () => {
                    const user = firebase.auth().currentUser
                    if (user) {
                        deleteProfilePic(user)
                    }
                }
            })
            deletePicIcon.addEventListener("mouseleave", () => {
                iTag.classList = "bi bi-trash"
            })
        }
    });

    // pic uploading by html tag functionality handle
    useEffect(() => {
        const user = firebase.auth().currentUser
        if (newProfilePic) {
            setProfilePicValidate(false)
            uploadProfilePic(user)
        } else {
            setProfilePicValidate(true)
        }
    }, [newProfilePic, uploadProfilePic])

    // Update email and username functionality
    const updateInformation = (e) => {
        e.preventDefault()
        try {
            const user = firebase.auth().currentUser
            if (user.displayName.toString() !== username.toString()) {
                user.updateProfile({ displayName: username })
                notify("success", "Information is updated successfully", 3000)
            } else {
                notify("info", "Old and new username is match! Therefore username cann't update", 3000)
            }
            if (user.email.toString() !== email.toString()) {
                user.updateEmail(email)
                notify("success", "Information is updated successfully", 3000)
            } else {
                notify("info", "Old and new email is match! Therefore email cann't update", 3000)
            }
        } catch {
            logOut()
        }
    }

    return (
        <div className="container my-2">
            <h3>Your Information</h3>

            {profilePic ?
                <>
                    <img src={profilePic} id="showImg" alt="NoImg" width="10%" />
                    <span id="deletePicIcon"><i id="iTag" className="bi bi-trash" style={{ fontSize: "25px" }}></i></span>
                </>
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
            <input type="button" id="deleteBtn" value="Delete Account" className="btn btn-info btn-sm" />
        </div>
    )
}

export default UserProfile
