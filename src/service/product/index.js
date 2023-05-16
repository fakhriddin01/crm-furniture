import axios from "../axios";

export const useProduct = {
    create: (state) => axios.post("/product", state, {
        headers:{
            'Content-Type': 'multipart/form-data',
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
    }),
    listByName: (name)=> axios.get(`/product/name/${name}`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    listByRole: (id)=> axios.get(`/product/type/${id}`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),

    delete: (id)=> axios.delete(`/product/${id}`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
}
