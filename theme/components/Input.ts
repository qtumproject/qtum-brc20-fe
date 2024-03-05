
import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    borderColor: '#E7E7E1',
    h: '56px',
    borderRadius: '12px',
  },
})

export const inputTheme = defineMultiStyleConfig({ baseStyle })