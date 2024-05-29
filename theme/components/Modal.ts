import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/styled-system'

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
    borderRadius: '24px',
  },
  header: {
    textAlign: 'center'
  }
})

const sm = defineStyle({
  maxWidth: "343px",
})

const sizes = {
  sm: definePartsStyle({ header: sm, dialog: sm }),
}

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
  sizes
})