import React, { useState, createContext } from 'react'
import MD5 from "crypto-js/md5"
import { writeData } from 'localFile'

const originUserContext = createContext()

const UserAuthenticationContext = ({ children }) => {
     const [justLogInInASecond, setJustLogInInASecond] = useState(false)
     const [userID, setUserID] = useState('')
     const [userFullName, setUserFullName] = useState('')
     const [avatarPath, setAvatarPath] = useState('')

     const handleUserLogin = async (username, password) => {
          const hash = MD5(password).toString()

          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/AdminAccount/Authentication'), {
               method: 'POST',
               headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               },
               body: JSON.stringify({ 
                    username: username, 
                    password: hash 
               })
          })
          
          if (!response.ok) {
               return false
          }

          const content = await response.json()
          
          writeData('account.txt', content._id)
          setUserID(content._id)
          setUserFullName(content.fullName)
          setAvatarPath(content.avatarPath)
          setJustLogInInASecond(true)
          return true
     }

     return (
          <originUserContext.Provider value={{ justLogInInASecond, setJustLogInInASecond, userID, setUserID, handleUserLogin, userFullName, setUserFullName, avatarPath, setAvatarPath }}>
               {children}
          </originUserContext.Provider>
     )
}

export { originUserContext, UserAuthenticationContext }