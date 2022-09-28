import '../styles/globals.css';
import Head from 'next/head';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';
import Page from './inicio';
import { useState } from 'react';
import { Modal, useMantineTheme } from '@mantine/core';
import { getCookies } from 'cookies-next';

function MyApp({ Component, pageProps, cookies }) {
  const [openedLoginModal, setOpenedLoginModal] = useState(false);
  const theme = useMantineTheme();
  return (
    <>
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
      <Footer name='Gmarcospires' href='https://github.com/gmarcospires' />
      <Modal
        overlayColor={
          theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={openedLoginModal}
        transition='fade'
        transitionDuration={600}
        transitionTimingFunction='ease'
        onClose={() => {
          setOpenedLoginModal(false);
        }}
        title='Login'
        centered
      >
        <Page cookies={cookies}></Page>
      </Modal>
    </>
  );
}

export default MyApp;

export const getServerSideProps = ({ req, res }) => {
  return {
    cookies: getCookies({ req, res }),
  };
};
