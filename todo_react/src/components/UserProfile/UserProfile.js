import { checkFieldCharacters, undefinedValueLength, checkLength, MainFieldValidationCheck, InvallidEmailValue } from './Validation';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { deleteAllTodos } from '../../reducers/todos';
import { confirmAlert } from 'react-confirm-alert';
import { addToken } from '../../reducers/token';
import { useHistory } from 'react-router-dom';
import { baseUrl } from '../../Environment';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [newProfilePic, setNewProfilePic] = useState('')
    // state for submit button validation start
    const [nameValidate, setNameValidate] = useState(true)
    const [usernameValidate, setUsernameValidate] = useState(true)
    const [phoneValidate, setPhoneValidate] = useState(true)
    const [emailValidate, setEmailValidate] = useState(true)

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

    const nameValidation = (e) => {
        let Value = e.target.value
        setName(Value)
        let regex = /[a-zA-Z ]/gi
        let nameMsg = document.getElementById("nameMsg")
        Value = checkFieldCharacters(Value, regex)
        if (Value !== undefined) {
            setName(Value)
            if (checkLength(Value, 5, 30, e, nameMsg)) {   // Value, MinValue, MaxValue, event, nameMsg
                setNameValidate(true)
            }
            else {
                setNameValidate(false)
            }
        }
        else {
            undefinedValueLength(e, nameMsg)
        }
    }

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

    const phoneValidation = (e) => {
        let Value = e.target.value
        setPhone(Value)
        let regex = /[0-9]/gi
        let phoneMsg = document.getElementById("phoneMsg")
        Value = checkFieldCharacters(Value, regex)
        if (Value !== undefined) {
            setPhone(Value)
            if (checkLength(Value, 10, 10, e, phoneMsg)) {   // Value, MinValue, MaxValue, event, phoneMsg
                setPhoneValidate(true)
            }
            else {
                setPhoneValidate(false)
            }
        }
        else {
            undefinedValueLength(e, phoneMsg)
        }
    }


    useEffect(() => {
        try {
            fetch(`${baseUrl}api/getUser`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    'Authorization': "Bearer " + localStorage.getItem("token")
                }
            }).then((result) => {
                if (result.status === 200) {
                    result.json().then((response) => {
                        setName(response.data['name'])
                        setUsername(response.data['username'])
                        setPhone(response.data['phone'])
                        setEmail(response.data['email'])
                        setGender(response.data['gender'])
                        setProfilePic(response.data['user_pic'])
                    })
                }
                else {
                    console.log(result);
                    logOut()
                }
            })
        }
        catch {
            logOut()
        }
    }, [history, logOut])

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
                            fetch(`${baseUrl}api/deleteUser`, {
                                method: "POST",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    'Authorization': "Bearer " + localStorage.getItem("token")
                                }
                            }).then((result) => {
                                if (result.status === 200) {
                                    localStorage.clear()
                                    dispatch(deleteAllTodos([]))
                                    dispatch(addToken(null))
                                    history.push('/')
                                    notify("success", "Your account is deleted permanently!", 5000)
                                }
                                else {
                                    console.log(result);
                                    history.push('/')
                                    notify("error", "Something went wrong!", 5000)
                                }
                            })
                        }
                    },
                    {
                        label: 'No'
                    }
                ]
            });
        })
    }, [dispatch, history]);

    const submitForm = (e) => {
        e.preventDefault()
        try {
            let data = new FormData();
            data.append("name", name)
            data.append("username", username)
            data.append("phone", phone)
            data.append("email", email)
            data.append("gender", gender)
            if (newProfilePic) {
                data.append("profilePic", newProfilePic, newProfilePic.name)
            }
            else {
                let sameProfilePic = profilePic.replace("/media/", "")
                data.append("profilePic", sameProfilePic)
            }

            fetch(`${baseUrl}api/updateUser`, {
                method: "PUT",
                headers: {
                    'Authorization': "Bearer " + localStorage.getItem("token")
                },
                body: data
            }).then((result) => {
                if (result.status === 200) {
                    result.json().then((response) => {
                        setName(response.data['name'])
                        setUsername(response.data['username'])
                        setPhone(response.data['phone'])
                        setEmail(response.data['email'])
                        setGender(response.data['gender'])
                        setProfilePic(response.data['user_pic'])
                        notify("success", "Your account information is updated successfully!", 4000)
                    })
                }
                else {
                    console.log(result);
                    notify("error", "Your account information isn't update!", 4000)
                }
            })
        }
        catch {
            notify("error", "Your account information isn't update!", 4000)
        }
    }
    useEffect(() => {
        if (profilePic.includes("/media/https%3A/")) {
            let newprofilePic = profilePic.replace("/media/https%3A/", "https://")
            setProfilePic(newprofilePic)
        }
    }, [profilePic]);

    useEffect(() => {
        let submitBtn = document.getElementById("submitBtn")
        let deleteBtn = document.getElementById("deleteBtn")
        if (nameValidate && usernameValidate && phoneValidate && emailValidate) {
            submitBtn.disabled = false
            deleteBtn.disabled = false
        }
        else {
            submitBtn.disabled = true
            deleteBtn.disabled = true
        }
    }, [nameValidate, usernameValidate, phoneValidate, emailValidate]);

    return (
        <div className="container my-2">
            <h3>Your Information</h3>
            <img src={profilePic} id="showImg" alt="NoImg" width="10%" />
            <form onSubmit={(e) => submitForm(e)}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="name" className="form-label">Name</label>
                            <input required type="text" className="form-control" id="name" placeholder="Please type your name" onChange={(e) => nameValidation(e)} value={name} />
                            <div id="nameMsg"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="username" className="form-label">Username</label>
                            <input required type="text" className="form-control" id="username" placeholder="Please type a username" onChange={(e) => usernameValidation(e)} value={username} />
                            <div id="usernameMsg"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="phone" className="form-label">Phone</label>
                            <input required type="text" className="form-control" id="phone" placeholder="Please type your phone number" onChange={(e) => phoneValidation(e)} value={phone} />
                            <div id="phoneMsg"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="email" className="form-label">Email address</label>
                            <input required type="email" className="form-control" id="email" placeholder="name@example.com" onChange={(e) => emailValidation(e)} value={email} />
                            <div id="emailMsg"></div>
                        </div>
                    </div>


                    {/* Gender */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="Gender" className="form-label">Gender</label>
                            <select id="Gender" className="form-select" onChange={(e) => setGender(e.target.value)}>
                                {
                                    (gender === "Male") ?
                                        <>
                                            <option selected value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </>
                                        : (gender === "Female") ?
                                            <>
                                                <option value="Male">Male</option>
                                                <option selected value="Female">Female</option>
                                                <option value="Others">Others</option>
                                            </>
                                            : (gender === "Others") ?
                                                <>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option selected value="Others">Others</option>
                                                </>
                                                :
                                                <>
                                                    <option hidden>Please select your gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Others">Others</option>
                                                </>
                                }
                            </select>
                            {/* <div id="genderMsg"></div> */}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;
                        <label htmlFor="formFile" className="form-label">Update profile pic</label>
                        <div className="mb-3 input-group">
                            <input className="form-control" type="file" id="formFile" accept="image/*" onChange={(e) => setNewProfilePic(e.target.files[0])} />
                            {newProfilePic ?
                                <img src={URL.createObjectURL(newProfilePic)} width="8%" className="input-group-text" alt="No Img" />
                                :
                                <img src={profilePic} width="8%" className="input-group-text" alt="No Img" />
                            }
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <input type="submit" value="Update Information" id="submitBtn" className="btn btn-danger btn-sm w-25" />
                </div>
            </form>
            <div>
                <input type="submit" id="deleteBtn" value="Delete Account" className="btn btn-info btn-sm" />
            </div>
        </div>
    )
}

export default UserProfile