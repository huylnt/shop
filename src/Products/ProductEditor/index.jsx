import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { originProductContext } from 'context/ProductContext'

import CategoryEditor from 'Products/CategoryEditor'

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, Flex, Text, Select, IconButton, Editable, EditablePreview, EditableInput, Image, Input } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { TiUploadOutline } from 'react-icons/ti'

import axios from 'axios'

const ProductEditor = ({ setOpen, product }) => {
     const productContext = useContext(originProductContext)
     const { getCategoryIDFromName, categoryList, fetchCategoryList } = productContext

     const toast = useToast()
     const navigateTo = useNavigate()

     const [categoryCreatorOpened, setCategoryCreatorOpened] = useState(false)
     const [pendingUpdatedProperty, setPendingUpdatedProperty] = useState([
          { key: '', value: '' }
     ])

     const addField = () => {
          if (pendingUpdatedProperty.length >= 10) {
               toast({
                    title: 'There are no more fields can be updated',
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'pink'
               })
               return
          }

          setPendingUpdatedProperty(previous => [...previous, { key: '', value: '' }])
     }

     const handleIllustrationAddition = () => {
          if (product.illustrations.length >= 4) {
               toast({
                    title: 'A product can contain the maximum of 4 illustrations.',
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'pink'
               })
               return
          }

          document.getElementById('image_upload_input').click()
     }

     const uploadImageToProductIllustration = async (event) => {
          const image = event.target.files[0]

          toast({
               title: 'Uploading image to cloud storage...',
               variant: 'subtle',
               status: 'info',
               position: 'bottom-right',
               colorScheme: 'pink'
          })

          let formData = new FormData();
          formData.append("file", image);
          const response = await axios.post(process.env.REACT_APP_BACKEND_URL.concat('/Storage/Illustration'), formData, {
               headers: {
                    'Content-Type': 'multipart/form-data'
               }
          });

          const imagePath = response.data.publicPath

          toast({
               title: 'Inserting the uploaded image to this product illustration...',
               variant: 'subtle',
               status: 'info',
               position: 'bottom-right',
               colorScheme: 'pink'
          })

          const nextResponse = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/Illustration'), {
               method: 'POST',
               headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               },
               body: JSON.stringify({
                    _parent: product['_id'],
                    illustrationPath: imagePath
               })
          })

          const content = await nextResponse.json()

          product.illustrations.push(content)

          setRefresher(previous => previous + 1)
     }

     const deleteProductIllustration = async (event) => {
          const illustrationPath = event.target.src
          const illustrationIndex = Number(event.target.getAttribute('data-index'))
          const illustration = product.illustrations.find((e, i) => i === illustrationIndex)

          toast({
               title: 'Deleting image in cloud storage and also in this product illustration',
               variant: 'subtle',
               status: 'info',
               position: 'bottom-right',
               colorScheme: 'pink'
          })

          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/Illustration/').concat(illustration['_id']).concat('?illustrationPath=').concat(illustrationPath), {
               method: 'DELETE',
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })

          if (!response.ok) return

          product.illustrations = product.illustrations.filter((e, i) => i !== illustrationIndex)

          setRefresher(previous => previous + 1)
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
                    colorScheme: 'pink'
               })
               event.target.selectedIndex = 0
               return
          }

          const newPendingUpdatedProperty = pendingUpdatedProperty.map((element, index) => {
               if (index === Number(fieldIndex)) {
                    if (propertyKey === 'categoryID') {
                         fetchCategoryList()
                         let newValue;
                         if (product[propertyKey]?.name) {
                              newValue = product[propertyKey].name
                         }
                         else {
                              newValue = undefined
                         }
                         return { ...element, key: propertyKey, value: newValue }
                    }
                    else if (propertyKey === 'illustrations') {
                         return { ...element, key: propertyKey, value: '' }
                    }
                    else return { ...element, key: propertyKey, value: product[propertyKey] }

               }
               else return element
          })
          setPendingUpdatedProperty(newPendingUpdatedProperty)
     }

     const handleProductUpdate = async () => {

          const hasEmptyField = pendingUpdatedProperty.find(property => property.key !== 'illustrations' && property.value.length < 1)
          if (hasEmptyField) {
               toast({
                    title: 'Please do not leave any field empty',
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'pink'
               })
               return
          }

          if (pendingUpdatedProperty.length === 1 && pendingUpdatedProperty.find(element => element.key === 'illustrations')) {
               setOpen(false)
               return
          }

          const obj = {}

          for (const element of pendingUpdatedProperty) {
               if (element.key === 'categoryID') {
                    const value = await getCategoryIDFromName(element.value)
                    if (value) obj[element.key] = value
               }
               else if (element.key !== 'illustrations') obj[element.key] = element.value
          }

          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/').concat(product['_id']), {
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
                    colorScheme: 'pink'
               })
               return false
          }

          const content = await response.json()

          toast({
               title: 'Product has been updated successfully',
               variant: 'subtle',
               status: 'success',
               position: 'bottom-right',
               colorScheme: 'purple'
          })

          navigateTo(`/products`)
     }

     const handleCategoryChanged = (event, property) => {
          const selectedOption = event.target.selectedOptions[0]
          if (selectedOption.value !== 'create-new-category') property.value = selectedOption.innerHTML
          else {
               setCategoryCreatorOpened(true)
          }
     }

     const [refresher, setRefresher] = useState(0)

     useEffect(() => {
          fetchCategoryList()
     }, [categoryCreatorOpened])

     return (
          <>
               <Modal onClose={() => setOpen(false)} isOpen={true} isCentered borderRadius='12px' size='xl'>
                    <ModalOverlay />
                    <ModalContent>
                         <ModalHeader bg='secondary' color='white' borderRadius='6px'>Edit product detail</ModalHeader>

                         <ModalBody>
                              {pendingUpdatedProperty.map((property, index) => <Flex data-index={index} gap='20px' marginY='20px' key={index} align='center'>
                                   <Select maxWidth='40%' borderWidth='2px' borderColor='accent' onChange={manifestProperty}>
                                        <option disabled selected value>Select an option</option>
                                        <option value='name'>Name</option>
                                        <option value='originalPrice'>Original price</option>
                                        <option value='actualPrice'>Actual price</option>
                                        <option value='totalSlot'>Total slot</option>
                                        <option value='availableSlot'>Available slot</option>
                                        <option value='providerName'>Provider name</option>
                                        <option value='brand'>Brand</option>
                                        <option value='origin'>Origin</option>
                                        <option value='categoryID'>Category</option>
                                        <option value='illustrations'>Illustration</option>
                                   </Select>
                                   
                                   {(property.key !== 'illustrations' && property.key !== 'categoryID') && property?.value !== undefined && <Editable placeholder={property.value} flexGrow='1'>
                                        <EditablePreview />
                                        <EditableInput onBlur={(event) => property.value = event.target.value} paddingX='3' />
                                   </Editable>}

                                   {(property.key === 'categoryID') && <Select onChange={(e) => handleCategoryChanged(e, property)}>
                                        <option value='create-new-category'>Create new category</option>
                                        {( categoryList?.map((category, index) => (category === property.value) ? <option key={index} value={index} selected>{category}</option>: <option key={index} value={index}>{category}</option>))}
                                   </Select>}

                                   {(property.key === 'illustrations') && <Flex gap='3' align='center'>
                                        {product.illustrations.map((illustration, index) => <Image key={index} data-index={index} src={illustration.illustrationPath} boxSize='50' borderRadius='10' onClick={deleteProductIllustration} _hover={{ filter: 'brightness(80%)', cursor: 'pointer' }} boxShadow='xl' border='2px solid var(--primary)' />)}
                                        <IconButton icon={<TiUploadOutline />} onClick={handleIllustrationAddition} colorScheme='pink' variant='outline' borderRadius='50%' />
                                        <Input id='image_upload_input' type='file' hidden onChange={uploadImageToProductIllustration} />
                                   </Flex>}

                              </Flex>)}

                              <IconButton icon={<AddIcon />} onClick={addField} colorScheme='pink' variant='outline' width='100%' />

                         </ModalBody>

                         <ModalFooter>
                              <Button variant='solid' colorScheme='pink' onClick={handleProductUpdate}>Save</Button>
                              <Button variant='outline' onClick={() => setOpen(false)}>Close</Button>
                         </ModalFooter>
                    </ModalContent>

                    {(categoryCreatorOpened) && <CategoryEditor mode='CREATE' setOpen={setCategoryCreatorOpened} />}
               </Modal>
          </>
     )
}

export default ProductEditor