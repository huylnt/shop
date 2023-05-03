import { Skeleton } from "@chakra-ui/react"

const ContentLoader = () => {
     return (
          <>
               <Skeleton height='30px' startColor='primary' endColor='secondary' />
               <Skeleton height='30px' startColor='primary' endColor='secondary' />
               <Skeleton height='30px' startColor='primary' endColor='secondary' />
               <Skeleton height='30px' startColor='primary' endColor='secondary' />
               <Skeleton height='30px' startColor='primary' endColor='secondary' />
          </>
     )
}

export default ContentLoader