import React, { useState, createContext, useContext } from 'react'
import { originUserContext } from './UserAuthenticationContext'

const originCustomerContext = createContext()

const CustomerContext = ({ children }) => {
     const userContext = useContext(originUserContext)
     const { userID } = userContext

     const [customers, setGlobalCustomers] = useState([])
     const [customerTotalPage, setCustomerTotalPage] = useState(-1)
     const [customerCurrentPage, setCustomerCurrentPage] = useState(1)
     const [customerPaginatingNumber, setCustomerPaginatingNumber] = useState()
     const [customerSearched, setCustomerSearched] = useState(false)
     const [customerExist, setCustomerExist] = useState(true)
     const [listOfCustomerName, setListOfCustomerName] = useState()

     const refreshCustomers = async () => {
          const paginatingNumberResponse = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/PaginatingNumber/').concat(userID).concat('?key=customer'), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const paginatingNumberContent = await paginatingNumberResponse.json()
          setCustomerPaginatingNumber(paginatingNumberContent.size)
          let localPaginatingNumber = paginatingNumberContent.size

          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer').concat('?page=').concat(1).concat('&size=').concat(localPaginatingNumber), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()

          if (content.result.length < 1) {
               setCustomerExist(false)
          }
          else {
               setCustomerSearched(false)
               setGlobalCustomers(content.result)
               setCustomerCurrentPage(content.countInfo.currentPage)
               setCustomerTotalPage(content.countInfo.totalPages)
          }

     }

     const getCustomerFromID = async (id) => {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer/').concat(id), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()
          return content
     }

     const getCustomerFromName = async (name) => {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer').concat('/Name').concat('?name=').concat(name), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()
 
          if (content.countInfo.count < 1) return undefined
          return content.result[0]
     }

     const fetchListOfCustomerName = async () => {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Customer').concat('?page=').concat('1').concat('&size=').concat(100), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()
          setListOfCustomerName(content.result)
     }
     
     return (
          <originCustomerContext.Provider value={{ refreshCustomers, customers, setGlobalCustomers, customerTotalPage, setCustomerTotalPage, customerCurrentPage, setCustomerCurrentPage, customerPaginatingNumber, setCustomerPaginatingNumber, customerSearched, setCustomerSearched, refreshCustomers, getCustomerFromName, listOfCustomerName, fetchListOfCustomerName, getCustomerFromID, customerExist }}>
               {children}
          </originCustomerContext.Provider>
     )
}

export { originCustomerContext, CustomerContext }