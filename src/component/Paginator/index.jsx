import { Center, Flex, IconButton } from '@chakra-ui/react'
import { BsSkipBackward, BsSkipForward } from 'react-icons/bs'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { useToast } from '@chakra-ui/react'

import { useContext, useEffect, useState } from 'react'

import { originProductContext } from 'context/ProductContext'
import { originCategoryContext } from 'context/CategoryContext'
import { originCustomerContext } from 'context/CustomerContext'
import { originOrderContext } from 'context/OrderContext'

const Paginator = ({ context }) => {
  const productContext = useContext(originProductContext)
  const { products, setGlobalProducts, productTotalPage, setProductTotalPage, productCurrentPage, setProductCurrentPage, productPaginatingNumber, setProductPaginatingNumber, productSearched, setProductSearched, refreshProducts } = productContext
  const categoryContext = useContext(originCategoryContext)
  const { categories, setGlobalCategories, categoryTotalPage, setCategoryTotalPage, categoryCurrentPage, setCategoryCurrentPage, categoryPaginatingNumber, setCategoryPaginatingNumber, categorySearched, setCategorySearched, refreshCategories } = categoryContext
  const customerContext = useContext(originCustomerContext)
  const { customers, setGlobalCustomers, customerTotalPage, setCustomerTotalPage, customerCurrentPage, setCustomerCurrentPage, customerPaginatingNumber, setCustomerPaginatingNumber, customerSearched, setCustomerSearched, refreshCustomers } = customerContext
  const orderContext = useContext(originOrderContext)
  const { orders, setGlobalOrders, orderCurrentPage, setOrderCurrentPage, orderTotalPage, setOrderTotalPage, orderPaginatingNumber, setOrderPaginatingNumber, orderSearched, setOrderSearched, refreshOrders } = orderContext

  const [paginatingNumber, setPaginatingNumber] = useState()
  const [currentPage, setCurrentPage] = useState()
  const [totalPage, setTotalPage] = useState()

  const toast = useToast()

  const goToFirstPage = async () => {
    let firstPage = 1
    if (context === 'PRODUCT') {
      toast({
        title: 'Going to first page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('?page=').concat(firstPage).concat('&size=').concat(paginatingNumber), {
        headers: {
          'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
      })
      const content = await response.json()
      setProductCurrentPage(content.countInfo.currentPage)
      setGlobalProducts(content.result)
    }

    else if (context === 'CATEGORY') {
      toast({
        title: 'Going to first page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category').concat('?page=').concat(firstPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()
      setCategoryCurrentPage(content.countInfo.currentPage)
      setGlobalCategories(content.result)
    }

    else if (context === 'CUSTOMER') {
      toast({
        title: 'Going to first page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer').concat('?page=').concat(firstPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()
      setCustomerCurrentPage(content.countInfo.currentPage)
      setGlobalCustomers(content.result)
    }

    else if (context === 'ORDER') {
      toast({
        title: 'Going to first page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order').concat('?page=').concat(firstPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()
      setOrderCurrentPage(content.countInfo.currentPage)
      setGlobalOrders(content.result)
    }

    toast.closeAll()
  }

  const goToPreviousPage = async () => {
    if (context === 'PRODUCT') {
      if (currentPage === 1) return

      toast({
        title: 'Going to previous page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      let previousPage = currentPage - 1;
      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('?page=').concat(previousPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()

      setProductCurrentPage(content.countInfo.currentPage)
      setGlobalProducts(content.result)
    }

    else if (context === 'CATEGORY') {
      if (currentPage === 1) return

      toast({
        title: 'Going to previous page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      let previousPage = currentPage - 1;
      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category').concat('?page=').concat(previousPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()

      setCategoryCurrentPage(content.countInfo.currentPage)
      setGlobalCategories(content.result)
    }

    else if (context === 'CUSTOMER') {
      if (currentPage === 1) return

      toast({
        title: 'Going to previous page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      let previousPage = currentPage - 1;
      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer').concat('?page=').concat(previousPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()

      setCustomerCurrentPage(content.countInfo.currentPage)
      setGlobalCustomers(content.result)
    }

    else if (context === 'ORDER') {
      if (currentPage === 1) return

      toast({
        title: 'Going to previous page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      let previousPage = currentPage - 1;
      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order').concat('?page=').concat(previousPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()

      setOrderCurrentPage(content.countInfo.currentPage)
      setGlobalOrders(content.result)
    }

    toast.closeAll()
  }

  const goToNextPage = async () => {
    if (context === 'PRODUCT') {
      if (currentPage === totalPage) return

      toast({
        title: 'Going to next page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      let nextPage = currentPage + 1;
      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('?page=').concat(nextPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()

      setProductCurrentPage(content.countInfo.currentPage)
      setProductTotalPage(content.countInfo.totalPages)
      setGlobalProducts(content.result)
    }

    else if (context === 'CATEGORY') {
      if (currentPage === totalPage) return

      toast({
        title: 'Going to next page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      let nextPage = currentPage + 1;
      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category').concat('?page=').concat(nextPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()

      setCategoryCurrentPage(content.countInfo.currentPage)
      setGlobalCategories(content.result)
    }

    else if (context === 'CUSTOMER') {
      if (currentPage === totalPage) return

      toast({
        title: 'Going to next page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      let nextPage = currentPage + 1;
      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer').concat('?page=').concat(nextPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()

      setCustomerCurrentPage(content.countInfo.currentPage)
      setGlobalCustomers(content.result)
    }

    else if (context === 'ORDER') {
      if (currentPage === totalPage) return

      toast({
        title: 'Going to next page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      let nextPage = currentPage + 1;
      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order').concat('?page=').concat(nextPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()

      setOrderCurrentPage(content.countInfo.currentPage)
      setGlobalOrders(content.result)
    }

    toast.closeAll()
  }

  const goToLastPage = async () => {
    let lastPage = totalPage

    if (context === 'PRODUCT') {
      toast({
        title: 'Going to last page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('?page=').concat(lastPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()
      setProductCurrentPage(content.countInfo.currentPage)
      setGlobalProducts(content.result)
    }

    else if (context === 'CATEGORY') {
      toast({
        title: 'Going to last page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category').concat('?page=').concat(lastPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()
      setCategoryCurrentPage(content.countInfo.currentPage)
      setGlobalCategories(content.result)
    }

    else if (context === 'CUSTOMER') {
      toast({
        title: 'Going to last page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer').concat('?page=').concat(lastPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()
      setCustomerCurrentPage(content.countInfo.currentPage)
      setGlobalCustomers(content.result)
    }

    else if (context === 'ORDER') {
      toast({
        title: 'Going to last page...',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order').concat('?page=').concat(lastPage).concat('&size=').concat(paginatingNumber), {
        headers: {
             'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        }
   })
      const content = await response.json()
      setOrderCurrentPage(content.countInfo.currentPage)
      setGlobalOrders(content.result)
    }

    toast.closeAll()
  }

  useEffect(() => {
    if (context === 'PRODUCT') {
      setCurrentPage(productCurrentPage)
      setTotalPage(productTotalPage)
      setPaginatingNumber(productPaginatingNumber)
    }

    else if (context === 'CATEGORY') {
      setCurrentPage(categoryCurrentPage)
      setTotalPage(categoryTotalPage)
      setPaginatingNumber(categoryPaginatingNumber)
    }

    else if (context === 'CUSTOMER') {
      setCurrentPage(customerCurrentPage)
      setTotalPage(customerTotalPage)
      setPaginatingNumber(customerPaginatingNumber)
    }

    else if (context === 'ORDER') {
      setCurrentPage(orderCurrentPage)
      setTotalPage(orderTotalPage)
      setPaginatingNumber(orderPaginatingNumber)
    }
  }, [productCurrentPage, productTotalPage, categoryTotalPage, categoryCurrentPage, customerCurrentPage, customerTotalPage, orderCurrentPage, orderTotalPage])

  return (
    <Center marginTop='110px'>
      <Flex alignItems='center' marginTop='25px' gap='30px'>
        <IconButton aria-label='Go to first page' icon={<BsSkipBackward />} opacity={(currentPage === 1) ? '10%' : '100%'} rounded='50%' size='lg' onClick={goToFirstPage} />
        <IconButton aria-label='Go to previous page' icon={<IoIosArrowBack />} opacity={(currentPage === 1) ? '10%' : '100%'} rounded='50%' size='lg' onClick={goToPreviousPage} />
        <div>{`${currentPage}/${totalPage}`}</div>
        <IconButton aria-label='Go to next page' icon={<IoIosArrowForward />} opacity={(currentPage === totalPage) ? '10%' : '100%'} rounded='50%' size='lg' onClick={goToNextPage} />
        <IconButton aria-label='Go to last page' icon={<BsSkipForward />} opacity={(currentPage === totalPage) ? '10%' : '100%'} rounded='50%' size='lg' onClick={goToLastPage} />
      </Flex>
    </Center>
  )
}

export default Paginator