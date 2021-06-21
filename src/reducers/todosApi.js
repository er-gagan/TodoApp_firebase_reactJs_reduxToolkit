// import { createAsyncThunk } from "@reduxjs/toolkit";

// // action creator
// export const getTodos = createAsyncThunk(
//     'getTodos',
//     () => {
//         fetch('http://127.0.0.1:8000/api/todos', {
//             method: "GET",
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/json",
//                 'Authorization': "Bearer " + localStorage.getItem("token")
//             },
//         }).then((result) => {
//             if (result.status === 200) {
//                 result.json().then((response) => {
//                     response.map(todo => {
//                         dispatch(addTodo(todo))
//                         return true
//                     })
//                 })
//             }
//             else {
//                 console.log("Something went wrong");
//             }
//         })
//     }
// )