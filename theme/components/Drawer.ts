import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
    // define the part you're going to style
    overlay: {
        bg: 'rgba(247,247,240,0.84)', //change the background
        _dark: {
            bg: 'rgba(34, 37, 45, 0.97)'
        }
    },
    dialog: {
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
    },
    header: {
        textAlign: 'center'
    },
    body: {
        minHeight: '300px',
    }
})

export const drawerTheme = defineMultiStyleConfig({
    baseStyle,
})