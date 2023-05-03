import { originUserContext } from 'context/UserAuthenticationContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router'
import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

import { Flex, Container, VStack, Image, Text, Box, Icon, Avatar, Button } from '@chakra-ui/react'
import { MdOutlineProductionQuantityLimits, MdOutlineDashboard } from 'react-icons/md'
import { RiBillLine } from 'react-icons/ri'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { BsPeople } from 'react-icons/bs'

const SidePanel = () => {
  const userAuthenticationContext = useContext(originUserContext)
  const { userFullName, avatarPath, setUserID, setJustLogInInASecond } = userAuthenticationContext
  const navigateTo = useNavigate()

  const handleUserLogOut = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/AdminAccount/CacheInvalidation'), {
      headers: {
        'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      }
    })
    
    setUserID('')
    setJustLogInInASecond(false)
    localStorage.setItem('account', '')
    navigateTo('/login')
  }

  const handleRouteChanged = async (path) => {
    localStorage.setItem('route', path)
  }

  return (
    <Flex width='100vw' height='100vh'>
      <Container flexGrow='2' maxW='300px' position='relative'>
        <Flex justifyContent='left' align='center' gap='15px' my='30px'>
          <Image src='./icon.png' alt='App icon' w='75px' />
          <Text fontFamily='Alkatra'>My Shop</Text>
        </Flex>

        <NavLink to='/dashboard' className={({ isActive }) => (isActive ? 'path-active' : 'path')} onClick={() => handleRouteChanged('/dashboard')}>
          <Flex justifyContent='left' align='center' gap='15px' padding='10px' my='10px' rounded='12px'>
            <Icon as={MdOutlineDashboard} boxSize='10' />
            <Text>Dashboard</Text>
          </Flex>
        </NavLink>

        <NavLink to='/products' className={({ isActive }) => (isActive ? 'path-active' : 'path')} onClick={() => handleRouteChanged('/products')}>
          <Flex justifyContent='left' align='center' gap='15px' padding='10px' my='10px' rounded='12px'>
            <Icon as={MdOutlineProductionQuantityLimits} boxSize='10' />
            <Text>Products</Text>
          </Flex>
        </NavLink>

        <NavLink to='/orders' className={({ isActive }) => (isActive ? 'path-active' : 'path')} onClick={() => handleRouteChanged('/orders')}>
          <Flex justifyContent='left' align='center' gap='15px' padding='10px' my='10px' rounded='12px'>
            <Icon as={RiBillLine} boxSize='10' />
            <Text>Orders</Text>
          </Flex>
        </NavLink>

        <NavLink to='/finance-report' className={({ isActive }) => (isActive ? 'path-active' : 'path')} onClick={() => handleRouteChanged('/finance-report')}>
          <Flex justifyContent='left' align='center' gap='15px' padding='10px' my='10px' rounded='12px'>
            <Icon as={HiOutlineDocumentReport} boxSize='10' />
            <Text>Finance report</Text>
          </Flex>
        </NavLink>

        <NavLink to='/customers' className={({ isActive }) => (isActive ? 'path-active' : 'path')} onClick={() => handleRouteChanged('/customers')}>
          <Flex justifyContent='left' align='center' gap='15px' padding='10px' my='10px' rounded='12px'>
            <Icon as={BsPeople} boxSize='10' />
            <Text>Customers</Text>
          </Flex>
        </NavLink>

        <Flex flexFlow='column' position='absolute' bottom='30' m='0' w='90%'>
          <Flex justify='left' align='center' gap='15px'>
            <Avatar src={avatarPath} />
            <Text fontFamily='Alkatra'>{userFullName}</Text>
          </Flex>

          <Button onClick={handleUserLogOut} outlineColor='secondary' variant='outline' w='100%' mt='15px' padding='0' _hover={{ bg: 'accent', color: 'white' }}>Sign out</Button>
        </Flex>

      </Container>

      <Box bg='background' flexGrow='8' rounded='20px' m='20px' p='15px' overflowY='scroll'>
        <Outlet />
      </Box>
    </Flex>
  )
}
export default SidePanel