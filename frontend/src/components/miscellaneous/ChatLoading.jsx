import {Stack} from '@chakra-ui/layout'
import { Skeleton } from '@chakra-ui/react'

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
      <Skeleton height='45px'></Skeleton>
    </Stack>
  )
}

export default ChatLoading
