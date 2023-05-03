import React, { useState, createContext, useContext } from 'react'
import { originUserContext } from './UserAuthenticationContext'
const originOrderContext = createContext()

const OrderContext = ({ children }) => {
     const userContext = useContext(originUserContext)
     const { userID } = userContext

     const [orders, setGlobalOrders] = useState([])
     const [orderItemList, setOrderItemList] = useState()
     const [orderTotalPage, setOrderTotalPage] = useState(-1)
     const [orderCurrentPage, setOrderCurrentPage] = useState(1)
     const [orderPaginatingNumber, setOrderPaginatingNumber] = useState()
     const [orderSearched, setOrderSearched] = useState(false)
     const [orderExist, setOrderExist] = useState(true)

     const refreshOrders = async () => {
          const paginatingNumberResponse = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/PaginatingNumber/').concat(userID).concat('?key=order'), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const paginatingNumberContent = await paginatingNumberResponse.json()
          setOrderPaginatingNumber(paginatingNumberContent.size)
          let localPaginatingNumber = paginatingNumberContent.size

          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order').concat('?page=').concat(1).concat('&size=').concat(localPaginatingNumber), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()

          if (content.result.length < 1) {
               setOrderExist(false)
          }
          else {
               setOrderExist(true)
               setOrderSearched(false)
               setGlobalOrders(content.result)
               setOrderCurrentPage(content.countInfo.currentPage)
               setOrderTotalPage(content.countInfo.totalPages)
          }
     }

     const fetchOrderItemList = async (orderID) => {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Order/').concat(orderID).concat('/ItemList'), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()

          setOrderItemList(content.result)
     }

     return (
          <originOrderContext.Provider value={{ orders, setGlobalOrders, orderCurrentPage, setOrderCurrentPage, orderTotalPage, setOrderTotalPage, orderPaginatingNumber, setOrderPaginatingNumber, orderSearched, setOrderSearched, refreshOrders, orderItemList, fetchOrderItemList, orderExist }}>
               {children}
          </originOrderContext.Provider>
     )
}

export { originOrderContext, OrderContext }