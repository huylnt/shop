import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router'

import { Flex, Stack, Center, Skeleton, Image, Text, Badge } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react'

import ControlPanel from 'component/ControlPanel'
import Paginator from 'component/Paginator'
import ContentLoader from 'component/ContentLoader'

import { originUserContext } from 'context/UserAuthenticationContext'
import { originOrderContext } from 'context/OrderContext'

import { convertToLocaleDateString } from 'valueConverter'


const Orders = () => {
  const userContext = useContext(originUserContext)
  const { userID } = userContext

  const orderContext = useContext(originOrderContext)
  const { orders, orderSearched, refreshOrders, orderExist } = orderContext

  const navigateTo = useNavigate()

  useEffect(() => {
    refreshOrders()
  }, [])

  return (
    <Flex flexFlow='column' justify='space-between' height='100%'>
      <ControlPanel context='ORDER' />

      {(!orderExist) && <Center marginBottom='120px'>
        <Stack>
          <Image src='./illustration_empty_initially.png' boxSize='300' objectFit='cover' />
          <Text textAlign='center'>No order has been created.</Text>
        </Stack>
      </Center>}

      {(orderExist) && <TableContainer height='365px' overflowY='scroll' m='0'>

        {(!orderSearched && orders?.length < 1) &&
          <Stack marginTop='30px'>
            <ContentLoader />
          </Stack>
        }

        {(orderSearched && orders?.length < 1) && <Center>
          <Stack>
            <Image src='./illustration_not_found.png' boxSize='300' objectFit='cover' />
            <Text textAlign='center'>There is no result matching your search.</Text>
          </Stack>
        </Center>
        }

        {(orders?.length > 0) &&
          <Table variant='simple' colorScheme='pink' m='0'>
            <Thead>
              <Tr>
                <Th>Customer</Th>
                <Th>Sale person</Th>
                <Th isNumeric>Date</Th>
                <Th>Progress</Th>
              </Tr>
            </Thead>

            <Tbody>
              {orders?.map((order, index) => <Tr _hover={{ background: 'white', cursor: 'pointer' }} onClick={() => navigateTo(`/orders/${order._id}`)} key={index}>
                <Td>{order.customerID?.name}</Td>
                <Td>{order.salePersonID.fullName}</Td>
                <Td isNumeric>{convertToLocaleDateString(order.updatedAt)}</Td>
                <Td>
                  {(order.done) ? <Badge colorScheme='green'>DONE</Badge> : <Badge colorScheme='yellow'>NOT DONE</Badge>}
                </Td>

              </Tr>)}
            </Tbody>

          </Table>
        }
      </TableContainer>}


      {(orderExist && orders?.length > 0) && <Paginator context='ORDER' />}
    </Flex>
  )
}

export default Orders