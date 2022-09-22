import Button from '../../components/Button';

import styles from '../../styles/Home.module.css';
import { Box, Select, Loader, Grid } from '@mantine/core';
import { servicos } from '../../js/servicos';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [valueDestiny, setValueDestiny] = useState('');
  const [valueOrigin, setValueOrigin] = useState('');

  const [playlistsOrigin, setPlaylistsOrigin] = useState([]);
  const [playlistsDestiny, setPlaylistsDestiny] = useState([]);
  const [showplaylistOrigin, setShowplaylistOrigin] = useState(false);
  const [loaderPlaylistOrigin, setLoaderPlaylistOrigin] = useState(true);
  const [showplaylistDestiny, setShowplaylistDestiny] = useState(false);
  const [loaderPlaylistDestiny, setLoaderPlaylistDestiny] = useState(true);

  const [plyalistOriginId, setPlyalistOriginId] = useState('');
  const [plyalistDestinyId, setPlyalistDestinyId] = useState('');

  async function getPlyalists(origem) {
    const options = {
      method: 'POST',
      body: JSON.stringify({}),
    };

    return await fetch(`api/${origem}/playlists`, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data['data'] || data['items'];
      })
      .then((data) => {
        let playlists = [];
        data.forEach((dado) => {
          playlists = [
            ...playlists,
            { value: dado.id, label: dado.name || dado.title },
          ];
        });
        return playlists;
      });
  }

  useEffect(() => {
    console.log('destiny', valueDestiny);
    if (valueDestiny) {
      setShowplaylistDestiny(true);
      setLoaderPlaylistDestiny(true);
      getPlyalists(valueDestiny).then((playlists) => {
        setPlaylistsDestiny(playlists);
        setLoaderPlaylistDestiny(false);
      });
    } else {
      setLoaderPlaylistDestiny(false);
      setShowplaylistDestiny(false);
    }
  }, [valueDestiny]);

  useEffect(() => {
    console.log('origin', valueOrigin);
    if (valueOrigin) {
      setShowplaylistOrigin(true);
      setLoaderPlaylistOrigin(true);
      getPlyalists(valueOrigin).then((playlists) => {
        setPlaylistsOrigin(playlists);
        setLoaderPlaylistOrigin(false);
      });
    } else {
      setLoaderPlaylistOrigin(false);
      setShowplaylistOrigin(false);
    }
  }, [valueOrigin]);

  return (
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
              label="Selecione a Origem"
              id="origin"
              placeholder="Selecione"
              data={servicos}
              style={{ padding: '10px' }}
              value={valueOrigin}
              onChange={setValueOrigin}
              searchable
              clearable
              required
            />
            <Select
              label="Selecione o Destino"
              id="destiny"
              placeholder="Selecione"
              data={servicos}
              style={{ padding: '10px' }}
              value={valueDestiny}
              onChange={setValueDestiny}
              searchable
              clearable
              required
            />
          </div>
          <Grid justify="center" align="center">
            <Grid.Col span="auto">
              {loaderPlaylistOrigin && showplaylistOrigin ? (
                <Loader size="lg" variant="dots" />
              ) : null}
              {showplaylistOrigin && !loaderPlaylistOrigin ? (
                <Select
                  label="Playlist de Origem"
                  placeholder="Playlist"
                  id="playlistOrigin"
                  data={playlistsOrigin}
                  maxDropdownHeight={280}
                  style={{ padding: '10px' }}
                  value={plyalistOriginId}
                  onChange={setPlyalistOriginId}
                  searchable
                  clearable
                  required
                />
              ) : (
                <div></div>
              )}
            </Grid.Col>
            <Grid.Col span="auto">
              {loaderPlaylistDestiny && showplaylistDestiny ? (
                <Loader size="lg" variant="dots" />
              ) : null}
              {showplaylistDestiny && !loaderPlaylistDestiny ? (
                <Select
                  label="Playlist de Destino"
                  placeholder="Playlist"
                  id="playlistDestiny"
                  data={playlistsDestiny}
                  maxDropdownHeight={280}
                  style={{ padding: '10px' }}
                  value={plyalistDestinyId}
                  onChange={setPlyalistDestinyId}
                  searchable
                  clearable
                  required
                />
              ) : (
                <div></div>
              )}
            </Grid.Col>
          </Grid>
        </Box>
      </main>
  );
}
