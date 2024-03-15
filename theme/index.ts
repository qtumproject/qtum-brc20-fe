import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { buttonTheme } from './components/Button'
import { inputTheme } from './components/Input'
import { numberInputTheme } from './components/NumberInput'
import { modalTheme } from './components/Modal'
import { stepperTheme } from './components/Stepper';


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
    Stepper: stepperTheme,
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
    },
    green: {
      100: '#60b072',
      200: '#60b072',
      300: '#60b072',
      400: '#60b072',
      500: '#60b072',
      600: '#60b072',
      700: '#60b072',
      800: '#60b072',
      900: '#60b072',
    },
    red: {
      100: '#dc5050',
      200: '#dc5050',
      300: '#dc5050',
      400: '#dc5050',
      500: '#dc5050',
      600: '#dc5050',
      700: '#dc5050',
      800: '#dc5050',
      900: '#dc5050',
    }
  }
})

export default theme