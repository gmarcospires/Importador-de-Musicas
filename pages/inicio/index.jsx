import styles from '../../styles/Home.module.css';
import React, { useRef, useEffect, Fragment, useState } from 'react';
import { Button, Space } from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { getCookies } from 'cookies-next';
import Link from 'next/link';

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
          color: 'green',
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
          color: 'green',
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
      <div style={{ display: 'flex' }}>
        {!cookies.current || !cookies.current.access_token_spotify ? (
          <>
            <Link href='/api/spotify/login' passHref>
              <Button size='md'>Logar com Spotify</Button>
            </Link>
            <Space w='md' />
          </>
        ) : null}
        {!cookies.current || !cookies.current.access_token_deezer ? (
          <>
            <Space w='md' />
            <Link href='/api/deezer/login' passHref>
              <Button size='md'>Logar com Deezer</Button>
            </Link>
          </>
        ) : null}

        {cookies.current &&
        cookies.current.access_token_spotify &&
        cookies.current.access_token_deezer ? (
          <Link href='/transferir' passHref>
            <Button component='a'>Começar a Transferir!</Button>
          </Link>
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
