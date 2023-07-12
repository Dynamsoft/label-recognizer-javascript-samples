import '@/styles/globals.css'
import '@/styles/index.css'
import '@/styles/VideoRecognizer.css'
import '@/styles/ImageRecognizer.css'
import "@/dce"
import "@/dlr"
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
