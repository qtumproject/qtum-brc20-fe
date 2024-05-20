import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const outline = defineStyle({
  borderColor: "rgba(127, 133, 150, 0.30)",
  borderRadius: '12px',
  fontFamily: "DMsans",
})

// custom theme
const brandPrimary = defineStyle({
  background: '#2D73FF',
  color: 'white',
  borderRadius: '12px',
  fontFamily: "DMsans",

  // let's also provide dark mode alternatives
  _dark: {
    background: '#2D73FF',
    color: 'white',
    fontFamily: "DMsans",
  }
})

const round = defineStyle({
  background: '#2D73FF',
  color: 'white',
  borderRadius: 'full',
  fontFamily: "DMsans",
  // let's also provide dark mode alternatives
  _dark: {
    background: '#2D73FF',
    color: 'white',
    fontFamily: "DMsans",
  }
})

const link = defineStyle({
  color: 'black',
  fontFamily: "DMsans",
  _dark: {
    color: 'white',
    fontFamily: "DMsans"
  }
})



export const buttonTheme = defineStyleConfig({
  variants: { brandPrimary, outline, round, link },
  defaultProps: {
    size: 'lg', // default is md
  },
})