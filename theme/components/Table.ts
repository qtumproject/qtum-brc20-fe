import { tableAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(tableAnatomy.keys)

const baseStyle = definePartsStyle({
    // define the part you're going to style
    tr: {
        th: {
            color: '#7F8596', // change the td text color
            fontSize: '14px'
        },
    },
})

export const tableTheme = defineMultiStyleConfig({ baseStyle })