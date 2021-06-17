import { checkPassword, checkFieldCharacters, checkLength, undefinedValueLength, InvallidEmailValue, correctCharacters, MainFieldValidationCheck, matchPasswordValid, matchPasswordInvalid, passwordEyeValidation, confirmPasswordEyeValidation } from './SignupFormValidation';
import { deleteAllTodos } from '../../reducers/todos';
import { Link, useHistory } from "react-router-dom";
import SyncLoader from 'react-spinners/SyncLoader';
import React, { useState, useEffect } from 'react'
import { addToken } from '../../reducers/token';
import { baseUrl } from '../../Environment';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { css } from "@emotion/react";

const override = css`
    display: block;
    margin: 200px 47%;
    position: fixed;
    z-index:1;
`;

const Signup = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [gender, setGender] = useState('')
    const [profilePic, setProfilePic] = useState('')
    // state for submit button validation start
    const [nameValidate, setNameValidate] = useState(false)
    const [usernameValidate, setUsernameValidate] = useState(false)
    const [phoneValidate, setPhoneValidate] = useState(false)
    const [emailValidate, setEmailValidate] = useState(false)
    const [passwordValidate, setPasswordValidate] = useState(false)
    const [confirmPasswordValidate, setConfirmPasswordValidate] = useState(false)
    const [genderValidate, setGenderValidate] = useState(false)
    // react loading state
    let [loading, setLoading] = useState(false);

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
        notify("warning", "Something went wrong, Please check your internet and information!", 4000)
    }

    useEffect(() => {
        let matchPassword = document.getElementById("matchPassword")
        let pass1 = document.getElementById("pass1")
        let pass2 = document.getElementById("pass2")
        if (nameValidate && usernameValidate && phoneValidate && emailValidate && passwordValidate && confirmPasswordValidate && genderValidate) {
            if (checkPassword(password, confirmPassword)) {
                document.getElementById('submitBtn').disabled = false
                matchPasswordValid(matchPassword, pass1, pass2)
            }
            else {
                document.getElementById('submitBtn').disabled = true
                matchPasswordInvalid(matchPassword, pass1, pass2)
            }
        }
        else {
            document.getElementById('submitBtn').disabled = true
        }
    }, [nameValidate, usernameValidate, phoneValidate, emailValidate, passwordValidate, confirmPasswordValidate, genderValidate, confirmPassword, password]);

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

    // min 6 and max 15 character | atleast one is number | atleast one is special character
    const passwordValidation = (e) => {
        let Value = e.target.value
        setPassword(Value)
        let passwordMsg = document.getElementById("passwordMsg")
        let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/
        if (Value) {
            if (Value.match(regex) !== null) {
                setPassword(Value)
                if (checkLength(Value, 6, 15, e, passwordMsg)) {   // Value, MinValue, MaxValue, event, passwordMsg
                    setPasswordValidate(true)
                }
                else {
                    setPasswordValidate(false)
                }
            }
            else {
                setPassword(Value)
                let msg = "** Password Incorrect"
                MainFieldValidationCheck(e, passwordMsg, msg)
                setPasswordValidate(false)
            }
        }
        else {
            undefinedValueLength(e, passwordMsg)
        }
    }

    const confirmPasswordValidation = (e) => {
        let Value = e.target.value
        setConfirmPassword(Value)
        let confirmPasswordMsg = document.getElementById("confirmPasswordMsg")
        let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/
        if (Value) {
            if (Value.match(regex) !== null) {
                setConfirmPassword(Value)
                if (checkLength(Value, 6, 15, e, confirmPasswordMsg)) {   // Value, MinValue, MaxValue, event, confirmPasswordMsg
                    setConfirmPasswordValidate(true)
                }
                else {
                    setConfirmPasswordValidate(false)
                }
            }
            else {
                setConfirmPassword(Value)
                let msg = "** Password Incorrect"
                MainFieldValidationCheck(e, confirmPasswordMsg, msg)
                setConfirmPasswordValidate(false)
            }
        }
        else {
            undefinedValueLength(e, confirmPasswordMsg)
        }
    }

    const genderValidation = (e) => {
        setGender(e.target.value)
        let genderMsg = document.getElementById("genderMsg")
        correctCharacters(e, genderMsg)
        setGenderValidate(true)
    }

    useEffect(() => {
        passwordEyeValidation()
        confirmPasswordEyeValidation()
    }, []);

    const submitForm = (e) => {
        e.preventDefault()
        setLoading(true)
        let data = new FormData();
        data.append("name", name)
        data.append("username", username)
        data.append("password", password)
        data.append("email", email)
        data.append("phone", phone)
        data.append("gender", gender)
        data.append("profilePic", profilePic, profilePic.name)


        try {
            fetch(`${baseUrl}api/register`, {
                method: "POST",
                body: data
            }).then((result) => {
                if (result.status === 201) {

                    history.push('/login')

                    notify("success", "You have successfully Signed up, Please check your email, we sent a mail to verify your email and after successfully verified then login.", 7000)
                }
                else {

                    notify("error", "Something went wrong, Please check your internet!", 5000)

                }
                setLoading(false)
            })
        }
        catch {
            logOut()
            setLoading(false)
        }
    }

    return (
        <>
        <SyncLoader color={"#292929"} loading={loading} css={override} size={20} />
            <div className="container my-2">
                <h3>Signup Form</h3>
                <form onSubmit={submitForm}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="name" className="form-label">Name</label>
                                <input required autoFocus type="text" className="form-control" id="name" placeholder="Please type your name" onChange={(e) => nameValidation(e)} value={name} />
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

                        <div className="col-md-6">
                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="pass1" className="form-label">Password</label>
                            <div className="mb-3 input-group">
                                <input required type="password" style={{ borderRight: "0px", borderRadius: "5px" }} className="form-control" id="pass1" placeholder="Enter a unique password" onChange={(e) => passwordValidation(e)} value={password} aria-label="Password" aria-describedby="passwordEye" />
                                <span className="input-group-text" id="passwordEye" style={{ backgroundColor: "#ffffff", borderRadius: "5px", borderLeft: "0px" }}>
                                    <i className="bi bi-eye" id="passwordEyeIcon"></i>
                                </span>
                                <div id="passwordMsg"></div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="pass2" className="form-label">Confirm Password</label>
                            <div className="mb-3 input-group">
                                <input required type="password" style={{ borderRight: "0px", borderRadius: "5px" }} className="form-control" id="pass2" placeholder="Re-type password" onChange={(e) => confirmPasswordValidation(e)} value={confirmPassword} aria-label="Confirm Password" aria-describedby="confirmPasswordEye" />
                                <span className="input-group-text" id="confirmPasswordEye" style={{ backgroundColor: "#ffffff", borderRadius: "5px", borderLeft: "0px" }}>
                                    <i className="bi bi-eye" id="confirmPasswordEyeIcon"></i>
                                </span>
                                <div id="confirmPasswordMsg"></div>
                            </div>
                        </div>
                        <div className="text-center" id="matchPassword" style={{ display: 'block' }}></div>

                        {/* Gender */}
                        <div className="col-md-6">
                            <div className="mb-3">
                                <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="Gender" className="form-label">Gender</label>
                                <select id="Gender" className="form-select" onChange={(e) => genderValidation(e)}>
                                    <option hidden>Please select your gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                                <div id="genderMsg"></div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="formFile" className="form-label">Upload profile pic</label>
                            <div className="mb-3 input-group">
                                <input className="form-control" type="file" id="formFile" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />
                                {profilePic ?
                                    <img src={URL.createObjectURL(profilePic)} width="8%" className="input-group-text" alt="No Img" />
                                    : <></>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <input type="submit" value="Signup" id="submitBtn" className="btn btn-danger btn-sm w-25" />
                    </div>
                </form>
                <div className="text-center">
                    <Link to="/login">Already have an account? Sign in</Link>
                </div>
            </div>
        </>
    )
}

export default Signup