import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router'
import { originUserContext } from 'context/UserAuthenticationContext'

import { readFile } from 'localFile'
import { Center, Spinner, useToast } from '@chakra-ui/react'

const Redirect = ({ children }) => {
     const userAuthenticationContext = useContext(originUserContext)
     const { justLogInInASecond, setJustLogInInASecond, setUserID, setUserFullName, setAvatarPath } = userAuthenticationContext
     
     const navigateTo = useNavigate()
     const toast = useToast()

     const [isVerifyingUser, setVerifyingUserState] = useState(false)

     const verifyUserSession = async (userID) => {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/AdminAccount/').concat(userID), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          
          if (!response.ok) {
               navigateTo('/login')
               toast({
                    title: 'The last session had expired. Please sign in again',
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'orange'
               })
          }
          else {
               const content = await response.json()
               setUserID(content._id)
               setUserFullName(content.fullName)
               setAvatarPath(content.avatarPath)
               setVerifyingUserState(false)
               setJustLogInInASecond(true)
               const recentRoute = await readFile('route.txt')
               if (recentRoute.length < 1) navigateTo('/dashboard')
               navigateTo(recentRoute)
          }
     }

     const retriveUserIDFromLocalFile = async () => {
          const retrievedUserID = await readFile('account.txt')
          verifyUserSession(retrievedUserID)
     }

     useEffect(() => {
          if (!justLogInInASecond) {
               setVerifyingUserState(true)
               retriveUserIDFromLocalFile()
          }
     }, [])

     return (
          <div>
               {
                    (isVerifyingUser ? <Center w='100vw' h='100vh'>
                         <Spinner
                         thickness='4px'
                         speed='0.65s'
                         emptyColor='gray.200'
                         color='accent'
                         size='xl'
                       /> 
                    </Center>
                       : <div>{children}</div>)
               }
          </div>
     )
}

export default Redirect