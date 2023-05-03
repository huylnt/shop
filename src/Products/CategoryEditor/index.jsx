import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Input, Button } from '@chakra-ui/react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '@chakra-ui/react'
import { originCategoryContext } from 'context/CategoryContext'

const CategoryEditor = ({ mode, originCategoryID, originCategoryName, setOpen }) => {
     const categoryContext = useContext(originCategoryContext)
     const { setRemoteNewCategory } = categoryContext
     const [categoryName, setCategoryName] = useState()
     const navigateTo = useNavigate()
     const toast = useToast()

     const handleCategoryCreated = async () => {
          if (!categoryName) return
          if (mode === 'CREATE') {
               toast({
                    title: 'Creating new category...',
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'pink'
               })
     
               const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category'), {
                    method: 'POST',
                    headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                    },
                    body: JSON.stringify({
                         name: categoryName
                    })
               })
     
               const content = await response.json()
               if (content.errors) {
                    toast({
                         title: 'This name has already existed before',
                         variant: 'subtle',
                         status: 'warning',
                         position: 'bottom-right',
                         colorScheme: 'orange'
                    })
                    return
               }
     
               toast({
                    title: 'Category has been created successfully',
                    variant: 'subtle',
                    status: 'success',
                    position: 'bottom-right',
                    colorScheme: 'purple'
               })
          }

          else if (mode === 'EDIT') {
               if (categoryName === originCategoryName) {
                    toast({
                         title: 'Nothing has changed with the name',
                         variant: 'subtle',
                         status: 'warning',
                         position: 'bottom-right',
                         colorScheme: 'orange'
                    })
                    return
               }
               else {
                    toast({
                         title: 'Updating category name...',
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-right',
                         colorScheme: 'pink'
                    })
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category/').concat(originCategoryID), {
                         method: 'PUT',
                         headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         },
                         body: JSON.stringify({
                              name: categoryName
                         })
                    })
               }
          }

          setRemoteNewCategory(previous => previous + 1)
          setOpen(false)
     }

     return (
          <>
               <Modal isOpen={true} onClose={() => setOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                         <ModalHeader>{(mode === 'CREATE') ? 'Create new' : 'Edit'} category</ModalHeader>
                         <ModalBody>
                              <Input placeholder={(mode === 'CREATE') ? 'New category name' : originCategoryName} onChange={(event) => setCategoryName(event.target.value)} />
                         </ModalBody>

                         <ModalFooter>
                              <Button variant='solid' colorScheme='pink' marginRight='10px' onClick={handleCategoryCreated}>Confirm</Button>
                              <Button variant='outline' colorScheme='pink' mr={3} onClick={() => setOpen(false)}>Close</Button>
                         </ModalFooter>
                    </ModalContent>
               </Modal>
          </>
     )
}

export default CategoryEditor