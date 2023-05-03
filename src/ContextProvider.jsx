import { UserAuthenticationContext } from 'context/UserAuthenticationContext'
import { ProductContext } from 'context/ProductContext'
import { CategoryContext } from 'context/CategoryContext'
import { CustomerContext } from 'context/CustomerContext'
import { OrderContext } from 'context/OrderContext'

const ContextProvider = ({children}) => {
  return (
    <UserAuthenticationContext>
      <ProductContext>
        <CustomerContext>
          <CategoryContext>
            <OrderContext>
              {children}
            </OrderContext>
          </CategoryContext>
        </CustomerContext>
      </ProductContext>
    </UserAuthenticationContext>
  )
}

export default ContextProvider
