import React, { useState, createContext, useContext } from 'react'
import { originUserContext } from './UserAuthenticationContext'
const originCategoryContext = createContext()

const CategoryContext = ({ children }) => {
     const userContext = useContext(originUserContext)
     const { userID } = userContext

     const [categories, setGlobalCategories] = useState([])
     const [categoryTotalPage, setCategoryTotalPage] = useState(-1)
     const [categoryCurrentPage, setCategoryCurrentPage] = useState(1)
     const [categoryPaginatingNumber, setCategoryPaginatingNumber] = useState()
     const [categorySearched, setCategorySearched] = useState(false)
     const [categoryExist, setCategoryExist] = useState(true)
     const [newCategory, setRemoteNewCategory] = useState(0)

     const refreshCategories = async () => {
          const paginatingNumberResponse = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/PaginatingNumber/').concat(userID).concat('?key=category'), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const paginatingNumberContent = await paginatingNumberResponse.json()
          setCategoryPaginatingNumber(paginatingNumberContent.size)
          let localPaginatingNumber = paginatingNumberContent.size

          const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category').concat('?page=').concat(1).concat('&size=').concat(localPaginatingNumber), {
               headers: {
                    'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
               }
          })
          const content = await response.json()

          if (content.result.length < 1) {
               setCategoryExist(false)
          }

          else {
               setCategorySearched(false)
               setGlobalCategories(content.result)
               setCategoryCurrentPage(content.countInfo.currentPage)
               setCategoryTotalPage(content.countInfo.totalPages)
          }

     }

     return (
          <originCategoryContext.Provider value={{ categories, setGlobalCategories, categoryTotalPage, setCategoryTotalPage, categoryCurrentPage, setCategoryCurrentPage, categoryPaginatingNumber, setCategoryPaginatingNumber, categorySearched, setCategorySearched, refreshCategories, newCategory, setRemoteNewCategory, categoryExist }}>
               {children}
          </originCategoryContext.Provider>
     )
}

export { originCategoryContext, CategoryContext }