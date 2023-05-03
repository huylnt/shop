import { useEffect, useState, useContext } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Flex, Stack, Center, Skeleton, Image, Text, Modal, ModalBody, ModalOverlay, ModalContent, ModalFooter, ModalHeader, Button } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'

import ControlPanel from 'component/ControlPanel'
import CategoryEditor from './CategoryEditor'
import Paginator from 'component/Paginator'
import { useNavigate } from 'react-router'

import { originUserContext } from 'context/UserAuthenticationContext'
import { originProductContext } from 'context/ProductContext'
import { originCategoryContext } from 'context/CategoryContext'

import { convertToCurrency } from 'valueConverter'
import ContentLoader from 'component/ContentLoader'

const CategoryMenu = ({ categoryID, categoryName, setCategoryName }) => {
  const toast = useToast()
  const navigateTo = useNavigate()
  const [editorOpened, setEditorOpened] = useState(false)

  const editCategory = () => {
    setEditorOpened(true)
  }

  const handleCategoryDeletion = async () => {
    toast({
      title: 'Deleting category and make related products anonymous...',
      variant: 'subtle',
      status: 'info',
      position: 'bottom-right',
      colorScheme: 'pink'
    })

    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category/').concat(categoryID), {
      method: 'DELETE',
      headers: {
        'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
   }
    })

    setCategoryName()
  }

  return (
    <>
      <Modal isOpen={true} onClose={() => setCategoryName()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{categoryName}</ModalHeader>

          <ModalFooter>
            <Button variant='solid' colorScheme='pink' marginRight='10px' onClick={handleCategoryDeletion}>Delete</Button>
            <Button variant='outline' colorScheme='pink' marginRight='10px' onClick={editCategory}>Edit name</Button>
            <Button variant='ghost' colorScheme='pink' mr={3} onClick={() => setCategoryName()}>Close</Button>
          </ModalFooter>

        </ModalContent>
      </Modal>

      {editorOpened && <CategoryEditor mode='EDIT' setOpen={setEditorOpened} originCategoryID={categoryID} originCategoryName={categoryName} />}
    </>

  )
}

const Products = () => {
  const userContext = useContext(originUserContext)
  const { userID } = userContext

  const productContext = useContext(originProductContext)
  const { products, productSearched, refreshProducts, productExist } = productContext
  const categoryContext = useContext(originCategoryContext)
  const { categories, categorySearched, refreshCategories, categoryExist, newCategory } = categoryContext

  const [chosenCategoryID, setChosenCategoryID] = useState()
  const [chosenCategoryName, setChosenCategoryName] = useState()

  const toast = useToast()

  const navigateTo = useNavigate()

  useEffect(() => {
    if (!chosenCategoryName) {
      refreshProducts()
      refreshCategories()
    }

  }, [chosenCategoryName, newCategory])

  const handleCategoryMenuOpened = (categoryID, categoryName) => {
    if (!chosenCategoryName) {
      setChosenCategoryID(categoryID)
      setChosenCategoryName(categoryName)
    }
    else {
      setChosenCategoryID()
      setChosenCategoryName()
    }
  }

  return (
    <Flex flexFlow='column' justify='space-between' height='100%'>
      <Tabs variant='soft-rounded' colorScheme='pink' size='lg' defaultIndex={0}>
        <TabList>
          <Tab>Products</Tab>
          <Tab>Categories</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ControlPanel context='PRODUCT' />
            {(!productExist) && <Center marginBottom='120px'>
              <Stack>
                <Image src='./illustration_empty_initially.png' boxSize='300' objectFit='cover' />
                <Text textAlign='center'>No product has been added.</Text>
              </Stack>
            </Center>}

            {(productExist && productSearched && products?.length < 1) ? <Center marginTop='50px'>
              <Stack>
                <Image src='./illustration_not_found.png' boxSize='300' objectFit='cover' />
                <Text textAlign='center'>There is no result matching your search.</Text>
              </Stack>
            </Center> : <TableContainer height='365px' overflowY='scroll' m='0'>

              {(!productSearched && products.length < 1) &&
                <Stack marginTop='30px'>
                  <ContentLoader />
                </Stack>
              }



              {(products?.length > 0) &&
                <Table variant='simple' colorScheme='pink' m='0'>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>Available slot</Th>
                      <Th>Category</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {products?.map((product, index) => <Tr _hover={{ background: 'white', cursor: 'pointer' }} onClick={() => navigateTo(`/products/${product['_id']}`)} key={index}>
                      <Td>{product.name}</Td>
                      <Td isNumeric>{convertToCurrency('VND', product.actualPrice)}</Td>
                      <Td isNumeric>{`${product.availableSlot}/${product.totalSlot}`}</Td>
                      <Td>{product.categoryID?.name}</Td>
                    </Tr>)}
                  </Tbody>

                </Table>
              }
            </TableContainer>
            }



            {(products?.length > 0) && <Paginator context='PRODUCT' />}

          </TabPanel>

          <TabPanel>
            <ControlPanel context='CATEGORY' />

            {(!categoryExist) && <Center marginBottom='120px'>
              <Stack>
                <Image src='./illustration_empty_initially.png' boxSize='300' objectFit='cover' />
                <Text textAlign='center'>No category has been created.</Text>
              </Stack>
            </Center>}

            {(categoryExist && categorySearched && categories?.length < 1) ? <Center marginTop='50px'>
              <Stack>
                <Image src='./illustration_not_found.png' boxSize='300' objectFit='cover' />
                <Text textAlign='center'>There is no result matching your search.</Text>
              </Stack>
            </Center> : <TableContainer height='365px' overflowY='scroll'>

              {(!categorySearched && categories?.length < 1) &&
                <Stack marginTop='30px'>
                  <ContentLoader />
                </Stack>
              }

              {(categories?.length > 0) &&
                <Table variant='simple' colorScheme='pink'>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th isNumeric>Total of products</Th>
                    </Tr>

                  </Thead>

                  <Tbody>
                    {categories?.map((category, index) => <Tr _hover={{ background: 'white', cursor: 'pointer' }} onClick={() => handleCategoryMenuOpened(category._id, category.name)} key={index}>
                      <Td>{category.name}</Td>
                      <Td isNumeric>{category.productQuantity}</Td>
                    </Tr>)}
                  </Tbody>

                </Table>
              }
            </TableContainer>
            }



            {(categories?.length > 0) && <Paginator context='CATEGORY' />}
            {chosenCategoryName && <CategoryMenu categoryID={chosenCategoryID} categoryName={chosenCategoryName} setCategoryName={setChosenCategoryName} />}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>

  )
}

export default Products