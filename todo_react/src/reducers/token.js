import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: '',
}

const token = createSlice({
    name:"token",
    initialState,
    reducers:{
        addToken(state, action){
            state.data = action.payload
        }
    }
})

export const {addToken} = token.actions

export default token.reducer