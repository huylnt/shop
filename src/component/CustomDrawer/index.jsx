import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent } from '@chakra-ui/react'
import { Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { Flex, Stack, Text, Button, Tag } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useRef, useEffect, useState, useContext, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router'

import { originUserContext } from 'context/UserAuthenticationContext'
import { originProductContext } from 'context/ProductContext'
import { originCategoryContext } from 'context/CategoryContext'
import { originCustomerContext } from 'context/CustomerContext'
import { originOrderContext } from 'context/OrderContext'
import { convertToValidDateFormat } from 'valueConverter'

const CustomDrawer = ({ context, setDrawerOpened }) => {
     const userContext = useContext(originUserContext)
     const { userID } = userContext
     const productContext = useContext(originProductContext)
     const { setGlobalProducts, setProductTotalPage, setProductCurrentPage, productPaginatingNumber, setProductPaginatingNumber, productSearched, setProductSearched, refreshProducts, categoryList, fetchCategoryList } = productContext
     const categoryContext = useContext(originCategoryContext)
     const { categories, setGlobalCategories, setCategoryTotalPage, setCategoryCurrentPage, categoryPaginatingNumber, setCategoryPaginatingNumber, categorySearched, setCategorySearched, refreshCategories } = categoryContext
     const customerContext = useContext(originCustomerContext)
     const { customers, setGlobalCustomers, setCustomerTotalPage, setCustomerCurrentPage, customerPaginatingNumber, setCustomerPaginatingNumber, customerSearched, setCustomerSearched, refreshCustomers } = customerContext
     const orderContext = useContext(originOrderContext)
     const { orders, setGlobalOrders, setOrderCurrentPage, setOrderTotalPage, orderPaginatingNumber, setOrderPaginatingNumber, orderSearched, setOrderSearched, refreshOrders } = orderContext

     const btnRef = useRef()
     const toast = useToast()
     const navigateTo = useNavigate()

     const [paginatingNumber, setPaginatingNumber] = useState()

     // FOR PRODUCT
     const [categoryName, setCategoryName] = useState()
     const [startPrice, setStartPrice] = useState()
     const [endPrice, setEndPrice] = useState()
     const [productFilterMode, setProductFilterMode] = useState('')
     ////////////

     // FOR ORDER
     const [startDateString, setStartDateString] = useState()
     const [endDateString, setEndDateString] = useState()
     ////////////


     const handleCustomizationSaved = async () => {

          if (context === 'PRODUCT') {
               if (paginatingNumber !== productPaginatingNumber) {
                    toast({
                         title: 'Changing page size...',
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-left',
                         colorScheme: 'pink'
                    })

                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/PaginatingNumber'), {
                         method: 'PUT',
                         headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         },
                         body: JSON.stringify({
                              userID: userID,
                              key: 'product',
                              size: paginatingNumber
                         })
                    })

                    const nextResponse = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('?page=').concat(1).concat('&size=').concat(paginatingNumber), {
                         headers: {
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         }
                    })
                    const content = await nextResponse.json()
                    setGlobalProducts(content.result)
                    setProductCurrentPage(content.countInfo.currentPage)
                    setProductTotalPage(content.countInfo.totalPages)
                    setProductPaginatingNumber(content.countInfo.pageSize)
               }

               if (categoryName) {
                    toast({
                         title: 'Filtering product by category...',
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-left',
                         colorScheme: 'pink'
                    })
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('/Category').concat('?categoryName=').concat(categoryName).concat('&page=').concat('1').concat('&size=').concat(paginatingNumber), {
                         headers: {
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         }
                    })
                    const content = await response.json()

                    setProductSearched(true)
                    setGlobalProducts(content.result)
                    setProductCurrentPage(content.countInfo.currentPage)
                    setProductTotalPage(content.countInfo.totalPages)
               }

               else if (startPrice && endPrice) {
                    toast({
                         title: 'Filtering product by price range...',
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-left',
                         colorScheme: 'pink'
                    })

                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/PriceRange').concat('?page=').concat('1').concat('&size=').concat(paginatingNumber), {
                         method: 'POST',
                         headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         },
                         body: JSON.stringify({
                              startPrice,
                              endPrice
                         })
                    })

                    if (!response.ok) {
                         console.log(response)
                    }

                    const content = await response.json()

                    setProductSearched(true)
                    setGlobalProducts(content.result)
                    setProductCurrentPage(content.countInfo.currentPage)
                    setProductTotalPage(content.countInfo.totalPages)
               }
          }

          else if (context === 'CATEGORY') {
               if (paginatingNumber !== categoryPaginatingNumber) {
                    toast({
                         title: 'Changing page size...',
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-left',
                         colorScheme: 'pink'
                    })

                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/PaginatingNumber'), {
                         method: 'PUT',
                         headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         },
                         body: JSON.stringify({
                              userID: userID,
                              key: 'category',
                              size: paginatingNumber
                         })
                    })

                    const nextResponse = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category').concat('?page=').concat(1).concat('&size=').concat(paginatingNumber), {
                         headers: {
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         }
                    })
                    const content = await nextResponse.json()

                    setGlobalCategories(content.result)
                    setCategoryCurrentPage(content.countInfo.currentPage)
                    setCategoryTotalPage(content.countInfo.totalPages)
                    setCategoryPaginatingNumber(content.countInfo.pageSize)
               }
          }

          else if (context === 'CUSTOMER') {
               if (paginatingNumber !== customerPaginatingNumber) {
                    toast({
                         title: 'Changing page size...',
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-left',
                         colorScheme: 'pink'
                    })

                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/PaginatingNumber'), {
                         method: 'PUT',
                         headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         },
                         body: JSON.stringify({
                              userID: userID,
                              key: 'customer',
                              size: paginatingNumber
                         })
                    })

                    const nextResponse = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer').concat('?page=').concat(1).concat('&size=').concat(paginatingNumber), {
                         headers: {
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         }
                    })
                    const content = await nextResponse.json()

                    setGlobalCustomers(content.result)
                    setCustomerCurrentPage(content.countInfo.currentPage)
                    setCustomerTotalPage(content.countInfo.totalPages)
                    setCustomerPaginatingNumber(content.countInfo.pageSize)
               }
          }

          else if (context === 'ORDER') {
               if (paginatingNumber !== orderPaginatingNumber) {
                    toast({
                         title: 'Changing page size...',
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-left',
                         colorScheme: 'pink'
                    })

                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/PaginatingNumber'), {
                         method: 'PUT',
                         headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         },
                         body: JSON.stringify({
                              userID: userID,
                              key: 'order',
                              size: paginatingNumber
                         })
                    })

                    const nextResponse = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order').concat('?page=').concat(1).concat('&size=').concat(paginatingNumber), {
                         headers: {
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         }
                    })
                    const content = await nextResponse.json()

                    setGlobalOrders(content.result)
                    setOrderCurrentPage(content.countInfo.currentPage)
                    setOrderTotalPage(content.countInfo.totalPages)
                    setOrderPaginatingNumber(content.countInfo.pageSize)
               }

               if (startDateString && endDateString) {
                    toast({
                         title: 'Filtering order by date range...',
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-left',
                         colorScheme: 'pink'
                    })

                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order/DateRange').concat('?page=').concat('1').concat('&size=').concat(paginatingNumber), {
                         method: 'POST',
                         headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         },
                         body: JSON.stringify({
                              startDate: convertToValidDateFormat(startDateString),
                              endDate: convertToValidDateFormat(endDateString)
                         })
                    })

                    if (!response.ok) {
                         console.log(response)
                    }

                    const content = await response.json()

                    setGlobalOrders(content.result)
                    setOrderCurrentPage(content.countInfo.currentPage)
                    setOrderTotalPage(content.countInfo.totalPages)
                    setOrderSearched(true)
               }
          }

          setDrawerOpened(false)
     }

     const removeFilter = async () => {
          if (context === 'PRODUCT') refreshProducts()
          else if (context === 'CATEGORY') refreshCategories()
          else if (context === 'CUSTOMER') refreshCustomers()
          else if (context === 'ORDER') refreshOrders()
          setDrawerOpened(false)
     }

     const changeProductFilterMode = (event) => {
          if (event.target.selectedIndex == 0) {
               setProductFilterMode('category')
               setStartPrice()
               setEndPrice()
          }
          else {
               setProductFilterMode('price-range')
               setCategoryName()
          }
     }

     useLayoutEffect(() => {
          if (context === 'PRODUCT') {
               fetchCategoryList()
               setProductFilterMode('category')
               setPaginatingNumber(productPaginatingNumber)
          }

          else if (context === 'CATEGORY') {
               setPaginatingNumber(categoryPaginatingNumber)
          }

          else if (context === 'CUSTOMER') {
               setPaginatingNumber(customerPaginatingNumber)
          }

          else if (context === 'ORDER') {
               setPaginatingNumber(orderPaginatingNumber)
          }

     }, [productPaginatingNumber, categoryPaginatingNumber, customerPaginatingNumber, orderPaginatingNumber])

     return (
          <Drawer isOpen={true} placement='right' onClose={() => setDrawerOpened(false)} finalFocusRef={btnRef}>
               <DrawerOverlay />
               <DrawerContent>
                    <DrawerHeader color='heading'>Customize this page</DrawerHeader>

                    <DrawerBody>
                         <Flex flexFlow='column' gap='30px'>
                              <Stack>
                                   <Text fontWeight='bold'>Maximum number of {context} per page</Text>
                                   <NumberInput step={1} defaultValue={paginatingNumber} min={1} max={20} focusBorderColor='secondary'>
                                        <NumberInputField id='paginating_number_input'  onChange={(event) => setPaginatingNumber(event.target.value)} />
                                        <NumberInputStepper onClick={() => setPaginatingNumber(document.getElementById('paginating_number_input').value)}>
                                             <NumberIncrementStepper />
                                             <NumberDecrementStepper />
                                        </NumberInputStepper>
                                   </NumberInput>
                              </Stack>

                              {(context === 'PRODUCT') &&
                                   <Flex align='center' gap='10px'>
                                        <Text fontWeight='bold' width='100px'>Filter by</Text>
                                        <Select onChange={changeProductFilterMode} focusBorderColor='secondary'>
                                             <option value='category'>Category</option>
                                             <option value='price-range'>Price range</option>
                                        </Select>
                                   </Flex>
                              }

                              {(productFilterMode === 'category') && <Stack>
                                   <Select focusBorderColor='secondary' onChange={(event) => setCategoryName(event.target.options[event.target.selectedIndex].innerHTML)}>
                                        <option disabled selected value>Select an option</option>
                                        {categoryList.map(category => <option value={category}>{category}</option>)}
                                   </Select>
                              </Stack>}

                              {(productFilterMode === 'price-range') && <Stack>
                                   <NumberInput step={50000} defaultValue={0} min={0} max={1000000} focusBorderColor='secondary'>
                                        <NumberInputField id='start_price_input' onChange={(event) => setStartPrice(event.target.value)} />
                                        <NumberInputStepper onClick={() => setStartPrice(document.getElementById('start_price_input').value)}>
                                             <NumberIncrementStepper />
                                             <NumberDecrementStepper />
                                        </NumberInputStepper>
                                   </NumberInput>
                                   <NumberInput step={50000} defaultValue={100000} min={100000} max={1000000} focusBorderColor='secondary'>
                                        <NumberInputField id='end_price_input' onChange={(event) => setEndPrice(event.target.value)} />
                                        <NumberInputStepper onClick={() => setEndPrice(document.getElementById('end_price_input').value)}>
                                             <NumberIncrementStepper />
                                             <NumberDecrementStepper />
                                        </NumberInputStepper>
                                   </NumberInput>
                              </Stack>}

                              {(context === 'ORDER') &&
                                   <Stack>
                                        <Flex align='center' gap='10px' justify='flex-start'>
                                             <Text fontWeight='bold' width='fit-content'>Filter by</Text>
                                             <Tag size='lg' variant='outline' colorScheme='pink'>DATE RANGE</Tag>
                                        </Flex>

                                        <Input type='date' onChange={(event) => setStartDateString(event.target.value)} focusBorderColor='secondary' />
                                        <Input type='date' onChange={(event) => setEndDateString(event.target.value)} focusBorderColor='secondary' />
                                   </Stack>
                              }

                         </Flex>
                    </DrawerBody>

                    <DrawerFooter>
                         <Button variant='outline' colorScheme='pink' mr={3} onClick={() => setDrawerOpened(false)}>Cancel</Button>
                         <Button variant='outline' colorScheme='pink' mr={3} onClick={removeFilter}>Remove filter</Button>
                         <Button colorScheme='pink' onClick={handleCustomizationSaved}>Save</Button>
                    </DrawerFooter>
               </DrawerContent>
          </Drawer>
     )
}

export default CustomDrawer