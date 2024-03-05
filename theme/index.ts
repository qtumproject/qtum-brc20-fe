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
  components: { 
    Button: buttonTheme,
    Input: inputTheme,
    NumberInput: numberInputTheme,
    Modal: modalTheme,
  },
})

export default theme