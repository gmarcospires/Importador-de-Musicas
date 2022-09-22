import Button from '../../components/Button';
import styles from '../../styles/Home.module.css';
import { Box, Select, Loader, Grid, Group, Image, Text } from '@mantine/core';
import { servicos } from '../../js/servicos';
import { useState, useEffect, useRef, forwardRef } from 'react';

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

  const SelectItem = forwardRef(
    ({ image, label, description, ...others }, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Image withPlaceholder src={image} width={25} fit='cover' />
          <div>
            <Text size='sm'>{label}</Text>
            <Text size='xs' color='dimmed'>
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  async function getPlyalists(origem) {
    const options = {
      method: 'POST',
      body: JSON.stringify({}),
    };

    return await fetch(`api/${origem}/playlists`, options)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          new Error(response.json());
        }
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
      })
      .catch((error) => {
        console.log(error);
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
        <Grid justify='center' align='center'>
          <Grid.Col span='auto'>
            <Select
              label='Selecione a Origem'
              id='origin'
              itemComponent={SelectItem}
              placeholder='Selecione'
              data={servicos}
              style={{ padding: '10px' }}
              value={valueOrigin}
              onChange={setValueOrigin}
              transition='fade'
              transitionDuration={80}
              searchable
              clearable
              required
            />
          </Grid.Col>
          <Grid.Col span='auto'>
            <Select
              label='Selecione o Destino'
              id='destiny'
              placeholder='Selecione'
              itemComponent={SelectItem}
              data={servicos}
              style={{ padding: '10px' }}
              value={valueDestiny}
              onChange={setValueDestiny}
              transition='fade'
              transitionDuration={80}
              searchable
              clearable
              required
            />
          </Grid.Col>
        </Grid>
        <Grid justify='center' align='center'>
          <Grid.Col span='auto'>
            {loaderPlaylistOrigin && showplaylistOrigin ? (
              <Loader size='lg' variant='dots' />
            ) : null}
            {showplaylistOrigin && !loaderPlaylistOrigin ? (
              <Select
                label='Playlist de Origem'
                placeholder='Playlist'
                id='playlistOrigin'
                data={playlistsOrigin}
                maxDropdownHeight={280}
                style={{ padding: '10px' }}
                value={plyalistOriginId}
                onChange={setPlyalistOriginId}
                transition='fade'
                nothingFound='Sem dados'
                transitionDuration={80}
                searchable
                clearable
                required
              />
            ) : (
              <div></div>
            )}
          </Grid.Col>
          <Grid.Col span='auto'>
            {loaderPlaylistDestiny && showplaylistDestiny ? (
              <Loader size='lg' variant='dots' />
            ) : null}
            {showplaylistDestiny && !loaderPlaylistDestiny ? (
              <Select
                label='Playlist de Destino'
                placeholder='Playlist'
                id='playlistDestiny'
                nothingFound='Sem dados'
                data={playlistsDestiny}
                maxDropdownHeight={280}
                style={{ padding: '10px' }}
                value={plyalistDestinyId}
                onChange={setPlyalistDestinyId}
                transition='fade'
                transitionDuration={80}
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
