import React, {useEffect} from 'react'

import { useDisclosure } from '@chakra-ui/react'
import {
     Modal,
     ModalOverlay,
     ModalContent,
     ModalHeader,
     ModalFooter,
     ModalBody,
     ModalCloseButton,
     Button,
     Heading,
     Flex,
     Text
} from '@chakra-ui/react'

import {
     CheckIcon,
     WarningIcon,
     WarningTwoIcon
} from '@chakra-ui/icons'



const Dialog = ({ type, message }) => {
     const { isOpen, onOpen, onClose } = useDisclosure()

     useEffect(() => {
          onOpen()
     }, [])
     
     let icon
     switch (type) {
          case 'success':
               icon = <CheckIcon />
               break
          case 'caution':
               icon = <WarningIcon />
               break
          case 'danger':
               icon = <WarningTwoIcon />
               break
          default:
               break
     }

     return (
          <>
               <Modal onClose={onClose} isOpen={isOpen} isCentered borderRadius ='12px'>
                    <ModalOverlay />
                    <ModalContent>
                         <ModalHeader bg={type} color='white' borderRadius='6px'>
                              <Flex alignItems='center' gap='15px'>
                                   {icon}
                                   <Text>{type.toUpperCase()}</Text>
                              </Flex>
                             
                         </ModalHeader>

                         <ModalCloseButton />

                         <ModalBody>
                              {message}
                         </ModalBody>

                         <ModalFooter>
                              <Button onClick={onClose}>Close</Button>
                         </ModalFooter>
                    </ModalContent>
               </Modal>
          </>
     )
}

export default Dialog