import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router"
import { originUserContext } from "context/UserAuthenticationContext"

import {
     Flex,
     Center,
     Heading,
     FormControl,
     FormLabel,
     Input,
     Button,
     CircularProgress,
     Text
} from '@chakra-ui/react'

import { useToast } from "@chakra-ui/react"

export default function Login() {
     const userAuthenticationContext = useContext(originUserContext)
     const { handleUserLogin, justLogInInASecond } = userAuthenticationContext

     const navigateTo = useNavigate()

     const [username, setUsername] = useState('lnthuy')
     const [password, setPassword] = useState('29012002')
     const [isProcessing, setIsProcessing] = useState(false)
     const toast = useToast()

     const handleSubmit = async event => {
          event.preventDefault()
          setIsProcessing(true)
          const response = await handleUserLogin(username, password)
          if (!response) {
               toast({
                    title: 'Authentication failed',
                    variant: 'subtle',
                    status: 'error',
                    position: 'bottom-right',
                    colorScheme: 'red',
                    duration: 3000,
               })
          }
          else navigateTo('/dashboard')
          
          setIsProcessing(false)
     }

     const navigateToRecentRoute = async () => {
          const recentRoute = localStorage.getItem('route')
          if (recentRoute.length < 1) navigateTo('/dashboard')
          navigateTo(recentRoute)
     }

     useEffect(() => {
       if (justLogInInASecond) {
          navigateToRecentRoute()
       }
     }, [])
     

     return (
          <Center w='100vw' h='100vh' style={{backgroundImage: 'url("./background.png")'}}>
               <form onSubmit={handleSubmit} style = {{background: 'var(--primary)', padding: '50px 30px', borderRadius: '20px', height:'80%', position: 'relative'}}>
                    <Heading marginBottom='50px' color='heading'> Log in with an existing account </Heading>
                    <FormControl isRequired marginY='20px'>
                         <FormLabel>Username</FormLabel>
                         <Input
                              type="username"
                              defaultValue="lnthuy"
                              size="lg"
                              onChange={event => setUsername(event.currentTarget.value)}
                              focusBorderColor='secondary'
                              bg='white'
                         />
                    </FormControl>
                    <FormControl isRequired marginY='20px'>
                         <FormLabel>Password</FormLabel>
                         <Input
                              type="password"
                              defaultValue="29012002"
                              size="lg"
                              onChange={event => setPassword(event.currentTarget.value)}
                              focusBorderColor='secondary'
                              bg='white'
                         />
                    </FormControl>
                    
                    <Button
                         bg='accent'
                         color='white'
                         variant="solid"
                         type="submit"
                         width='90%'
                         padding='20px'
                         position='absolute'
                         bottom='10'
                         _hover={{filter: 'brightness(120%)'}}>
                         <Flex justifyContent='center' alignItems='center' gap='15px'>
                              {isProcessing && <CircularProgress size='20px' isIndeterminate color="white" />}
                              <Text>Sign in</Text>
                         </Flex>
                    </Button>
               </form>
          </Center>
     )
}