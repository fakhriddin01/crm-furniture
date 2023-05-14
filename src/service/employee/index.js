import axios from "../axios";

export const useEmployee = {
    create: (state) => axios.post("/staff/create", state),
    list : (num=1) => axios.get(`/staff?page=${num}`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    listByName: (username, num=1)=> axios.get(`/staff/fullname/${username}?page=${num}`,{
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    activate: (id)=> axios.post('/staff/activate', {staff_id:id}, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    deactivate: (id)=> axios.post('/staff/deactivate', {staff_id:id}, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
}
