import { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { originUserContext } from 'context/UserAuthenticationContext'
import { originProductContext } from 'context/ProductContext'
import { originCustomerContext } from 'context/CustomerContext'

import { convertToCurrency } from 'valueConverter'

import { Image, Flex, Text, Center, Box, Input, Button, IconButton, useToast, Editable, EditablePreview, EditableInput, Select, Badge, Divider } from '@chakra-ui/react'
import { IoCreateOutline } from 'react-icons/io5'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

const OrderCreator = () => {
     const userContext = useContext(originUserContext)
     const { userID } = userContext
     const customerContext = useContext(originCustomerContext)
     const { getCustomerFromName, listOfCustomerName, fetchListOfCustomerName } = customerContext
     const productContext = useContext(originProductContext)
     const { listOfProductName, fetchListOfProductName } = productContext

     const toast = useToast()
     const navigateTo = useNavigate()
     const location = useLocation()

     const [customerName, setCustomerName] = useState()
     const [pendingOrderItemList, setPendingOrderItemList] = useState([{
          counter: 1,
          productID: undefined,
          quantity: 1,
          price: undefined, 
     }])

     let totalPrice = 0
     let profit = 0
     let totalItem = 0

     const [refresher, setRefresher] = useState(0)

     const addOrderItem = () => {
          setPendingOrderItemList(previous => [...previous, {
               counter: pendingOrderItemList.length + 1,
               productID: undefined,
               quantity: 1,
               price: undefined
          }])
     }

     const handleProductAdded = (orderItemIndex, productID, event) => {
          if (pendingOrderItemList.find(orderItem => orderItem.productID === productID)) {
               toast({
                    title: `There is duplication for products`,
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'orange'
               })
               event.target.selectedIndex = 0
               return
          }

          pendingOrderItemList[orderItemIndex].productID = productID
          setRefresher(prev => prev + 1)
     }

     const handleProductQuantityChanged = (orderItemIndex, quantity) => {
          pendingOrderItemList[orderItemIndex].quantity = Number(quantity)
          setRefresher(prev => prev + 1)
     }

     const computePriceForSingleItem = (orderItemIndex, productID, quantity) => {
          if (!productID) return 0
          const currentProduct = listOfProductName.find(product => product._id === productID)
          const price = currentProduct.actualPrice * quantity
          const originalPrice = currentProduct.originalPrice * quantity
          pendingOrderItemList[orderItemIndex].price = price
          totalPrice += price
          profit += price - originalPrice
          totalItem += quantity
          return price
     }

     const deleteItem = (orderItemIndex) => {
          const newArr = pendingOrderItemList.filter((orderItem, index) => index !== orderItemIndex)
          setPendingOrderItemList(previous => newArr)
     }

     const handleCustomerChosen = (customerName) => {
          if (customerName !== 'Add new customer') setCustomerName(customerName)
          else navigateTo('/create/customer')
     }

     const handleOrderCreation = async () => {

          let emptyField
          if (!customerName) emptyField = 'customer'

          if (emptyField) {
               toast({
                    title: `Field ${emptyField} cannot be left empty`,
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'orange'
               })
          }

          else if (pendingOrderItemList.length < 1) {
               toast({
                    title: `There must be at least one item`,
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'orange'
               })
          }

          else if (pendingOrderItemList.find(orderItem => !orderItem.productID)) {
               toast({
                    title: `The product item cannot be left empty`,
                    variant: 'subtle',
                    status: 'warning',
                    position: 'bottom-right',
                    colorScheme: 'orange'
               })
          }

          else {
               const listOfPriceExceededItem = pendingOrderItemList.filter((orderItem, index) => {
                    const currentProduct = listOfProductName.find(product => product._id === orderItem.productID)
                    return (orderItem.quantity > currentProduct.availableSlot)
               })
               if (listOfPriceExceededItem.length > 0) {
                    listOfPriceExceededItem.forEach(orderItem => {
                         const currentProduct = listOfProductName.find(product => product._id === orderItem.productID)
                         toast({
                              title: `${currentProduct.name} currently remains ${currentProduct.availableSlot} slot`,
                              variant: 'subtle',
                              status: 'warning',
                              position: 'bottom-right',
                              colorScheme: 'orange'
                         })
                    })
                    return
               }

               toast({
                    title: 'Creating order...',
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'pink'
               })

               const customer = await getCustomerFromName(customerName)

               const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order'), {
                    method: 'POST',
                    headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                    },
                    body: JSON.stringify({
                         salePersonID: userID,
                         customerID: customer._id,
                         totalPrice: totalPrice,
                         profit: profit,
                         totalItem: totalItem
                    })
               })

               const newOrder = await response.json()
               const orderID = newOrder._id

               toast({
                    title: 'Inserting item to order...',
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'pink'
               })

               for (let orderItem of pendingOrderItemList) {
                    const response2 = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order/').concat(orderID).concat('/ItemList'), {
                         method: 'POST',
                         headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         },
                         body: JSON.stringify({
                              productID: orderItem.productID,
                              quantity: orderItem.quantity,
                              price: orderItem.price
                         })
                    })
               }

               navigateTo('/orders')

               toast({
                    title: `Updating payment value for ${customer.name}`,
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'pink'
               })

               const response3 = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer/').concat(customer._id), {
                    method: 'PUT',
                    headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                    },
                    body: JSON.stringify({
                         paymentValue: customer.paymentValue + totalPrice
                    })
               })

               for (let orderItem of pendingOrderItemList) {
                    const currentProduct = listOfProductName.find(product => product._id === orderItem.productID)
                    toast({
                         title: `Decreasing available slot for ${currentProduct.name}`,
                         variant: 'subtle',
                         status: 'info',
                         position: 'bottom-right',
                         colorScheme: 'pink'
                    })
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/').concat(currentProduct._id), {
                         method: 'PUT',
                         headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         },
                         body: JSON.stringify({
                              availableSlot: currentProduct.availableSlot - orderItem.quantity
                         })
                    })
               }
               
               toast({
                    title: 'Order has been created successfully...',
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'purple'
               })

               setTimeout(() => toast.closeAll(), 1000)
          }

     }

     useEffect(() => {
          fetchListOfCustomerName()
          fetchListOfProductName()
          localStorage.setItem('route', location.pathname)
     }, [])

     return (
          <Flex flexFlow='column' justify='space-between' height='100%'>
               <Box>
                    <Text textAlign='center' fontSize='24px' color='heading' fontWeight='bold' marginBottom='20px'>Creating new order</Text>

                    <Flex align='center' gap='5' justify='flex-start'>
                         <Text color='heading' fontSize='20' fontWeight='bold'>Customer</Text>
                         <Select onChange={(e) => handleCustomerChosen(e.target.options[e.target.selectedIndex].innerHTML)} focusBorderColor='secondary'>
                              <option selected disabled>Select customer name</option>
                              <option value='add-new-customer'>Add new customer</option>
                              {(listOfCustomerName?.map((customer, index) => <option key={index} value={index}>{customer.name}</option>))}
                         </Select>
                    </Flex>

                    {customerName && <Box>
                         <Flex gap='20px' marginY='20px'>
                              <Text width='50%' fontWeight='bold' color='heading' fontSize='125%'>Product</Text>
                              <Text width='20%' fontWeight='bold' color='heading' fontSize='125%'>Quantity</Text>
                              <Text width='20%' fontWeight='bold' color='heading' fontSize='125%'>Price</Text>
                              <Text width='40px' fontWeight='bold' color='heading' fontSize='125%'></Text>
                         </Flex>

                         {(pendingOrderItemList.map((orderItem, index) => <Flex gap='20px'  marginY='20px' marginBottom='20px' key={orderItem.counter}>
                              <Select onChange={(e) => handleProductAdded(index, e.target.options[e.target.selectedIndex].value, e)} focusBorderColor='secondary' width='50%'>
                                   <option selected disabled>Select product name</option>
                                   {(listOfProductName?.map((product, index) => <option key={index} value={product._id}>{product.name}</option>))}
                              </Select>

                              <Editable width='20%' defaultValue={1} >
                                   <EditablePreview />
                                   <EditableInput paddingX='3' onBlur={(e) => handleProductQuantityChanged(index, e.target.value)} />
                              </Editable>

                              <Text width='20%'>{convertToCurrency('VND', computePriceForSingleItem(index, orderItem.productID, orderItem.quantity))}</Text>

                              <IconButton icon={<DeleteIcon />} onClick={() => deleteItem(index)} bg='white' colorScheme='pink' variant='outline' borderRadius='full' />
                         </Flex>))}

                         <IconButton icon={<AddIcon />} onClick={addOrderItem} bg='white' colorScheme='pink' variant='outline' width='100%' marginY='30px' />
                         
                         <Flex justify='center' gap='30px' align='center'>
                              <Text fontSize='24px' color='heading' fontWeight='bold'>Total price</Text>
                              <Badge colorScheme='red' fontSize='125%' padding='10px 20px' borderRadius='full'>{convertToCurrency('VND', totalPrice)}</Badge>
                         </Flex>
                    </Box>}
               </Box>

               <Flex justify='center' gap='10' marginY='20px'>
                    <Button leftIcon={<IoCreateOutline />} variant='solid' colorScheme='pink' onClick={handleOrderCreation}>Submit</Button>
               </Flex>
          </Flex>
     )

}

export default OrderCreator