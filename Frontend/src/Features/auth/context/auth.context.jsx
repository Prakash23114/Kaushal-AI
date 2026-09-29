import {createContext, useState} from 'react'

// The context and provider intentionally live together in this module.
// eslint-disable-next-line react-refresh/only-export-components
 export const AuthContext = createContext();

 export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    )
 }


//  AuthContext
//      ↑
//      │ receives data
//      │
// AuthProvider
//      │
//      ├── user
//      ├── setUser
//      ├── loading
//      └── setLoading