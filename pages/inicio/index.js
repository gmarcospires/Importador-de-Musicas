import Button from '../../components/Button';
import styles from '../../styles/Home.module.css';
import React, { useRef, useEffect, Fragment, useState } from 'react';
import { Notification } from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { getCookies } from 'cookies-next';

import { showNotification } from '@mantine/notifications';

export default function Home(props) {
  const cookies = useRef(props.cookies);

  useEffect(() => {
    if (cookies.current != undefined) {
      if (cookies.current.access_token_spotify) {
        // setAlterou(true);
        showNotification({
          id: 'hello-there-spotify',
          autoClose: 3000,
          icon: <IconCheck />,
          className: 'my-notification-class',
          loading: false,
          title: 'Sucesso!',
          message: ' Login com sucesso em Spotify!',
        });
      }
      if (cookies.current.access_token_deezer) {
        // setAlterou(true);
        showNotification({
          id: 'hello-there-deezer',
          autoClose: 3000,
          icon: <IconCheck />,
          className: 'my-notification-class',
          loading: false,
          title: 'Sucesso!',
          message: ' Login com sucesso em Deezer!',
        });
      }
    } else {
      // if (alterou) {
      //   setAlterou(false);
      // }
    }
  }, [props.cookies]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Transfira Playlists!</h1>
      <p className={styles.description}>Transfira Playlits facilmente!</p>
      <div className={styles.grid}>
        {!cookies.current || !cookies.current.access_token_spotify ? (
          <Button href='/api/spotify/login' className={styles.card}>
            Logar com Spotify
          </Button>
        ) : null}
        {!cookies.current || !cookies.current.access_token_deezer ? (
          <Button href='/api/deezer/login' className={styles.card}>
            Logar com Deezer
          </Button>
        ) : null}
        {cookies.current &&
        cookies.current.access_token_spotify &&
        cookies.current.access_token_deezer ? (
          <Button href='/transferir' className={styles.card}>
            Começar a Transferir!
          </Button>
        ) : null}
      </div>
    </main>
  );
}

export const getServerSideProps = ({ req, res }) => {
  return {
    props: {
      cookies: getCookies({ req, res }),
    },
  };
};
