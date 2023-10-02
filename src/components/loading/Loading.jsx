import { Spinner } from '@chakra-ui/react'

const Loading = () => {
    return ( 
       
        <Spinner
        className='Loader'
    thickness='4px'
     speed='0.65s'
     emptyColor='gray.200'
    color='purple.500'
     size='xl'
/>
     );
}
 
export default Loading;