import axios from "../axios";

export const useContact = {
    create: (state) => axios.post("/contact", state, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    list : (num=1) => axios.get(`/contact?page=${num}`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    update: (id) => axios.patch(`/contact/${id}`, {status: false}, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    listByNumber : (number, num=1) => axios.get(`/contact/number/${number}?page=${num}`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
}
