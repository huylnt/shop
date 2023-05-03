import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import randomString from 'random-string'
import { originOrderContext } from 'context/OrderContext'
import { originProductContext } from 'context/ProductContext'
import { originCustomerContext } from 'context/CustomerContext'
import { convertToCurrency } from 'valueConverter'

import { useToast } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, IconButton, Button, Flex, Select, Text, Editable, EditablePreview, EditableInput, Input, Box, Badge } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

const OrderEditorDialog = ({ originOrderID, mode, setOpen }) => {
     const orderContext = useContext(originOrderContext)
     const { orderItemList } = orderContext
     const productContext = useContext(originProductContext)
     const { listOfProductName, fetchListOfProductName } = productContext
     const customerContext = useContext(originCustomerContext)
     const { getCustomerFromID } = customerContext

     const navigateTo = useNavigate()
     const toast = useToast()

     const [order, setOrder] = useState()
     const [done, setDone] = useState()
     const [pendingOrderItemList, setPendingOrderItemList] = useState([])

     const [totalPrice, setTotalPrice] = useState(0)

     const [refresher, setRefresher] = useState(0)

     const addNewRow = () => {
          setPendingOrderItemList(previous => [...previous, {
               _id: randomString({ length: 10 }),
               productID: undefined,
               productName: undefined,
               quantity: 1,
               price: undefined,
          }])
     }

     const handleOrderUpdated = async () => {
          toast({
               title: 'Updating order...',
               variant: 'subtle',
               status: 'info',
               position: 'bottom-right',
               colorScheme: 'pink'
          })

          if (mode === 'native') {
               const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order/').concat(originOrderID), {
                    method: 'PUT',
                    headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                    },
                    body: JSON.stringify({
                         done
                    })
               })
          }

          else if (mode === 'foreign') {
               pendingOrderItemList.forEach(orderItem => {
                    if (!orderItem.productID) {
                         toast({
                              title: 'There is empty row(s)...',
                              variant: 'subtle',
                              status: 'info',
                              position: 'bottom-right',
                              colorScheme: 'orange'
                         })
                         return
                    }
               })

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

               for (const orderItem of pendingOrderItemList) {
                    if (orderItem._id.length !== 10) {
                         const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order/').concat(orderItem._id).concat('/ItemList'), {
                              method: 'PUT',
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

                    else if (orderItem._id.length === 10) {
                         const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order/').concat(originOrderID).concat('/ItemList'), {
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
               }

               let profit = 0
               let totalItem = 0
               for (let orderItem of pendingOrderItemList) {
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/').concat(orderItem.productID), {
                         headers: {
                              'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                         }
                    })
                    const { originalPrice, actualPrice } = await response.json()
                    profit += (actualPrice - originalPrice) * orderItem.quantity
                    totalItem += orderItem.quantity
               }

               const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order/').concat(order._id), {
                    method: 'PUT',
                    headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                    },
                    body: JSON.stringify({
                         totalPrice,
                         profit,
                         totalItem
                    })
               })

               toast({
                    title: `Updating payment value for this customer`,
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'pink'
               })

               const customer = await getCustomerFromID(order.customerID._id)
               const response3 = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer/').concat(customer._id), {
                    method: 'PUT',
                    headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
                    },
                    body: JSON.stringify({
                         paymentValue: customer.paymentValue - order.totalPrice + totalPrice
                    })
               })

               for (let i = 0; i < pendingOrderItemList.length; i++) {
                    const orderItem = pendingOrderItemList[i]
                    const currentProduct = listOfProductName.find(product => product._id === orderItem.productID)
                    toast({
                         title: `Altering available slot for ${currentProduct.name}`,
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
                              availableSlot: (i < orderItemList.length) ? currentProduct.availableSlot + orderItemList[i].quantity - orderItem.quantity : currentProduct.availableSlot - orderItem.quantity
                         })
                    })
               }
               
               toast({
                    title: 'Order has been altered successfully...',
                    variant: 'subtle',
                    status: 'info',
                    position: 'bottom-right',
                    colorScheme: 'purple'
               })

               setTimeout(() => toast.closeAll(), 1000)
          }

          navigateTo('/orders')
     }

     const handleProductNameChanged = (orderItemIndex, productID, event) => {
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
          const currentProduct = listOfProductName.find(product => product._id === productID)
          if (currentProduct) {
               const price = currentProduct.actualPrice * pendingOrderItemList[orderItemIndex].quantity
               pendingOrderItemList[orderItemIndex].price = price
               setRefresher(prev => prev + 1)
          }
     }

     const handleProductQuantityChanged = (orderItemIndex, newQuantity) => {
          pendingOrderItemList[orderItemIndex].quantity = newQuantity
          const currentProduct = listOfProductName.find(product => product._id === pendingOrderItemList[orderItemIndex].productID)
          if (currentProduct) {
               const price = currentProduct.actualPrice * newQuantity
               pendingOrderItemList[orderItemIndex].price = price
               setRefresher(prev => prev + 1)
          }
     }

     const fetchOrder = async () => {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order/').concat(originOrderID), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()
          setOrder(content)
     }

     useEffect(() => {
          if (pendingOrderItemList.length === 0) {
               fetchListOfProductName()

               const tempOrderItemList = []
               orderItemList.forEach(orderItem => {
                    tempOrderItemList.push({
                         _id: orderItem._id,
                         productID: orderItem.productID._id,
                         productName: orderItem.productID.name,
                         quantity: orderItem.quantity,
                         price: orderItem.price,
    
                    })
               })
               setPendingOrderItemList(tempOrderItemList)
     
               fetchOrder()
          }

          else {
               let tempTotalPrice = 0
               pendingOrderItemList.forEach(orderItem => tempTotalPrice += orderItem.price)
               setTotalPrice(tempTotalPrice)
          }
     }, [refresher])

     return (
          <>
               <Modal size='xl' isOpen={true} onClose={() => setOpen(null)}>
                    <ModalOverlay />
                    <ModalContent>
                         <ModalHeader>Edit order {(mode === 'native') ? 'details' : 'item list'}</ModalHeader>
                         <ModalBody>
                              {(mode === 'native') &&
                                   <Flex align='center' gap='20px'>
                                        <Text width='100px'>Is it done?</Text>
                                        <Select flexGrow={1} onChange={(e) => {
                                             if (e.target.selectedIndex === 1) setDone(true)
                                             else if (e.target.selectedIndex === 2) setDone(false)
                                        }}>
                                             <option disabled selected value>Select an option</option>
                                             <option value='true'>Yes</option>
                                             <option value='false'>Not yet</option>
                                        </Select>
                                   </Flex>
                              }

                              {(mode === 'foreign') &&
                                   <Box>
                                        {pendingOrderItemList?.map((orderItem, index) => <Flex gap='20px' marginBottom='10px' key={orderItem._id}>
                                             <Select onChange={(e) => handleProductNameChanged(index, e.target.options[e.target.selectedIndex].value, e)}>
                                                  {(!orderItem.productID) ? <option selected disabled>Select an option</option> : <option disabled>Select an option</option>}
                                                  {(listOfProductName?.map((product, index) => (product.name === orderItem?.productName) ? <option key={index} value={product._id} selected>{product.name}</option> : <option key={index} value={product._id}>{product.name}</option>))}
                                             </Select>
                                             
                                             <Editable flexGrow='1' defaultValue={orderItem?.quantity || 1} width='200px'>
                                                  <EditablePreview />
                                                  <EditableInput paddingX='3' onBlur={(e) => handleProductQuantityChanged(index, e.target.value)} />
                                             </Editable>

                                             <Text width='20%'>{convertToCurrency('VND', orderItem.price)}</Text>
                                        </Flex>
                                        )}

                                        <IconButton icon={<AddIcon />} onClick={addNewRow} colorScheme='pink' variant='outline' width='100%' />

                                        <Flex justify='right' gap='20px' align='center' marginTop='20px'>
                                             <Text color='heading' fontWeight='bold'>Total price</Text>
                                             <Badge colorScheme='red' padding='10px 20px' borderRadius='full'>{(totalPrice === 0) ? convertToCurrency('VND',order?.totalPrice) : convertToCurrency('VND',totalPrice)}</Badge>
                                        </Flex>
                                   </Box>
                              }
                         </ModalBody>

                         <ModalFooter>
                              <Button variant='solid' colorScheme='pink' marginRight='10px' onClick={handleOrderUpdated}>Confirm</Button>
                              <Button variant='outline' colorScheme='pink' mr={3} onClick={() => setOpen(null)}>Close</Button>
                         </ModalFooter>
                    </ModalContent>
               </Modal>
          </>
     )
}

export default OrderEditorDialog