import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { writeData } from 'localFile'

import { originProductContext } from 'context/ProductContext'
import { convertToCurrency } from 'valueConverter'

import { Image, Flex, Text, Center, Divider, Stack, Button, useToast } from '@chakra-ui/react'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit2 } from 'react-icons/fi'

import ProductEditor from 'Products/ProductEditor'

const SingleProductDetails = () => {
  const productContext = useContext(originProductContext)
  const { products } = productContext

  const { productID } = useParams();
  const location = useLocation()

  const [product, setProduct] = useState()
  const [currentIllustrationIndex, setCurrentIllustrationIndex] = useState(0)
  const [detailDialogOpened, setDetailDialogOpened] = useState(false)

  const toast = useToast()
  const navigateTo = useNavigate()

  const fetchProduct = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/').concat(productID), {
      headers: {
        'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      }
    })
    const content = await response.json()
    setProduct(content)
  }

  useEffect(() => {
    fetchProduct()
    writeData('route.txt', location.pathname)
  }, [])

  const handleDeletion = async () => {
    if (product?.categoryID) {
      toast({
        title: `Decreasing the product quantity of ${product.categoryID.name}`,
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'pink'
      })

      const response1 = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Category/').concat(product.categoryID._id), {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
        },
        body: JSON.stringify({
          productQuantity: product.categoryID.productQuantity - 1
        })
      })
    }

    const response2 = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Product/').concat(product['_id']), {
      method: 'DELETE', headers: {
        'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      }
    })

    if (!response2.ok) {
      toast({
        title: 'An error has occured',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'red'
      })
    }

    else {
      toast({
        title: 'The product has been deleted successfully',
        variant: 'subtle',
        status: 'info',
        position: 'bottom-right',
        colorScheme: 'purple'
      })

      navigateTo('/products')

      setTimeout(() => toast.closeAll(), 1000)
    }

  }

  const handleEdition = async () => {
    setDetailDialogOpened(true)
  }

  return (
    <>
      <Center width='100%' height='150px' bg='white' borderRadius='20'>
        <Image src={product?.illustrations[currentIllustrationIndex]?.illustrationPath} height='100%' objectFit='contain' fallbackSrc='https://via.placeholder.com/150' />
      </Center>

      <Flex justify='space-between' align='center' marginY='30'>
        <Flex align='end' gap='5' justify='flex-start'>
          <Text color='heading' fontSize='20' fontWeight='bold'>{product?.name}</Text>
          <Text color='heading' fontSize='18' fontStyle='italic'>({product?.categoryID?.name})</Text>
        </Flex>

        <Flex justify='center' gap='3'>
          {product?.illustrations.map((illustration, index) => <Image key={index} src={illustration?.illustrationPath} boxSize='75' borderRadius='10' onClick={() => setCurrentIllustrationIndex(index)} _hover={{ filter: 'brightness(80%)', cursor: 'pointer' }} boxShadow='xl' fallbackSrc='https://via.placeholder.com/150' />)}
        </Flex>
      </Flex>

      <Flex justify='space-between'>
        <Stack>
          <Flex align='end' gap='10'>
            <Text color='heading' fontSize='18' fontWeight='bold'>Original price</Text>
            <Text fontSize='16'>{convertToCurrency('VND', product?.originalPrice)}</Text>
          </Flex>

          <Flex align='end' gap='10'>
            <Text color='heading' fontSize='18' fontWeight='bold'>Actual price</Text>
            <Text fontSize='16'>{convertToCurrency('VND', product?.actualPrice)}</Text>
          </Flex>
        </Stack>

        <Stack>
          <Flex align='end' gap='10'>
            <Text color='heading' fontSize='18' fontWeight='bold'>Available slot</Text>
            <Text fontSize='16'>{product?.availableSlot}</Text>

          </Flex>

          <Flex align='end' gap='10'>
            <Text color='heading' fontSize='18' fontWeight='bold'>Total slot</Text>
            <Text fontSize='16'>{product?.totalSlot}</Text>
          </Flex>
        </Stack>
      </Flex>


      <Divider bg='secondary' height='1' marginY='30' />

      <Flex align='end' gap='10'>
        <Text color='heading' fontSize='18' fontWeight='bold'>Provider name</Text>
        <Text fontSize='16'>{product?.providerName}</Text>
      </Flex>

      <Flex align='end' gap='10'>
        <Text color='heading' fontSize='18' fontWeight='bold'>Origin</Text>
        <Text fontSize='16'>{product?.origin}</Text>
      </Flex>

      <Flex align='end' gap='10'>
        <Text color='heading' fontSize='18' fontWeight='bold'>Brand</Text>
        <Text fontSize='16'>{product?.brand}</Text>
      </Flex>

      <Divider bg='secondary' height='0.5' marginY='30' />

      <Flex flexFlow='column'>
        <Text color='heading' fontSize='18' fontWeight='bold'>Description</Text>
        <Text fontSize='16'>{product?.description}</Text>
      </Flex>

      <Flex justify='center' gap='10' marginY='20px'>
        <Button leftIcon={<AiOutlineDelete />} variant='solid' colorScheme='pink' onClick={handleDeletion}>Delete</Button>
        <Button leftIcon={<FiEdit2 />} variant='outline' colorScheme='pink' bg='white' onClick={handleEdition}>Edit</Button>
      </Flex>

      {detailDialogOpened && <ProductEditor setOpen={setDetailDialogOpened} product={product} />}
    </>
  )
}

export default SingleProductDetails