import type { AppProps } from 'next/app'
import Layout from '@/shared/ui/layout/Layout'
import { SupabaseProvider } from '@/shared/supabase/lib/SupabaseProvider'
import '@/shared/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SupabaseProvider>
  )
}
