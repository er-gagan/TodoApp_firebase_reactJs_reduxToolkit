import { Redirect } from "react-router-dom";
import { addToken } from './reducers/token';
import { useDispatch } from 'react-redux';
import React from 'react'

const RESTRICT_AFTER_LOGGED_IN_COMPONENT = (props) => {
    let Component = props.component
    let token = localStorage.getItem('token')
    const dispatch = useDispatch()
    dispatch(addToken(token))
    return (
        <>
            {(token===null)?<Component/>:<Redirect to="/" />}
        </>
    )
}

export default RESTRICT_AFTER_LOGGED_IN_COMPONENT
