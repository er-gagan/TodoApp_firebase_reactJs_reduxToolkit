import { checkPassword, checkLength, undefinedValueLength, InvallidEmailValue, MainFieldValidationCheck, matchPasswordValid, matchPasswordInvalid, passwordEyeValidation, confirmPasswordEyeValidation } from './SignupFormValidation';
import firebase from '../../Credentials/Firebase/firebaseCredential';
import { Link, useHistory } from "react-router-dom";
import SyncLoader from 'react-spinners/SyncLoader';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { css } from "@emotion/react";
// import { getAuthorizedData } from '../../Credentials/Firebase/SocialAuthentication/getAuthData';
const override = css`
    display: block;
    margin: 200px 47%;
    position: fixed;
    z-index:1;
`;

const Signup = () => {
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    // state for submit button validation start
    const [emailValidate, setEmailValidate] = useState(false)
    const [passwordValidate, setPasswordValidate] = useState(false)
    const [confirmPasswordValidate, setConfirmPasswordValidate] = useState(false)
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

    useEffect(() => {
        let matchPassword = document.getElementById("matchPassword")
        let pass1 = document.getElementById("pass1")
        let pass2 = document.getElementById("pass2")
        if (emailValidate && passwordValidate && confirmPasswordValidate) {
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
    }, [emailValidate, passwordValidate, confirmPasswordValidate, confirmPassword, password]);

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

    useEffect(() => {
        passwordEyeValidation()
        confirmPasswordEyeValidation()
    }, []);

    const submitForm = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password)
            history.push('/login')
            notify("success", "You have successfully Signed up! Please Login..", 5000)
        } catch (error) {
            notify("error", `Something went wrong, ${error.message}`, 5000)
        }
        setLoading(false)
    }

    return (
        <>
            <SyncLoader color={"#292929"} loading={loading} css={override} size={20} />
            <div className="container my-2">
                <h3>Signup Form</h3>
                <form onSubmit={submitForm}>
                    <div className="row">

                        <div className="mb-3">
                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="email" className="form-label">Email address</label>
                            <input required type="email" className="form-control" id="email" placeholder="name@example.com" onChange={(e) => emailValidation(e)} value={email} />
                            <div id="emailMsg"></div>
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