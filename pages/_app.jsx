import '../styles/globals.css';
import Head from 'next/head';
import Footer from '../components/Footer';
import ModalComponent from '../components/Modal';
import styles from '../styles/Home.module.css';

import { useState } from 'react';
import {
  useMantineTheme,
  MantineProvider,
  ColorSchemeProvider,
} from '@mantine/core';

import { NotificationsProvider } from '@mantine/notifications';
import { useColorScheme } from '@mantine/hooks';

import { Provider } from 'react-redux';
import { store } from '../redux/store';

function MyApp({ Component, pageProps }) {
  const theme = useMantineTheme();
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(preferredColorScheme);
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  return (
    <>
      <Provider store={store}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider theme={theme} withNormalizeCSS withGlobalStyles>
            <NotificationsProvider>
              <Head>
                <title>Transfira Playlits! - Transferir Playlists</title>
                <meta
                  name='description'
                  content='Transfira músicas do Spotify e Deezer'
                />
                <link rel='icon' href='/favicon.ico' />
              </Head>
              <div className={styles.container}>
                <Component {...pageProps} />
              </div>
              <Footer
                name='Gmarcospires'
                href='https://github.com/gmarcospires'
              />
              <ModalComponent theme={theme}></ModalComponent>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
