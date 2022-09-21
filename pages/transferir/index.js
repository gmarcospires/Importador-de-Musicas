import Head from 'next/head';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import styles from '../../styles/Home.module.css';
import { Box, Select } from '@mantine/core';
import { servicos } from '../../js/servicos';
import { useState, useEffect } from 'react';

export default function Home() {
  const [valueDestiny, setValueDestiny] = useState('');
  const [valueOrigin, setValueOrigin] = useState('');

  useEffect(() => {
    console.log('destiny', valueDestiny);
  }, [valueDestiny]);

  useEffect(() => {
    console.log('origin', valueOrigin);
  }, [valueOrigin]);

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
        <h1>Transferência</h1>
        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[1],
            textAlign: 'center',
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
          })}
        >
          <div className={styles.grid}>
            <Select
              label='Selecione a Origem'
              placeholder='Selecione'
              data={servicos}
              style={{ padding: '10px' }}
              value={valueOrigin}
              onChange={setValueOrigin}
              searchable
              required
            />
            <Select
              label='Selecione o Destino'
              placeholder='Selecione'
              data={servicos}
              style={{ padding: '10px' }}
              value={valueDestiny}
              onChange={setValueDestiny}
              searchable
              required
            />
          </div>
        </Box>
      </main>

      <Footer name='Gmarcospires' href='https://github.com/gmarcospires' />
    </div>
  );
}
