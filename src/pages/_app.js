import '@/styles/globals.css'
import "@aws-amplify/ui-react/styles.css";
import { theme } from '@/theme';
import Script  from "next/script";
import { useEffect } from "react";
import { ThemeProvider } from '@aws-amplify/ui-react';
import GlobalContext from '@/context/globalContext';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
 
  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     gtag.pageview(url);
  //   };
 
  //   router.events.on("routeChangeComplete", handleRouteChange);
 
  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router.events]);

  return (
    <ThemeProvider theme={theme}>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-FRG383J5ZG" strategy="afterInteractive" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-FRG383J5ZG');
        `}
      </Script>
      <GlobalContext>
        <Component {...pageProps} />
      </GlobalContext>
    </ThemeProvider>
  )
}
