import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'

export const productTypeStore  = defineStore('product-type', ()=>{
    
    const state = reactive({
        list: [],
        load: true,
        errorMessage: "",
        
    })
    

    return {state}
})