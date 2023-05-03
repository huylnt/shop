import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import { originOrderContext } from 'context/OrderContext'
import { originCustomerContext } from 'context/CustomerContext'
import { convertToCurrency, convertToLocaleDateString } from 'valueConverter'

import { Flex, Stack, Text, Tag, TagLabel, Divider, Button, Box, Badge, Menu, MenuButton, MenuList, MenuItem, TableContainer, Table, Thead, Tr, Th, Td, Tbody, useToast } from '@chakra-ui/react'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit2 } from 'react-icons/fi'
import { BsPersonFill, BsPersonGear } from 'react-icons/bs'
import { MdDateRange, MdOutlineDoneOutline } from 'react-icons/md'
import { ImNotification } from 'react-icons/im'

import OrderEditorDialog from 'Orders/OrderEditorDialog'

const SingleOrderDetails = () => {
  const orderContext = useContext(originOrderContext)
  const { orderItemList, fetchOrderItemList } = orderContext
  const customerContext = useContext(originCustomerContext)
  const { getCustomerFromID } = customerContext

  const { orderID } = useParams()
  const location = useLocation()

  const [order, setOrder] = useState()
  const [editionMode, setEditionMode] = useState()

  const navigateTo = useNavigate()
  const toast = useToast()

  const fetchOrder = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order/').concat(orderID), {
      headers: {
           'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      }
 })
    const content = await response.json()
    setOrder(content)
  }

  useEffect(() => {
    fetchOrder()
    fetchOrderItemList(orderID)
    localStorage.setItem('route', location.pathname)
  }, [editionMode])

  const handleDeletion = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order/').concat(orderID), { method: 'DELETE', headers: {
      'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
 } })

    if (!order.done) {
      for (let orderItem of orderItemList) {
        const response1 = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/').concat(orderItem.productID._id), {
          headers: {
               'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
          }
     })
        const currentProduct = await response1.json()

        toast({
          title: `Restoring slots for ${currentProduct.name}`,
          variant: 'subtle',
          status: 'info',
          position: 'bottom-right',
          colorScheme: 'pink'
        })

        const response2 = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/').concat(currentProduct._id), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
          },
          body: JSON.stringify({
            availableSlot: currentProduct.availableSlot + orderItem.quantity
          })
        })
      }

      const customer = await getCustomerFromID(order.customerID._id)

      toast({
        title: `Rolling back payment changes of ${customer.name}`,
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
          paymentValue: customer.paymentValue - order.totalPrice
        })
      })
    }


    toast({
      title: 'Order has been deleted successfully',
      variant: 'subtle',
      status: 'info',
      position: 'bottom-right',
      colorScheme: 'purple'
    })

    setTimeout(() => toast.closeAll(), 1000)

    navigateTo('/orders')
  }

  const handleEdition = (mode) => {
    if (mode === 'native') setEditionMode('native')
    else if (mode === 'foreign') setEditionMode('foreign')
  }

  return (
    <Flex flexFlow='column' justify='space-between' height='100%'>
      <Box>
        <Flex justify='space-between' align='center' marginY='30'>
          <Text color='heading' fontSize='20' fontWeight='bold'>Order {order?._id}</Text>
          {(order?.done) ? <Tag size='lg' colorScheme='green' borderRadius='full'>
            <MdOutlineDoneOutline />
            <TagLabel fontWeight='bold' fontSize='125%' padding='10px'>DONE</TagLabel>
          </Tag> : <Tag size='lg' colorScheme='red' borderRadius='full'>
            <ImNotification />
            <TagLabel fontWeight='bold' fontSize='125%' padding='10px'>NOT DONE YET</TagLabel>
          </Tag>}
        </Flex>

        <Flex align='center' gap='10' marginBottom='20px'>
          <Flex align='center' gap='5'>
            <BsPersonFill size='20px' />
            <Text color='heading' fontSize='18' fontWeight='bold'>Customer</Text>
          </Flex>
          {(order?.customerID?.name) ? <Text fontSize='16' onClick={() => navigateTo(`/customers/${order.customerID._id}`)}>{order?.customerID?.name}</Text> : <Text fontSize='16' fontStyle='italic'>This information had been deleted before</Text>}

        </Flex>

        <Flex align='center' gap='10' marginBottom='20px'>
          <Flex align='center' gap='5'>
            <BsPersonGear size='20px' />
            <Text color='heading' fontSize='18' fontWeight='bold'>Sale person</Text>
          </Flex>

          <Text fontSize='16'>{order?.salePersonID?.fullName}</Text>
        </Flex>

        <Flex align='center' gap='10' marginBottom='20px'>
          <Flex align='center' gap='5'>
            <MdDateRange size='20px' />
            <Text color='heading' fontSize='18' fontWeight='bold'>Date</Text>
          </Flex>

          <Text fontSize='16'>{convertToLocaleDateString(order?.updatedAt)}</Text>
        </Flex>

        <Divider bg='secondary' height='1' marginY='30' />

        <TableContainer>
          <Table variant='simple' colorScheme='pink' m='0'>
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th isNumeric>Quantity</Th>
                <Th isNumeric>Price</Th>
              </Tr>
            </Thead>

            <Tbody>
              {orderItemList?.map((orderItem, index) => <Tr _hover={{ background: 'white', cursor: 'pointer' }} key={index}>
                {(orderItem.productID?.name) ? <Td onClick={() => navigateTo(`/products/${orderItem.productID._id}`)}>{orderItem.productID.name}</Td> : <Td fontStyle='italic'>Deleted</Td>}
                <Td isNumeric>{orderItem.quantity}</Td>
                <Td isNumeric>{convertToCurrency('VND', orderItem.price)}</Td>
              </Tr>)
              }
            </Tbody>
          </Table>
        </TableContainer>

        <Flex justify='center' align='center' gap='80px' marginY='20px'>
          <Stack>
            <Text fontSize='24px' color='heading' fontWeight='bold' textAlign='center'>Revenue</Text>
            <Badge colorScheme='red' fontSize='125%' padding='10px 20px' borderRadius='full'>{convertToCurrency('VND', order?.totalPrice)}</Badge>
          </Stack>

          <Stack>
            <Text fontSize='24px' color='heading' fontWeight='bold' textAlign='center'>Profit</Text>
            <Badge colorScheme='green' fontSize='125%' padding='10px 20px' borderRadius='full'>{convertToCurrency('VND', order?.profit)}</Badge>
          </Stack>
        </Flex>
      </Box>

      <Flex justify='center' gap='10' marginY='20px'>
        <Button leftIcon={<AiOutlineDelete />} variant='solid' colorScheme='pink' onClick={handleDeletion}>Delete</Button>
        {(order?.done === false) ? <Menu>
          <MenuButton as={Button} leftIcon={<FiEdit2 />} bg='white' colorScheme='pink' variant='outline' padding='10px'>Edit</MenuButton>
          <MenuList dropShadow='2xl'>
            <MenuItem onClick={() => handleEdition('native')}>Native details</MenuItem>
            <MenuItem onClick={() => handleEdition('foreign')}>Product list</MenuItem>
          </MenuList>
        </Menu> : <Button leftIcon={<FiEdit2 />} variant='outline' colorScheme='pink' bg='white' opacity='20%' disabled>Edit</Button>}
      </Flex>

      {editionMode && <OrderEditorDialog originOrderID={order._id} mode={editionMode} setOpen={setEditionMode} />}
    </Flex>
  )
}

export default SingleOrderDetails