import { checkLength, MainFieldValidationCheck, undefinedValueLength, passwordEyeValidation } from './validation';
import { googleProvider, facebookProvider, githubProvider, twitterProvider } from '../../Credentials/Firebase/SocialAuthentication/socialLogin';
import socialMediaAuth from '../../Credentials/Firebase/SocialAuthentication/auth';
import firebase from '../../Credentials/Firebase/firebaseCredential';
import React, { useState, useEffect, useCallback } from 'react';
import { deleteAllTodos } from '../../reducers/todos';
import { Link, useHistory } from "react-router-dom";
import { addToken } from '../../reducers/token';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const Login = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const [userEmailPhone, setUserEmailPhone] = useState('')
    const [password, setPassword] = useState('')
    const [passwordValidate, setPasswordValidate] = useState(false)

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
        notify("error", "Something went wrong, Please check your internet and credentials and verify email!", 5000)
    }, [dispatch, history])

    const logIn = useCallback((token) => {
        localStorage.setItem("token", token)
        dispatch(addToken(token))
        history.push("/")
        notify("success", "You have successfully logged in", 5000)
    }, [dispatch, history])

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

    useEffect(() => {
        if (passwordValidate) {
            document.getElementById("loginBtn").disabled = false
        }
        else {
            document.getElementById("loginBtn").disabled = true
        }
    }, [passwordValidate]);

    const submitForm = async (e) => {
        e.preventDefault()
        try {
            await firebase.auth().signInWithEmailAndPassword(userEmailPhone, password).then((user) => {
                if (user.user.emailVerified) {
                    user.user.getIdToken().then(idToken => {  // generate jwt
                        logIn(idToken)
                    }).catch(error => {
                        logOut()
                    })
                } else {
                    logOut()
                }
            }).catch(error => {
                logOut()
            })
        }
        catch (error) {
            logOut()
        }
    }

    // Sign in with social media logic
    useEffect(() => {
        passwordEyeValidation()
        document.getElementById("googleDiv").addEventListener("click", async () => {
            const response = await socialMediaAuth(googleProvider)
            if (response.a !== null) {
                firebase.auth().currentUser.getIdToken().then(idToken => {  // generate jwt
                    logIn(idToken)
                }).catch(error => {
                    logOut()
                })
            } else {
                logOut()
            }
        })

        document.getElementById("facebookDiv").addEventListener("click", async () => {
            const response = await socialMediaAuth(facebookProvider)
            if (response.a !== null) {
                firebase.auth().currentUser.getIdToken().then(idToken => {  // generate jwt
                    logIn(idToken)
                }).catch(error => {
                    logOut()
                })
            } else {
                logOut()
            }
        })

        document.getElementById("githubDiv").addEventListener("click", async () => {
            const response = await socialMediaAuth(githubProvider)
            if (response.a !== null) {
                firebase.auth().currentUser.getIdToken().then(idToken => {  // generate jwt
                    logIn(idToken)
                }).catch(error => {
                    logOut()
                })
            } else {
                logOut()
            }
        })

        document.getElementById("twitterDiv").addEventListener("click", async () => {
            const response = await socialMediaAuth(twitterProvider)
            if (response.a !== null) {
                firebase.auth().currentUser.getIdToken().then(idToken => {  // generate jwt
                    logIn(idToken)
                }).catch(error => {
                    logOut()
                })
            } else {
                logOut()
            }
        })
    }, [dispatch, history, logOut, logIn])

    return (
        <>
        <h1>Hello Gagan</h1>
            <div className="container my-2">
                <div className="row">
                    <div className="col-md-6 text-center">
                        <h3 className="my-2 mb-3">Sign In with Social Media</h3>

                        <div className="py-2 px-5 m-auto" id="googleDiv" style={{ width: "fit-content", border: "2px solid", backgroundColor: "#dc3c2a", color: "white", fontSize: "20px", borderRadius: "10px", cursor: "pointer" }}>
                            <i className="bi bi-google" style={{ marginRight: "10px" }}></i>
                            Signin with Google
                        </div>

                        <div className="py-2 px-5 m-auto" id="facebookDiv" style={{ width: "fit-content", border: "2px solid", backgroundColor: "#4867aa", color: "white", fontSize: "20px", borderRadius: "10px", cursor: "pointer" }}>
                            <i className="bi bi-facebook" style={{ marginRight: "10px" }}></i>
                            Signin with Facebook
                        </div>

                        <div className="py-2 px-5 m-auto" id="githubDiv" style={{ width: "fit-content", border: "2px solid", backgroundColor: "#383838", color: "white", fontSize: "20px", borderRadius: "10px", cursor: "pointer" }}>
                            <i className="bi bi-github" style={{ marginRight: "10px" }}></i>
                            Signin with github
                        </div>

                        <div className="py-2 px-5 m-auto" id="twitterDiv" style={{ width: "fit-content", border: "2px solid", backgroundColor: "#1da1f2", color: "white", fontSize: "20px", borderRadius: "10px", cursor: "pointer" }}>
                            <i className="bi bi-twitter" style={{ marginRight: "10px" }}></i>
                            Signin with Twitter
                        </div>

                    </div>
                    <div className="col-md-6">
                        <h3 className="text-center my-2 mb-3">Login with Email and Password</h3>
                        <form onSubmit={submitForm} id="myForm1">

                            <div className="mb-3">
                                <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="name" className="form-label">Enter Username or Email</label>
                                <input required autoFocus type="text" className="form-control" id="name" placeholder="Please type your username or email" onChange={(e) => setUserEmailPhone(e.target.value)} value={userEmailPhone} />
                            </div>

                            <span style={{ color: "red", fontWeight: "bolder" }}>*</span>&nbsp;<label htmlFor="password" className="form-label">Password</label>
                            <div className="mb-3 input-group">
                                <input required type="password" style={{ borderRight: "0px", borderRadius: "5px" }} className="form-control" id="password" placeholder="Please type password" onChange={(e) => passwordValidation(e)} value={password} aria-label="Password" aria-describedby="eye" />
                                <span className="input-group-text" id="eye" style={{ backgroundColor: "#ffffff", borderRadius: "5px", borderLeft: "0px" }}><i className="bi bi-eye" id="eyeIcon"></i></span>
                                <div id="passwordMsg"></div>
                            </div>

                            <div className="text-center">
                                <input type="submit" value="Login" id="loginBtn" className="btn btn-danger btn-sm w-25" />
                            </div>
                        </form>
                        <div className="text-center">
                            <Link to="/signup">You don't have an account? Sign up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login