import {
    Box,
    useRadio,
} from '@chakra-ui/react';

export default function RadioCard(props: any) {
    const { getInputProps, getRadioProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getRadioProps()

    return (
        <Box as='label' className='block flex-1 h-8 leading-9'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                borderWidth='0'
                borderRadius='md'
                className='text-center dark:hidden block'
                _checked={{
                    bg: 'white',
                    color: '#2d73ff',
                    borderColor: 'transparent',
                    fontWeight: 800
                }}
            >
                {props.children}
            </Box>
            <Box
                {...checkbox}
                cursor='pointer'
                borderWidth='0'
                borderRadius='md'
                className='text-center hidden dark:block'
                _checked={{
                    bg: '#31343F',
                    color: '#2D73FF',
                    borderColor: 'transparent',
                    fontWeight: 800
                }}
            >
                {props.children}
            </Box>
        </Box>
    )
}