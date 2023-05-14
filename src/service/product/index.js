import axios from "../axios";

export const useProduct = {
    create: (state) => axios.post("/product", state, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    list : (num=1) => axios.get(`/product?page=${num}`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    getCategoryId: (name)=> axios.get(`/category/name/${name}`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
}
