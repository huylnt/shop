import React, { useState, useContext, createContext } from 'react'
import { originUserContext } from './UserAuthenticationContext'

const originProductContext = createContext()

const ProductContext = ({ children }) => {
     const userContext = useContext(originUserContext)
     const { userID } = userContext
     
     const [products, setGlobalProducts] = useState([])
     const [productTotalPage, setProductTotalPage] = useState(-1)
     const [productCurrentPage, setProductCurrentPage] = useState(1)
     const [productPaginatingNumber, setProductPaginatingNumber] = useState()
     const [productSearched, setProductSearched] = useState(false)
     const [productExist, setProductExist] = useState(true)
     const [categoryList, setCategoryList] = useState([])
     const [listOfProductName, setListOfProductName] = useState()

     const refreshProducts = async () => {
          const paginatingNumberResponse = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/PaginatingNumber/').concat(userID).concat('?key=product'), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const paginatingNumberContent = await paginatingNumberResponse.json()
          setProductPaginatingNumber(paginatingNumberContent.size)
          let localPaginatingNumber = paginatingNumberContent.size

          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('?page=').concat('1').concat('&size=').concat(localPaginatingNumber), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()

          if (content.result.length < 1) {
               setProductExist(false)
          }
          else {
               setProductSearched(false)
               setGlobalProducts(content.result)
               setProductCurrentPage(content.countInfo.currentPage)
               setProductTotalPage(content.countInfo.totalPages)
          }
         
     }

     const fetchListOfProductName = async () => {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product').concat('?page=').concat('1').concat('&size=').concat(100), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()
          setListOfProductName(content.result)
     }

     const fetchCategoryList = async () => {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category'), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()
          setCategoryList(content.result.map(categoryObject => categoryObject.name))
     }

     const getCategoryIDFromName = async (name) => {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category').concat('/Name').concat('?name=').concat(name), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()
          if (content.countInfo.count < 1) return undefined

          return content.result[0]['_id'].toString()
     }

     return (
          <originProductContext.Provider value={{ products, setGlobalProducts, productTotalPage, setProductTotalPage, productCurrentPage, setProductCurrentPage, productPaginatingNumber, setProductPaginatingNumber, productSearched, setProductSearched, refreshProducts, listOfProductName, fetchListOfProductName, categoryList, fetchCategoryList, getCategoryIDFromName, productExist }}>
               {children}
          </originProductContext.Provider>
     )
}

export { originProductContext, ProductContext }