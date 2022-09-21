import Head from 'next/head';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import styles from '../../styles/Home.module.css';
import { Box } from '@mantine/core';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Transfira Playlits! - Transferir Playlists</title>
        <meta
          name='description'
          content='Transfira músicas do Spotify e Deezer'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
            textAlign: 'center',
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            cursor: 'pointer',

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            },
          })}
        >
          Box lets you add inline styles with sx prop
        </Box>
      </main>

      <Footer name='Gmarcospires' href='https://github.com/gmarcospires' />
    </div>
  );
}
