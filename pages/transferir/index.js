import styles from '../../styles/Home.module.css';
import {
  Box,
  Select,
  Loader,
  Grid,
  Group,
  Image,
  Text,
  Modal,
  Button,
  ActionIcon,
  TextInput,
  useMantineTheme,
  Checkbox,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons';
import { servicos } from '../../js/servicos';
import { useState, useEffect, useRef, forwardRef } from 'react';

export default function Home() {
  const theme = useMantineTheme();
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

  const [opened, setOpened] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

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
  SelectItem.displayName = 'SelectItem';

  async function getPlyalists(origem) {
    const options = {
      method: 'POST',
      body: JSON.stringify({}),
    };

    return await fetch(`api/${origem}/playlists`, options)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          alert('Você precisa Logar novamente!');
          window.location.href = '/inicio';
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

  //Criar Nova Playlist
  function newPlyalist(formData) {
    console.log(formData);
    const options = {
      method: 'POST',
      body: formData,
    };
    fetch(`api/${valueDestiny}/me`, {})
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          alert('Você precisa Logar novamente!');
          window.location.href = '/inicio';
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

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      is_public: true,
    },

    // functions will be used to validate values at corresponding key
    validate: (value) => ({
      name: !value.name.trim() && 'Nome da Playlist é obrigatório',
    }),
  });

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
              transition='skew-down'
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
              transition='skew-down'
              transitionDuration={80}
              searchable
              clearable
              required
            />
          </Grid.Col>
        </Grid>
        <Grid justify='center' align='center'>
          <Grid.Col span={6}>
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
                transition='skew-down'
                nothingFound='Sem dados'
                transitionDuration={80}
                searchable
                clearable
                required
              />
            ) : null}
          </Grid.Col>
          <Grid.Col span={6}>
            {loaderPlaylistDestiny && showplaylistDestiny ? (
              <Loader size='lg' variant='dots' />
            ) : null}
            {showplaylistDestiny && !loaderPlaylistDestiny ? (
              <Grid justify='center' align='center' style={{ padding: '10px' }}>
                <Grid.Col span={10}>
                  <Select
                    label='Playlist de Destino'
                    placeholder='Playlist'
                    id='playlistDestiny'
                    nothingFound='Sem dados'
                    data={playlistsDestiny}
                    maxDropdownHeight={280}
                    value={plyalistDestinyId}
                    onChange={setPlyalistDestinyId}
                    transition='skew-down'
                    transitionDuration={80}
                    searchable
                    clearable
                    required
                  />
                </Grid.Col>
                <Grid.Col span={2} style={{ alignSelf: 'end' }}>
                  <ActionIcon
                    variant='outline'
                    color='blue'
                    onClick={() => setOpened(true)}
                  >
                    <IconPlus size={16}></IconPlus>
                  </ActionIcon>
                </Grid.Col>
              </Grid>
            ) : null}
          </Grid.Col>
        </Grid>
        <Button disabled={!(plyalistOriginId && plyalistDestinyId)}>
          Transferir
        </Button>
      </Box>
      <Modal
        overlayColor={
          theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        transition='fade'
        transitionDuration={600}
        transitionTimingFunction='ease'
        onClose={() => setOpened(false)}
        title='Criar Playlist'
        centered
      >
        <form onSubmit={form.onSubmit((values) => newPlyalist(values))}>
          <TextInput
            placeholder='Nome da Playlist'
            label='Nome'
            name='name'
            {...form.getInputProps('name')}
          />
          <TextInput
            placeholder='Descrição da Playlist'
            label='Descrição'
            name='description'
            {...form.getInputProps('description')}
          />
          <Checkbox
            label='Publica'
            {...form.getInputProps('is_public', { type: 'checkbox' })}
            name='is_public'
          />
          <Button
            type='submit'
            onClick={(e) => {
              setButtonLoading(true);
            }}
            loading={buttonLoading}
          >
            Criar
          </Button>
        </form>
      </Modal>
    </main>
  );
}
