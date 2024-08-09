import axios from 'axios';
import {createContext,useContext, useEffect, useState} from 'react'

const AuthContext = createContext();

const AuthProvider = ({children})=>{
    const [authToken,setAuth] = useState(null);
    const [userData,setUserData] = useState(null);

    const setAuthToken = (val)=>{
        setAuth(val);
    }

    const setUser = (val)=>{
        setUserData(val);
    }

    
    useEffect(()=>{
        if(localStorage.getItem('ECE-authToken')!==undefined){
            const token = JSON.parse(localStorage.getItem('ECE-authToken'));
            const user = JSON.parse(localStorage.getItem('ECE-User'));
            setUser(user);
            setAuthToken(token);
        }
        
    },[]);
    
    useEffect(()=>{
        if(authToken)localStorage.setItem('ECE-authToken',JSON.stringify(authToken));
        if(userData)localStorage.setItem('ECE-User',JSON.stringify(userData));
    },[authToken,userData]);

    return (
        <AuthContext.Provider value={{authToken,setAuthToken,userData,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = ()=>useContext(AuthContext);

export {useAuth,AuthProvider}