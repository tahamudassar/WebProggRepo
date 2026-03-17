import {create} from 'zustand'

export const useUserData = create((set)=>({
    user: {
        name: "saad ali"
    },
    change: ()=>{
        set((state)=>({name:state.user.name}))
    }
}))
