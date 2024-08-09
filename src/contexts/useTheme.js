import {useState,createContext,useContext} from 'react'

const ThemeContext = createContext();

const ThemeProvider = ({children})=>{
    
    const [currentTheme,setThemes] = useState('light');

    const setTheme = (val)=>{
        setThemes(val);
    }

    return (
        <ThemeContext.Provider value={{currentTheme,setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

const useTheme = ()=>useContext(ThemeContext);

export {ThemeProvider,useTheme};