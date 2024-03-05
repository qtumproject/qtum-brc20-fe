import {
  Box,
  useRadio,
} from '@chakra-ui/react';

export default function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as='label' className='block flex-1 h-9 leading-9'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='0'
        borderRadius='md'
        className='text-center'
        _checked={{
          bg: 'white',
          color: '#2d73ff',
          borderColor: 'transparent',
        }}
      >
        {props.children}
      </Box>
    </Box>
  )
}