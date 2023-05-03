import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, Flex, Text, Select, IconButton, Editable, EditablePreview, EditableInput, Image, Input } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

const CustomerEditorDialog = ({ customer, setOpen }) => {
     const toast = useToast()
     const navigateTo = useNavigate()

     const [pendingUpdatedProperty, setPendingUpdatedProperty] = useState([
          { key: '', value: '' }
     ])

     const addField = () => {
          if (pendingUpdatedProperty.length >= 3) {
               toast({
                    title: 'There are no more fields can be updated',
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'orange'
               })
               return
          }

          setPendingUpdatedProperty(previous => [...previous, { key: '', value: '' }])
     }

     const manifestProperty = (event) => {
          const fieldIndex = event.target.parentElement.parentElement.getAttribute('data-index')
          const propertyKey = event.target.options[event.target.selectedIndex].value

          const isPropertyDuplicated = pendingUpdatedProperty.find(property => property.key === propertyKey)
          if (isPropertyDuplicated) {
               toast({
                    title: 'Your selected field is duplicated.',
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'orange'
               })

               event.target.selectedIndex = 0
               return
          }

          const newPendingUpdatedProperty = pendingUpdatedProperty.map((element, index) => {
               if (index === Number(fieldIndex)) {
                    return { ...element, key: propertyKey, value: customer[propertyKey] }
               }
               else return element
          })
          setPendingUpdatedProperty(newPendingUpdatedProperty)
     }

     const handleCustomerUpdate = async () => {
          
          const hasEmptyField = pendingUpdatedProperty.find(property => property.value.length < 1)
          if (hasEmptyField) {
               toast({
                    title: 'Please do not leave any field empty',
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'orange'
               })
               return
          }

          const obj = {}

          for (const element of pendingUpdatedProperty) {
              obj[element.key] = element.value
          }

          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer/').concat(customer['_id']), {
               method: 'PUT',
               headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               },
               body: JSON.stringify(obj)
          })

          if (!response.ok) {
               toast({
                    title: response.error.message,
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'red'
               })
               return false
          }

          const content = await response.json()

          toast({
               title: 'Customer has been updated successfully',
               variant: 'subtle',
               status: 'success',
               position: 'bottom-right',
               colorScheme: 'purple'
          })

          navigateTo(`/customers`)
     }

     return (
          <>
               <Modal onClose={() => setOpen(false)} isOpen={true} isCentered borderRadius='12px' size='xl'>
                    <ModalOverlay />
                    <ModalContent>
                         <ModalHeader bg='secondary' color='white' borderRadius='6px'>Edit customer detail</ModalHeader>

                         <ModalBody>
                              {pendingUpdatedProperty.map((property, index) => <Flex data-index={index} gap='20px' marginY='20px' key={index} align='center'>
                                   <Select maxWidth='40%' borderWidth='2px' borderColor='accent' onChange={manifestProperty}>
                                        <option disabled selected value>Select an option</option>
                                        <option value='name'>Name</option>
                                        <option value='phoneNumber'>Phone number</option>
                                        <option value='address'>Address</option>
                                   </Select>

                                   {property?.value && <Editable placeholder={property.value} flexGrow='1'>
                                        <EditablePreview />
                                        <EditableInput onBlur={(event) => property.value = event.target.value} paddingX='3' />
                                   </Editable>}

                              </Flex>)}

                              <IconButton icon={<AddIcon />} onClick={addField} colorScheme='pink' variant='outline' width='100%' />

                         </ModalBody>

                         <ModalFooter>
                              <Button variant='solid' colorScheme='pink' onClick={handleCustomerUpdate}>Save</Button>
                              <Button variant='outline' onClick={() => setOpen(false)}>Close</Button>
                         </ModalFooter>
                    </ModalContent>
               </Modal>
          </>
     )
}

export default CustomerEditorDialog