import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const outline = defineStyle({
  borderColor: "rgba(127, 133, 150, 0.30)",
  borderRadius: '12px',
})

// custom theme
const brandPrimary = defineStyle({
    background: '#2D73FF',
    color: 'white',
    borderRadius: '12px',
  
    // let's also provide dark mode alternatives
    _dark: {
      background: '#2D73FF',
      color: 'white',
    }
  })
  

export const buttonTheme = defineStyleConfig({
  variants: { brandPrimary,  outline},
  defaultProps: {
    size: 'lg', // default is md
  },
})