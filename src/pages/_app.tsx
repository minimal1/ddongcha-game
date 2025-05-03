import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import { SupabaseProvider } from '@/shared/context/SupabaseProvider'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SupabaseProvider>
  )
}
