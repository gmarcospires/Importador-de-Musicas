import Button from '../../components/Button';
import styles from '../../styles/Home.module.css';
import React, { useRef, useEffect, Fragment, useState } from 'react';
import { Notification } from '@mantine/core';
import { IconCheck } from '@tabler/icons';

import { getCookies } from 'cookies-next';

export default function Home(props) {
  const cookies = useRef(props.cookies);
  const [alterou, setAlterou] = useState(false);

  useEffect(() => {
    cookies.current = props.cookies;
    if (cookies.current != undefined) {
      // if (cookies.current.access_token && cookies.current.access_token_deezer) {
      //   setAlterou(false);
      // } else {
      if (cookies.current.access_token) {
        setAlterou(true);
      }
      if (cookies.current.access_token_deezer) {
        setAlterou(true);
      }
      // }
    } else {
      setAlterou(false);
    }
  }, [props.cookies]);

  return (
        <main className={styles.main}>
          <h1 className={styles.title}>Transfira Playlists!</h1>
          <p className={styles.description}>Transfira Playlits facilmente!</p>
          <div className={styles.grid}>
            {!cookies.current || !cookies.current.access_token ? (
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
            cookies.current.access_token &&
            cookies.current.access_token_deezer ? (
              <Button href='/transferir' className={styles.card}>
                Começar a Transferir!
              </Button>
            ) : null}
          </div>
        
        {alterou ? (
          <Notification
            icon={<IconCheck size={18} />}
            color='teal'
            title='Sucesso!'
            style={{
              position: 'fixed',
              bottom: 100,
              right: 0,
              margin: 10,
              height: 100,
              width: 300,
            }}
            closeButtonProps={{
              'aria-label': 'Hide notification',
              title: 'Fechar',
            }}
            onClose={() => setAlterou(false)}
          >
            Login com sucesso!
          </Notification>
        ) : null}
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
