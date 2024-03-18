import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from './layout';
import theme from '../theme';
import { ThemeProvider } from 'next-themes'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme='light' storageKey='chakra-ui-color-mode'>
      <ChakraProvider theme={theme}>
        <Layout><Component {...pageProps} /></Layout>
      </ChakraProvider>
    </ThemeProvider>
  )
}
