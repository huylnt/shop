import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import { originCustomerContext } from 'context/CustomerContext'
import { convertToCurrency } from 'valueConverter'

import { Flex, Text, Center, Divider, Button, useToast, Box } from '@chakra-ui/react'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit2 } from 'react-icons/fi'
import { GoLocation } from 'react-icons/go'
import { BsTelephone } from 'react-icons/bs'

import CustomerEditorDialog from 'Customers/CustomerEditorDialog'

const SingleCustomerDetails = () => {
  const customerContext = useContext(originCustomerContext)
  const { customers, refreshCustomers } = customerContext

  const { customerID } = useParams()
  const location = useLocation()

  const [customer, setCustomer] = useState()
  const [detailDialogOpened, setDetailDialogOpened] = useState(false)

  const toast = useToast()
  const navigateTo = useNavigate()

  const fetchCustomer = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer/').concat(customerID), {
      headers: {
        'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      }
    })
    const content = await response.json()
    setCustomer(content)
  }

  useEffect(() => {
    fetchCustomer()
    localStorage.setItem('route', location.pathname)
  }, [])

  const handleDeletion = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer/').concat(customerID), {
      method: 'DELETE',
      headers: {
        'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      }
    })
    toast({
      title: 'Customer has been removed successfully',
      variant: 'subtle',
      status: 'info',
      position: 'bottom-right',
      colorScheme: 'purple'
    })
    navigateTo(-1)
  }

  const handleEdition = async () => {
    setDetailDialogOpened(true)
  }

  return (
    <Flex flexFlow='column' justify='space-between' height='100%'>
      <Box>
        <Flex justify='space-between' align='center' marginY='30'>
          <Text color='heading' fontSize='20' fontWeight='bold'>{customer?.name}</Text>
          <Text color='heading' fontSize='20' fontWeight='bold'>{convertToCurrency('VND', customer?.paymentValue)}</Text>
        </Flex>

        <Flex align='center' gap='10' marginBottom='20px'>
          <Flex align='center' gap='5'>
            <BsTelephone size='20px' />
            <Text color='heading' fontSize='18' fontWeight='bold'>Phone number</Text>
          </Flex>

          <Text fontSize='16'>{customer?.phoneNumber}</Text>
        </Flex>

        <Flex align='center' gap='10'>
          <Flex align='center' gap='5'>
            <GoLocation size='20px' />
            <Text color='heading' fontSize='18' fontWeight='bold'>Address</Text>
          </Flex>

          <Text fontSize='16'>{customer?.address}</Text>
        </Flex>

      </Box>

      <Flex justify='center' gap='10' marginY='20px'>
        <Button leftIcon={<AiOutlineDelete />} variant='solid' colorScheme='pink' onClick={handleDeletion}>Delete</Button>
        <Button leftIcon={<FiEdit2 />} variant='outline' colorScheme='pink' bg='white' onClick={handleEdition}>Edit</Button>
      </Flex>

      {detailDialogOpened && <CustomerEditorDialog customer={customer} setOpen={setDetailDialogOpened} />}
    </Flex>
  )
}

export default SingleCustomerDetails