import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  overlay: {
    bg: 'rgba(247,247,240,0.84)', //change the background
  },
  dialog: {
    borderRadius: '24px',
  },
})

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
})