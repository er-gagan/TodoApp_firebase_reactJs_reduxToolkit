import React from 'react'
import { useSelector } from 'react-redux'
import Card from './Card'
import Form from './Form'
import { Redirect } from "react-router-dom";

const Home = () => {
    const token = useSelector(state => state.token.data)

    return (
        <>
            {token ?
                <div className="container my-2">
                    <h3 className="text-center">Todo App</h3>
                    <Form />
                    <div className="row my-3">
                        <Card />
                    </div>
                </div>
                :
                <Redirect to="/login" />
            }
            
        </>
    )
}

export default Home
