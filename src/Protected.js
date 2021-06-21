import React from 'react'
import { useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import { addToken } from './reducers/token';


const Protected = (props) => {
    let Component = props.component
    let token = localStorage.getItem('token')
    const dispatch = useDispatch()
    dispatch(addToken(token))
    return (
        <>
            {(token !== null) ? <Component /> : <Redirect to="login"></Redirect>}
        </>
    )
}

export default Protected