import { checkLength, undefinedValueLength, MainFieldValidationCheck, matchPasswordValid, matchPasswordInvalid, newPasswordEyeValidation, confirmPasswordEyeValidation } from './Validation'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteAllTodos } from '../../reducers/todos'
import { addToken } from '../../reducers/token'
import { baseUrl } from '../../Environment'

const ForgotPassword = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [emailOtp, setEmailOtp] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    // state for validation
    const [emailValidate, setEmailValidate] = useState(false)
    const [otpValidate, setOtpValidate] = useState(false)
    const [passwordValidate, setPasswordValidate] = useState(false)
    const [confirmPasswordValidate, setConfirmPasswordValidate] = useState(false)

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

    useEffect(() => {
        document.getElementById('emailOtp').disabled = true
        document.getElementById('pass1').disabled = true
        document.getElementById('pass2').disabled = true
    }, [])

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

    const otpValidation = (e) => {
        let Value = e.target.value
        setEmailOtp(Value)
        let regex = /^[0-9A-Z]{6}(\s*,*,\s*[0-9A-Z]{6})*$/
        let otpMsg = document.getElementById("otpMsg")
        if (Value) {
            if (Value.match(regex) !== null) {
                Value = Value.match(regex).join("")
                setEmailOtp(Value)
                if (checkLength(Value, 6, 6, e, otpMsg)) {
                    setOtpValidate(true)
                }
                else {
                    setOtpValidate(false)
                }
            }
            else {
                setEmailOtp(Value)
                let msg = "** Invallid Otp | Otp must be letters and numbers"
                MainFieldValidationCheck(e, otpMsg, msg)
                setOtpValidate(false)
            }
        }
        else {
            undefinedValueLength(e, otpMsg)
        }
    }
    useEffect(() => {
        if (otpValidate) {
            document.getElementById('otpBtn').disabled = false
        }
        else {
            document.getElementById('otpBtn').disabled = true
        }
    }, [otpValidate]);

    // min 6 and max 15 character | atleast one is number | atleast one is special character
    const passwordValidation = (e) => {
        let Value = e.target.value
        setPassword(Value)
        let passwordMsg = document.getElementById("passwordMsg")
        let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/
        if (Value) {
            if (Value.match(regex) !== null) {
                setPassword(Value)
                if (checkLength(Value, 6, 15, e, passwordMsg)) {
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
                if (checkLength(Value, 6, 15, e, confirmPasswordMsg)) {
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
        let passwordBtn = document.getElementById("passwordBtn")
        let matchPassword = document.getElementById("matchPassword")
        let pass1 = document.getElementById("pass1")
        let pass2 = document.getElementById("pass2")
        if (passwordValidate && confirmPasswordValidate) {
            if (password === confirmPassword) {
                passwordBtn.disabled = false
                matchPasswordValid(matchPassword, pass1, pass2)
            }
            else {
                passwordBtn.disabled = true
                matchPasswordInvalid(matchPassword, pass1, pass2)
            }
        }
        else {
            passwordBtn.disabled = true
            // matchPasswordInvalid(matchPassword, pass1, pass2)
        }
    }, [passwordValidate, confirmPasswordValidate, password, confirmPassword])

    const emailSubmit = (e) => {
        e.preventDefault()
        try {
            fetch(`${baseUrl}api/forgot_password_email_verification`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 'email': email })
            }).then((result) => {
                if (result.status === 202) {
                    notify("success", `Otp has successfully sent on email ${email}`, 5000)
                    document.getElementById('email').disabled = true
                    document.getElementById('emailOtp').disabled = false
                }
                else {
                    notify("error", `Something went wrong! Maybe ${email} email is not exist in database or network issue occurd!`, 5000)
                }
            })
        }
        catch {
            logOut()
        }
    }

    const otpSubmit = (e) => {
        e.preventDefault()
        try {
            fetch(`${baseUrl}api/forgot_password_otp_verification`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 'otp': emailOtp, 'email': email })
            }).then((result) => {
                if (result.status === 202) {
                    notify("success", `Email has successfully verified with otp! Please set new password carefully!`, 6000)
                    document.getElementById('email').disabled = true
                    document.getElementById('emailOtp').disabled = true
                    document.getElementById('pass1').disabled = false
                    document.getElementById('pass2').disabled = false
                }
                else {
                    notify("error", `Something went wrong! Maybe otp is invallid or network issue occurd!`, 6000)
                }
            })
        }
        catch {
            logOut()
        }
    }

    const passwordSubmit = (e) => {
        e.preventDefault()
        try {
            fetch(`${baseUrl}api/forgot_password_with_new_password`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 'otp': emailOtp, 'email': email, 'password': password })
            }).then((result) => {
                if (result.status === 200) {
                    history.push('/login')
                    notify("success", `New password has successfully set with email ${email}! Please login`, 6000)
                }
                else {
                    notify("error", `Something went wrong! Network issue occurd!`, 6000)
                }
            })
        }
        catch {
            logOut()
        }
    }

    useEffect(() => {
        newPasswordEyeValidation()
        confirmPasswordEyeValidation()
    }, [])

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

            <form onSubmit={otpSubmit}>
                <div className="mb-3">
                    <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="emailOtp" className="form-label">Enter Otp</label>
                    <input required type="text" className="form-control" id="emailOtp" placeholder="Otp sent your given email" onChange={(e) => otpValidation(e)} value={emailOtp} />
                    <div id="otpMsg"></div>
                </div>

                <div className="text-center">
                    <input type="submit" id="otpBtn" value="Submit Otp" className="btn btn-danger btn-sm w-25" />
                </div>
            </form>

            <form onSubmit={passwordSubmit}>

                <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="pass1" className="form-label">Enter new password</label>
                <div className="mb-3 input-group">
                    <input required type="password" style={{ borderRight: "0px", borderRadius: "5px" }} className="form-control" id="pass1" placeholder="Enter new password" onChange={(e) => passwordValidation(e)} value={password} aria-label="New Password" aria-describedby="newPasswordEye" />
                    <span className="input-group-text" id="newPasswordEye" style={{ backgroundColor: "#ffffff", borderRadius: "5px", borderLeft: "0px" }}>
                        <i className="bi bi-eye" id="newPasswordEyeIcon"></i>
                    </span>
                    <div id="passwordMsg"></div>
                </div>

                <div className="text-center" id="matchPassword" style={{ display: 'block' }}></div>

                <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="pass2" className="form-label">Confirm new password</label>
                <div className="mb-3 input-group">
                    <input required type="password" style={{ borderRight: "0px", borderRadius: "5px" }} className="form-control" id="pass2" placeholder="Re-type password" onChange={(e) => confirmPasswordValidation(e)} value={confirmPassword} aria-label="Confirm New Password" aria-describedby="confirmPasswordEye" />
                    <span className="input-group-text" id="confirmPasswordEye" style={{ backgroundColor: "#ffffff", borderRadius: "5px", borderLeft: "0px" }}>
                        <i className="bi bi-eye" id="confirmPasswordEyeIcon"></i>
                    </span>
                    <div id="confirmPasswordMsg"></div>
                </div>

                <div className="text-center">
                    <input type="submit" id="passwordBtn" value="Submit Password" className="btn btn-danger btn-sm w-25" />
                </div>
            </form>
        </div>

    )
}

export default ForgotPassword
