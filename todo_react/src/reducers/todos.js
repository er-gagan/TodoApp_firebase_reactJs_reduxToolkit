import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
}

const todos = createSlice({
    name: "todos",
    initialState,
    reducers: {
        addTodo(state, action) {
            state.data = [...state.data, action.payload]
        },
        deleteTodo(state, action) {
            state.data = [...state.data.filter((todo) => todo.id !== action.payload)]
        },
        updateTodo(state, action) {
            state.data = [...state.data.filter((todo) => todo.id !== action.payload.id),
            { id: action.payload.id, Title: action.payload.Title, Description: action.payload.Description, Date: action.payload.Date },
            ]
        },
        deleteAllTodos(state, action){
            state.data = action.payload
        }
    }
})

export const { addTodo, deleteTodo, updateTodo, deleteAllTodos } = todos.actions

export default todos.reducer