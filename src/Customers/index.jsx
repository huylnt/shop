import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router'

import { Flex, Stack, Center, Skeleton, Image, Text, Modal, ModalBody, ModalOverlay, ModalContent, ModalFooter, ModalHeader, Button } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'

import ControlPanel from 'component/ControlPanel'
import Paginator from 'component/Paginator'

import { originUserContext } from 'context/UserAuthenticationContext'
import { originCustomerContext } from 'context/CustomerContext'
import { convertToCurrency } from 'valueConverter'
import ContentLoader from 'component/ContentLoader'

const Customers = () => {
  const userContext = useContext(originUserContext)
  const { userID } = userContext

  const customerContext = useContext(originCustomerContext)
  const { customers, refreshCustomers, customerSearched, customerExist } = customerContext

  const toast = useToast()
  const navigateTo = useNavigate()

  useEffect(() => {
    refreshCustomers()
  }, [])

  return (
    <Flex flexFlow='column' justify='space-between' height='100%'>
      <ControlPanel context='CUSTOMER' />

      {(!customerExist) && <Center marginBottom='120px'>
        <Stack>
          <Image src='./illustration_empty_initially.png' boxSize='300' objectFit='cover' />
          <Text textAlign='center'>No customer has been added.</Text>
        </Stack>
      </Center>}

      {(customerExist && customerSearched && customers?.length < 1) ? <Center height='100%'>
        <Stack>
          <Image src='./illustration_not_found.png' boxSize='300' objectFit='cover' />
          <Text textAlign='center'>There is no result matching your search.</Text>
        </Stack>
      </Center> : <TableContainer height='365px' overflowY='scroll' m='0'>

        {(!customerSearched && customers?.length < 1) &&
          <Stack marginTop='30px'>
            <ContentLoader />
          </Stack>
        }

        {(customers?.length > 0) &&
          <Table variant='simple' colorScheme='pink' m='0'>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th isNumeric>Payment value</Th>
              </Tr>
            </Thead>

            <Tbody>
              {customers?.map((customer, index) => <Tr _hover={{ background: 'white', cursor: 'pointer' }} onClick={() => navigateTo(`/customers/${customer['_id']}`)} key={index}>
                <Td>{customer.name}</Td>
                <Td>{customer.phoneNumber}</Td>
                <Td isNumeric>{convertToCurrency('VND', customer.paymentValue)}</Td>
              </Tr>)}
            </Tbody>

          </Table>
        }
      </TableContainer>
      }



      {(customers?.length > 0) && <Paginator context='CUSTOMER' />}
    </Flex>
  )
}

export default Customers