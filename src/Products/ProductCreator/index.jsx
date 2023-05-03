import { useState, useEffect, memo, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { writeData } from 'localFile'
import axios from 'axios'
import { originProductContext } from 'context/ProductContext'

import CategoryEditor from 'Products/CategoryEditor'

import { Image, Flex, Text, Center, Divider, Input, Button, IconButton, useToast, Editable, EditablePreview, EditableInput, Select } from '@chakra-ui/react'
import { IoCreateOutline } from 'react-icons/io5'
import { TiUploadOutline } from 'react-icons/ti'

const ThumbnailIllustrationList = memo(({ illustrations, localIllustrations, setIllustrations, setLocalIllustrations, setCurrentIllustrationIndex }) => {
     const toast = useToast()

     const handleIllustrationAddition = async () => {
          if (illustrations.length >= 4) {
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
          setIllustrations(previous => [...previous, image])
          setLocalIllustrations(previous => [...previous, URL.createObjectURL(image)])
     }
     return (
          <Flex justify='center' gap='3' align='center'>
               {localIllustrations.map((illustration, index) => <Image key={index} src={illustration} boxSize='50' borderRadius='10' onClick={() => setCurrentIllustrationIndex(index)} _hover={{ filter: 'brightness(80%)', cursor: 'pointer' }} boxShadow='xl' fallbackSrc='https://via.placeholder.com/150' />)}
               <IconButton icon={<TiUploadOutline />} onClick={handleIllustrationAddition} colorScheme='pink' variant='outline' borderRadius='50%' />
               <Input id='image_upload_input' type='file' hidden onChange={uploadImageToProductIllustration} />
          </Flex>
     )
})

const ProductCreator = () => {
     const productContext = useContext(originProductContext)
     const { getCategoryIDFromName, categoryList, fetchCategoryList } = productContext

     const toast = useToast()
     const navigateTo = useNavigate()
     const location = useLocation()

     const [name, setName] = useState()
     const [availableSlot, setAvailableSlot] = useState()
     const [totalSlot, setTotalSlot] = useState()
     const [actualPrice, setActualPrice] = useState()
     const [originalPrice, setOriginalPrice] = useState()
     const [providerName, setProviderName] = useState()
     const [origin, setOrigin] = useState()
     const [brand, setBrand] = useState()
     const [description, setDescription] = useState()
     const [categoryName, setCategoryName] = useState()
     const [categoryCreatorOpened, setCategoryCreatorOpened] = useState(false)

     const [illustrations, setIllustrations] = useState([])
     const [localIllustrations, setLocalIllustrations] = useState([])
     const [currentIllustrationIndex, setCurrentIllustrationIndex] = useState(0)

     const handleCategoryChanged = (event) => {
          const selectedOption = event.target.selectedOptions[0]
          if (selectedOption.value !== 'create-new-category') setCategoryName(selectedOption.innerHTML)
          else {
               setCategoryCreatorOpened(true)
          }
     }

     const handleProductCreation = async () => {
          let emptyField
          if (!name) emptyField = 'name'
          else if (!originalPrice) emptyField = 'original price'
          else if (!actualPrice) emptyField = 'actual price'

          if (emptyField) {
               toast({
                    title: `Field ${emptyField} cannot be left empty`,
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'pink'
               })
               return
          }

          toast({
               title: 'Creating product...',
               variant: 'subtle',
               status: 'info',
               position: 'bottom-right',
               colorScheme: 'pink'
          })

          let categoryID = await getCategoryIDFromName(categoryName)
     
          if (!categoryID) categoryID = null
        
          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product'), {
               method: 'POST',
               headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               },
               body: JSON.stringify({name, description, originalPrice, actualPrice, totalSlot, availableSlot, categoryID, providerName, brand, origin})
          })

          const content = await response.json()

          if (!response.ok) {
               toast({
                    title: 'This product has not been of any category. You may add it later.',
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-left',
                    colorScheme: 'orange'
               })
          }

          const newProductID = content['_id']

          toast({
               title: 'Uploading image...',
               variant: 'subtle',
               status: 'info',
               position: 'bottom-right',
               colorScheme: 'pink'
          })

          for (const illustration of illustrations) {
               let formData = new FormData();
               formData.append("file", illustration);

               const response = await axios.post(process.env.REACT_APP_BACKEND_URL.concat('/Storage/Illustration'), formData, {
                    headers: {
                         'Content-Type': 'multipart/form-data'
                    }
               });

               const imagePath = response.data.publicPath

               const nextResponse = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/Illustration'), {
                    method: 'POST',
                    headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                    },
                    body: JSON.stringify({
                         _parent: newProductID,
                         illustrationPath: imagePath
                    })
               })
          }

          toast({
               title: 'Product has been added successfully',
               variant: 'subtle',
               status: 'info',
               position: 'bottom-right',
               colorScheme: 'purple'
          })

          navigateTo(-1)
     }

     useEffect(() => {
          fetchCategoryList()
          writeData('route.txt', location.pathname)
     }, [categoryCreatorOpened])

     return (
          <>
               <Text textAlign='center' fontSize='24px' color='heading' fontWeight='bold' marginBottom='20px'>Creating new product</Text>

               <Center width='100%' height='150px' bg='white' borderRadius='20'>
                    <Image fallbackSrc='https://via.placeholder.com/150' src={(localIllustrations.length > 0) ? localIllustrations[currentIllustrationIndex] : ''} height='100%' objectFit='contain' />
               </Center>

               <Flex justify='space-between' align='center' marginY='30'>
                    <Flex flexFlow='column'>
                         <Flex align='end' gap='5' justify='flex-start'>
                              <Text color='heading' fontSize='20' fontWeight='bold'>Name</Text>
                              <Editable placeholder='Product X' width='400px'>
                                   <EditablePreview />
                                   <EditableInput onBlur={(event) => setName(event.target.value)} paddingX='3' />
                              </Editable>
                         </Flex>

                         <Flex align='center' gap='5' justify='flex-start'>
                              <Text color='heading' fontSize='20' fontWeight='bold'>Category</Text>
                              <Select onChange={handleCategoryChanged}>
                                   <option selected disabled>Select an option</option>
                                   <option value='create-new-category'>Create new category</option>
                                   {(categoryList?.map((category, index) => <option key={index} value={index} >{category}</option>))}
                              </Select>
                         </Flex>
                    </Flex>

                    <ThumbnailIllustrationList illustrations={illustrations} localIllustrations={localIllustrations} setIllustrations={setIllustrations} setLocalIllustrations={setLocalIllustrations} setCurrentIllustrationIndex={setCurrentIllustrationIndex} />
               </Flex>

               <Flex justify='space-between'>
                    <Flex align='end' gap='10'>
                         <Text color='heading' fontSize='18' fontWeight='bold'>Available slot</Text>
                         <Editable placeholder='0' width='100px'>
                              <EditablePreview />
                              <EditableInput type='number' onBlur={(event) => setAvailableSlot(Number(event.target.value))} paddingX='3' />
                         </Editable>
                    </Flex>

                    <Flex align='end' gap='10'>
                         <Text color='heading' fontSize='18' fontWeight='bold'>Total slot</Text>
                         <Editable placeholder='0' width='100px'>
                              <EditablePreview />
                              <EditableInput type='number' onBlur={(event) => setTotalSlot(Number(event.target.value))} paddingX='3' />
                         </Editable>
                    </Flex>
               </Flex>

               <Flex justify='space-between'>
                    <Flex align='end' gap='10'>
                         <Text color='heading' fontSize='18' fontWeight='bold'>Actual price</Text>
                         <Editable placeholder='0' width='100px'>
                              <EditablePreview />
                              <EditableInput type='number' textAlign='center' onBlur={(event) => setActualPrice(Number(event.target.value))} paddingX='3' />
                         </Editable>
                    </Flex>

                    <Flex align='end' gap='10'>
                         <Text color='heading' fontSize='18' fontWeight='bold'>Original price</Text>
                         <Editable placeholder='0' width='100px'>
                              <EditablePreview />
                              <EditableInput type='number' onBlur={(event) => setOriginalPrice(Number(event.target.value))} paddingX='3' />
                         </Editable>
                    </Flex>
               </Flex>

               <Divider bg='secondary' height='1' marginY='30' />

               <Flex align='end' gap='10'>
                    <Text color='heading' fontSize='18' fontWeight='bold'>Provider name</Text>
                    <Editable placeholder='Company X' width='200px'>
                         <EditablePreview />
                         <EditableInput onBlur={(event) => setProviderName(event.target.value)} paddingX='3' />
                    </Editable>
               </Flex>

               <Flex align='end' gap='10'>
                    <Text color='heading' fontSize='18' fontWeight='bold'>Origin</Text>
                    <Editable placeholder='Country X' width='200px'>
                         <EditablePreview />
                         <EditableInput onBlur={(event) => setOrigin(event.target.value)} paddingX='3' />
                    </Editable>
               </Flex>

               <Flex align='end' gap='10'>
                    <Text color='heading' fontSize='18' fontWeight='bold'>Brand</Text>
                    <Editable placeholder='Brand X' width='200px'>
                         <EditablePreview />
                         <EditableInput onBlur={(event) => setBrand(event.target.value)} paddingX='3' />
                    </Editable>
               </Flex>

               <Divider bg='secondary' height='0.5' marginY='30' />

               <Flex flexFlow='column'>
                    <Text color='heading' fontSize='18' fontWeight='bold'>Description</Text>
                    <Editable placeholder='Give more details to your product' width='100%'>
                         <EditablePreview />
                         <EditableInput onBlur={(event) => setDescription(event.target.value)} paddingX='3' />
                    </Editable>
               </Flex>

               <Flex justify='center' gap='10' marginY='20px'>
                    <Button leftIcon={<IoCreateOutline />} variant='solid' colorScheme='pink' onClick={handleProductCreation}>Submit</Button>
               </Flex>

               {(categoryCreatorOpened) && <CategoryEditor mode='CREATE' setOpen={setCategoryCreatorOpened} />}
          </>
     )
}

export default ProductCreator