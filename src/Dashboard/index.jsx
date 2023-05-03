import { useState, useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flex, Box, Text, Stack, Image, VStack, Badge } from '@chakra-ui/react'
import { convertToCurrency, getWeekStartDateAndEndDate } from 'valueConverter'
import { PhoneIcon } from '@chakra-ui/icons'

const DiscontinuedProduct = ({ id, illustrationPath, name, availableSlot, price }) => {
  const navigateTo = useNavigate()
  return <Flex flexShrink='0' width='300px' boxShadow='2xl' bg='primary' borderRadius='3xl' gap='20px' padding='20px' align='center' onClick={() => navigateTo(`/products/${id}`)} as='Button' _hover={{filter: 'contrast(150%)'}}>
    <Image src={illustrationPath} height='100px' width='150px' objectFit='cover' borderRadius='full' />
    <Flex flexFlow='column' justify='space-around' gap='10px' align='flex-start'>
      <Text color='heading' fontWeight='bold' textAlign='left'>{name}</Text>
      <Text color='normal'>{convertToCurrency('VND', price)}</Text>
      <Badge colorScheme='red' borderRadius='full' padding='5px'>{availableSlot} remaining slots</Badge>
    </Flex>
  </Flex>
}

const Overview = ({ index, title, number }) => {
  return <Flex gap='50px' bg={`linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(background_dashboard_item_${index}.jpg)`} bgSize='cover' boxShadow='dark-lg' borderRadius='2xl' padding='50px' _hover={{filter: 'brightness(180%)'}}>
    <Text color='white' fontWeight='bold' fontSize='125%'>{title}</Text>
    <Text color='white' fontWeight='bold' fontSize='150%'>{number}</Text>
  </Flex>
}

const VIPCustomer = ({ id, rank, name, phone, paymentValue }) => {
  const navigateTo = useNavigate()

  let bg
  switch (rank) {
    case 0:
      bg = 'linear-gradient(150deg, rgba(140,231,125,1) 0%, rgba(22,83,34,1) 100%)'
      break
    case 1:
      bg = 'linear-gradient(150deg, #aebddf 0%, #1f3f8b 100%)'
      break
    case 2:
      bg = 'linear-gradient(150deg, rgba(231,155,125,1) 0%, rgba(83,40,22,1) 100%)'
      break
    default:
      bg = 'white'
      break
  }

  return <Flex flexShrink='0' flexFlow='column' minWidth='250px' gap='10px' bg={bg} boxShadow='2xl' padding='20px' borderRadius='2xl' onClick={() => navigateTo(`/customers/${id}`)} as='Button' _hover={{filter: 'contrast(150%)'}}>
    <Text fontWeight='bold' color={(rank < 3) ? 'white' : 'heading'}>{name}</Text>
    <Flex flexFlow='row' gap='20px'>
      <PhoneIcon boxSize='20px' color={(rank < 3) ? 'white' : 'black'} />
      <Text color={(rank < 3) ? 'white' : 'black'}>{phone}</Text>
    </Flex>
    <Badge bg={(rank < 3) ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.5)'} color='white' padding='5px' borderRadius='2xl' width='100%' textAlign='center'>{convertToCurrency('VND', paymentValue)}</Badge>
  </Flex>
}

const Dashboard = () => {
  const [discontinuedProducts, setDiscontinuedProducts] = useState([])
  const [totalProductsNumber, setTotalProductsNumber] = useState(0)
  const [newWeeklyOrdersNumber, setNewWeeklyOrdersNumber] = useState(0)
  const [VIPCustomers, setVIPCustomers] = useState([])

  const fetchDiscontinuedProducts = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('/AvailableSlot').concat('?value=5'), {
      headers: {
           'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      }
 })
    const content = await response.json()
    setDiscontinuedProducts(content)
  }

  const getTotalProductsNumber = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('/Total'), {
      headers: {
           'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      }
 })
    const content = await response.json()
    setTotalProductsNumber(content[0].total)
  }

  const getNewWeeklyOrdersNumber = async () => {
    const currentWeek = getWeekStartDateAndEndDate()
    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order').concat('/New'), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      },
      body: JSON.stringify(currentWeek)
    })
    const content = await response.json()
    setNewWeeklyOrdersNumber(content[0].number)
  }

  const fetchVIPCustomers = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer').concat('/PaymentValue').concat('?value=10'), {
      headers: {
           'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      }
 })
    const content = await response.json()
    setVIPCustomers(content)
  }

  useEffect(() => {
    fetchDiscontinuedProducts()
    getTotalProductsNumber()
    getNewWeeklyOrdersNumber()
    fetchVIPCustomers()
  }, [])

  return (
    <>
      <Flex flexFlow='column' justify='space-around' gap='50px'>
        <Box>
          <Text color='heading' fontWeight='bold' fontSize='125%'>Top 5 products to be discontinued</Text>
          <Flex flexFlow='row' gap='50px' width='100%' flexWrap='nowrap' overflowX='auto' padding=' 20px 10px 15px 10px' justify='flex-start'>
            {(discontinuedProducts?.length > 0) ? discontinuedProducts.map(product => <DiscontinuedProduct id={product._id} illustrationPath={product?.illustrations[0]?.illustrationPath || 'https://th.bing.com/th/id/OIP.DfsGWUClWpJOP8827aNaQQHaEo?pid=ImgDet&rs=1'} name={product.name} availableSlot={product.availableSlot} price={product.actualPrice} />) : <Text>There is no approriate result.</Text>}
          </Flex>
        </Box>

        <Flex width='100%' gap='50px' justify='flex-start' paddingLeft='10px'>
          <Overview index='1' title='Total number of products' number={totalProductsNumber} />
          <Overview index='2' title='New orders in this week' number={newWeeklyOrdersNumber} />
        </Flex>

        <Box>
          <Text color='heading' fontWeight='bold' fontSize='125%'>VIP Customers</Text>
          <Flex flexFlow='row' gap='50px' width='100%' flexWrap='nowrap' overflowX='auto' padding=' 20px 10px 15px 10px' justify='flex-start'>
            {(VIPCustomers?.length > 0) ? VIPCustomers.map((customer, index) => <VIPCustomer id={customer._id} rank={index} name={customer.name} phone={customer.phoneNumber} paymentValue={customer.paymentValue} />) : <Text>There is no approriate result.</Text>}
          </Flex>
        </Box>
      </Flex>
    </>

  )
}

export default Dashboard