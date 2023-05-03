import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import * as XLSX from 'xlsx'

import { BsSearch } from 'react-icons/bs'
import { IoCreateOutline } from 'react-icons/io5'
import { FcSettings } from 'react-icons/fc'

import { Flex, Input, InputGroup, InputRightElement, Button, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'

import CustomDrawer from 'component/CustomDrawer'
import CategoryEditor from 'Products/CategoryEditor'

import { originProductContext } from 'context/ProductContext'
import { originCategoryContext } from 'context/CategoryContext'
import { originCustomerContext } from 'context/CustomerContext'
import { originOrderContext } from 'context/OrderContext'

const ControlPanel = ({ context }) => {
     const productContext = useContext(originProductContext)
     const { products, setGlobalProducts, productTotalPage, setProductTotalPage, productCurrentPage, setProductCurrentPage, productPaginatingNumber, setProductPaginatingNumber, productSearched, setProductSearched, refreshProducts, getCategoryIDFromName } = productContext
     const categoryContext = useContext(originCategoryContext)
     const { categories, setGlobalCategories, categoryTotalPage, setCategoryTotalPage, categoryCurrentPage, setCategoryCurrentPage, categoryPaginatingNumber, setCategoryPaginatingNumber, setCategorySearched, refreshCategories, setRemoteNewCategory } = categoryContext
     const customerContext = useContext(originCustomerContext)
     const { customers, setGlobalCustomers, customerTotalPage, setCustomerTotalPage, customerCurrentPage, setCustomerCurrentPage, customerPaginatingNumber, setCustomerPaginatingNumber, customerSearched, setCustomerSearched, refreshCustomers } = customerContext
     const orderContext = useContext(originOrderContext)
     const { orders, setGlobalOrders, orderCurrentPage, setOrderCurrentPage, orderTotalPage, setOrderTotalPage, orderPaginatingNumber, setOrderPaginatingNumber, orderSearched, setOrderSearched, refreshOrders } = orderContext

     const navigateTo = useNavigate()
     const toast = useToast()

     const [paginatingNumber, setPaginatingNumber] = useState()

     const [searchInput, setSearchInput] = useState('')
     const [drawerOpened, setDrawerOpened] = useState(false)
     const [categoryCreatorOpened, setCategoryCreatorOpened] = useState(false)

     const findByName = async () => {
          if (context === 'PRODUCT') {
               if (searchInput.length > 0) {
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('/Name').concat('?name=').concat(searchInput).concat('&page=').concat(1).concat('&size=').concat(paginatingNumber), {
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
               else refreshProducts()
          }

          else if (context === 'CATEGORY') {
               if (searchInput.length > 0) {
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category').concat('/Name').concat('?name=').concat(searchInput).concat('&page=').concat(1).concat('&size=').concat(paginatingNumber), {
                         headers: {
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         }
                    })
                    const content = await response.json()
                    setCategorySearched(true)
                    setGlobalCategories(content.result)
                    setCategoryCurrentPage(content.countInfo.currentPage)
                    setCategoryTotalPage(content.countInfo.totalPages)
               }
               else refreshCategories()
          }

          else if (context === 'CUSTOMER') {
               if (searchInput.length > 0) {
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer').concat('/Name').concat('?name=').concat(searchInput).concat('&page=').concat(1).concat('&size=').concat(paginatingNumber), {
                         headers: {
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         }
                    })
                    const content = await response.json()

                    setCustomerSearched(true)
                    setGlobalCustomers(content.result)
                    setCustomerCurrentPage(content.countInfo.currentPage)
                    setCustomerTotalPage(content.countInfo.totalPages)
               }
               else refreshCustomers()
          }

          else if (context === 'ORDER') {
               toast({
                    title: 'Try to filter with date range',
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'orange'
               })
          }

     }

     const goToCreationPage = () => {
          if (context === 'PRODUCT') {
               navigateTo('/create/product')
          }
          else if (context === 'CATEGORY') {
               setCategoryCreatorOpened(true)
          }
          else if (context === 'CUSTOMER') {
               navigateTo('/create/customer')
          }
          else if (context === 'ORDER') {
               navigateTo('/create/order')
          }
     }

     const handleCategoryCreatedFromExcel = async (data) => {
          for (let item of data) {
               const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category'), {
                    method: 'POST',
                    headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                    },
                    body: JSON.stringify({
                         name: item.name
                    })
               })

               const content = await response.json()
               if (content.errors) {
                    toast({
                         title: `${item.name} has already existed before`,
                         variant: 'subtle',
                         status: 'warning',
                         position: 'bottom-right',
                         colorScheme: 'orange'
                    })
               }
               else {
                    toast({
                         title: `${item.name} has been created successfully`,
                         variant: 'subtle',
                         status: 'success',
                         position: 'bottom-right',
                         colorScheme: 'purple'
                    })
               }
          }

          setRemoteNewCategory(prev => prev + 1)
          setTimeout(() => toast.closeAll(), 1000)
     }

     const handleProductCreatedFromExcel = async (data) => {
          for (let item of data) {
               const response1 = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('/Name').concat('?name=').concat(item.name), {
                    headers: {
                         'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                    }
               })
               const content1 = await response1.json()
               if (content1.result.length > 0) {
                    toast({
                         title: `${item.name} had already existed`,
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-right',
                         colorScheme: 'orange'
                    })
                    continue
               }

               const { categoryName } = item
               let categoryID

               if (!categoryName) {
                    toast({
                         title: 'This product has not been of any category. You may add it later.',
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-left',
                         colorScheme: 'orange'
                    })
                    categoryID = null
               }
               else {
                    categoryID = await getCategoryIDFromName(categoryName)
                    if (!categoryID) {
                         toast({
                              title: `Also creating new category ${categoryName}...`,
                              variant: 'subtle',
                              status: 'info',
                              position: 'bottom-left',
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
                         categoryID = content._id
                    }
               }

               delete item.categoryName
               item.categoryID = categoryID

               toast({
                    title: 'Creating product...',
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'pink'
               })

               const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product'), {
                    method: 'POST',
                    headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                    },
                    body: JSON.stringify(item)
               })

               toast({
                    title: 'Product has been added successfully',
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'purple'
               })

               refreshProducts()
               setTimeout(() => toast.closeAll(), 1000)
          }
     }

     const readExcel = (event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.readAsBinaryString(file);
          reader.onload = (evt) => {
               const bstr = evt.target.result
               const wb = XLSX.read(bstr, { type: 'binary' })

               if (context === 'CATEGORY') {
                    const wsname = wb.SheetNames.find(sheetName => sheetName === 'Category')
                    const ws = wb.Sheets[wsname]
                    const data = XLSX.utils.sheet_to_json(ws);

                    handleCategoryCreatedFromExcel(data)
               }

               else if (context === 'PRODUCT') {
                    const wsname = wb.SheetNames.find(sheetName => sheetName === 'Product')
                    const ws = wb.Sheets[wsname]
                    const data = XLSX.utils.sheet_to_json(ws);

                    handleProductCreatedFromExcel(data)
               }

               event.target.value = ''
          };
     }

     useEffect(() => {

          if (context === "PRODUCT") {
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
          <Flex justifyContent='space-between' alignItems='center' margin='0 0 10px 0'>
               <Flex justifyContent='flex-start' gap='20px' minWidth='70%'>
                    <InputGroup maxWidth='300px'>
                         <Input placeholder='Find by name' bg='white' rounded='50px' focusBorderColor='accent' onChange={(event) => setSearchInput(event.target.value)} onKeyDown={(event) => {
                              if (event.key === 'Enter') findByName()
                         }} />
                         <InputRightElement children={<BsSearch color='accent' />} onClick={findByName} />
                    </InputGroup>

                    <Menu>
                         <MenuButton as={Button} leftIcon={<IoCreateOutline />} bg='white' colorScheme='pink' variant='outline' padding='10px'>
                              Create
                         </MenuButton>
                         <MenuList dropShadow='2xl'>
                              <MenuItem onClick={goToCreationPage}>Create manually</MenuItem>
                              {(context === 'PRODUCT' || context === 'CATEGORY') && <MenuItem onClick={() => { document.getElementById(`${context}_excel_upload_input`).click() }}>Import from Excel</MenuItem>}
                         </MenuList>
                    </Menu>

                    <Input id={`${context}_excel_upload_input`} type='file' hidden onChange={readExcel} />
               </Flex>

               <IconButton aria-label='Configuration' icon={<FcSettings />} rounded='50%' size='lg' onClick={() => setDrawerOpened(true)} />

               {drawerOpened && <CustomDrawer context={context} setDrawerOpened={setDrawerOpened} />}

               {categoryCreatorOpened && <CategoryEditor mode='CREATE' setOpen={setCategoryCreatorOpened} />}
          </Flex>
     )
}

export default ControlPanel