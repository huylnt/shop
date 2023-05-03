import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { Image, Flex, Text, Center, Box, Input, Button, IconButton, useToast, Editable, EditablePreview, EditableInput } from '@chakra-ui/react'
import { IoCreateOutline } from 'react-icons/io5'

const CustomerCreator = () => {

     const toast = useToast()
     const navigateTo = useNavigate()
     const location = useLocation()

     const [name, setName] = useState()
     const [phoneNumber, setPhoneNumber] = useState()
     const [address, setAddress] = useState()

     const handleCustomerCreation = async () => {

          let emptyField
          if (!name) emptyField = 'name'
          else if (!phoneNumber) emptyField = 'phone number'

          if (emptyField) {
               toast({
                    title: `Field ${emptyField} cannot be left empty`,
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'orange'
               })
               return
          }

          toast({
               title: 'Adding customer...',
               variant: 'subtle',
               status: 'info',
               position: 'bottom-right',
               colorScheme: 'pink'
          })

          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer'), {
               method: 'POST',
               headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               },
               body: JSON.stringify({ name, phoneNumber, address })
          })

          if (!response.ok) {
               return false
          }

          navigateTo(-1)
     }

     useEffect(() => {
          localStorage.setItem('route', location.pathname)
     }, [])

     return (
          <Flex flexFlow='column' justify='space-between' height='100%'>
               <Box>
                    <Text textAlign='center' fontSize='24px' color='heading' fontWeight='bold' marginBottom='20px'>Adding new customer</Text>

                    <Flex align='end' gap='5' justify='flex-start'>
                         <Text color='heading' fontSize='20' fontWeight='bold'>Name</Text>
                         <Editable placeholder='Nguyen Van A' width='400px'>
                              <EditablePreview />
                              <EditableInput onBlur={(event) => setName(event.target.value)} paddingX='3' />
                         </Editable>
                    </Flex>

                    <Flex align='end' gap='5' justify='flex-start'>
                         <Text color='heading' fontSize='20' fontWeight='bold'>Phone number</Text>
                         <Editable placeholder='0123456789' width='200px'>
                              <EditablePreview />
                              <EditableInput onBlur={(event) => setPhoneNumber(event.target.value)} paddingX='3' />
                         </Editable>
                    </Flex>

                    <Flex align='end' gap='10'>
                         <Text color='heading' fontSize='18' fontWeight='bold'>Address</Text>
                         <Editable placeholder='0' width='300px'>
                              <EditablePreview />
                              <EditableInput onBlur={(event) => setAddress(event.target.value)} paddingX='3' />
                         </Editable>
                    </Flex>

               </Box>
               <Flex justify='center' gap='10' marginY='20px'>
                    <Button leftIcon={<IoCreateOutline />} variant='solid' colorScheme='pink' onClick={handleCustomerCreation}>Submit</Button>
               </Flex>
          </Flex>
     )
}

export default CustomerCreator