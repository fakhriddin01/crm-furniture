import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'

export const productStore  = defineStore('product', ()=>{
    
    const state = reactive({
        list: [],
        load: true,
        errorMessage: "",
        
    })

   

    return {state}
})