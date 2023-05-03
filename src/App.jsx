import './App.css'

import ContextProvider from 'ContextProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Redirect from './Redirect'
import Login from 'Login'
import SidePanel from './SidePanel'

import Dashboard from './Dashboard'

import Products from './Products'
import SingleProductDetails from 'Products/SingleProductDetails'
import ProductCreator from 'Products/ProductCreator'

import Orders from './Orders'
import SingleOrderDetails from 'Orders/SingleOrderDetails'
import OrderCreator from 'Orders/OrderCreator'

import FinanceReport from './FinanceReport'

import Customers from './Customers'
import SingleCustomerDetails from 'Customers/SingleCustomerDetails'
import CustomerCreator from 'Customers/CustomerCreator'

import { extendTheme, ChakraProvider } from '@chakra-ui/react'
const colors = {
  primary: '#f0e5e5',
  secondary: '#E19BB6',
  accent: '#CA4E7D',
  heading: '#913753',
  normal: '#404040',

  background: 'linear-gradient(120deg, rgba(245,209,220,0.29744397759103647) 0%, rgba(221,163,189,0.29744397759103647) 55%, rgba(221,57,131,0.30024509803921573) 100%)'
}
const theme = extendTheme({ colors })

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={
              <Redirect>
                <SidePanel />
              </Redirect>
            }>
              <Route path='/dashboard' element={<Dashboard />} />

              <Route path='/products' element={<Products />} />
              <Route path='/products/:productID' element={<SingleProductDetails />} />
              <Route path='/create/product' element={<ProductCreator />} />

              <Route path='/orders' element={<Orders />} />
              <Route path='/orders/:orderID' element={<SingleOrderDetails />} />
              <Route path='/create/order' element={<OrderCreator />} />

              <Route path='/finance-report' element={<FinanceReport />} />

              <Route path='/customers' element={<Customers />} />
              <Route path='/customers/:customerID' element={<SingleCustomerDetails />} />
              <Route path='/create/customer' element={<CustomerCreator />} />

            </Route>

            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ContextProvider>

    </ChakraProvider>
  )
}

export default App
