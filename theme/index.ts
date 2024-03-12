import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { buttonTheme } from './components/Button'
import { inputTheme } from './components/Input'
import { numberInputTheme } from './components/NumberInput'
import { modalTheme } from './components/Modal'


const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  fonts: {
    body: 'DMsans'
  },
  components: {
    Button: buttonTheme,
    Input: inputTheme,
    NumberInput: numberInputTheme,
    Modal: modalTheme,
  },
  colors: {
    brand: {
      100: '#2D73FF',
      200: '#2D73FF',
      300: '#2D73FF',
      400: '#2D73FF',
      500: '#2D73FF',
      600: '#2D73FF',
      700: '#2D73FF',
      800: '#2D73FF',
      900: '#2D73FF',
    }
  }
})

export default theme