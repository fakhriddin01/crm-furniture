import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'

export const employeeStore  = defineStore('employee', ()=>{
    
    const state = reactive({
        list: [],
        load: true,
        errorMessage: "",
        search: ''
    })


    return {state}
})