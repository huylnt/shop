import { useState, useLayoutEffect } from 'react'
import { Center, Image, Text } from '@chakra-ui/react'

const ScreenSizeDetector = ({ children }) => {

     const [width, setWidth] = useState(window.innerWidth);
     const handleWindowResize = () => {
          setWidth(window.innerWidth);
     }

     useLayoutEffect(() => {
          window.addEventListener('resize', handleWindowResize);
     }, []);

     return (
          <>
               {(width < 1100)
                    ? <Center height='100vh' padding='20px' flexFlow='column'>
                         <Image src='illustration_not_supported.jpg' width='80%' filter='hue-rotate(10deg)' />
                         <Text textAlign='center'>The application UI has not been available for this screen size.</Text>
                    </Center>
                    : children}
          </>

     )
}

export default ScreenSizeDetector