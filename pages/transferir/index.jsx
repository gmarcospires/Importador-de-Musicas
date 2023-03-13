import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconCameraOff,
  IconCheck,
  IconInfoCircle,
  IconPlus,
} from '@tabler/icons';
import { forwardRef, useEffect, useState } from 'react';
import { servicos } from '../../js/servicos';
import styles from '../../styles/Home.module.css';

import { Avatar, QRCode, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '../../redux/features/modal/modalSlice';
import * as XLSX from 'xlsx';

export default function Home() {
  const modalLogin = useSelector((state) => state.modal.value);
  const dispatch = useDispatch();

  const theme = useMantineTheme();
  const [valueDestiny, setValueDestiny] = useState('');
  const [valueOrigin, setValueOrigin] = useState('');

  const [playlistsOrigin, setPlaylistsOrigin] = useState([]);
  const [showplaylistOrigin, setShowplaylistOrigin] = useState(false);
  const [loaderPlaylistOrigin, setLoaderPlaylistOrigin] = useState(true);
  const [plyalistOriginId, setPlyalistOriginId] = useState('');

  const [playlistsDestiny, setPlaylistsDestiny] = useState([]);
  const [showplaylistDestiny, setShowplaylistDestiny] = useState(false);
  const [loaderPlaylistDestiny, setLoaderPlaylistDestiny] = useState(true);
  const [plyalistDestinyId, setPlyalistDestinyId] = useState('');
  const [plyalistDestinyLink, setPlyalistDestinyLink] = useState('');

  const [buttonLoading, setButtonLoading] = useState(false);

  const [opened, setOpened] = useState(false);
  const [buttonLoadingForm, setButtonLoadingForm] = useState(false);

  const [openedModalMusic, setOpenedModalMusic] = useState(false);
  const [dataSourceModal, setDataSourceModal] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [transferenciaConcluida, setTransferenciaConcluida] = useState(false);

  const [clickedItem, setClickedItem] = useState(null);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const [loadingTable, setLoadingTable] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const SelectItem = forwardRef(
    ({ image, label, description, ...others }, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Image
            withPlaceholder
            src={image}
            width={25}
            fit='cover'
            alt='Servivce Image'
          />
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
          dispatch(toggleModal(modalLogin));
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
            {
              value: dado.id,
              label: dado.name || dado.title,
              link: dado?.external_urls?.spotify || dado.link || null,
            },
          ];
        });
        return playlists;
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }

  //Criar Nova Playlist
  async function newPlyalist(formData) {
    let user_id = '';

    await fetch(`api/${valueDestiny}/me`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          dispatch(toggleModal(modalLogin));
        } else {
          new Error(response.json());
        }
      })
      .then((data) => {
        user_id = data['id'];
      })
      .catch((error) => {
        console.log(error);
      });

    const options = {
      method: 'POST',
      body: JSON.stringify({
        user_id: user_id,
        playlist_name: formData.playlist_name,
        description: formData.description,
        is_public: formData.is_public,
      }),
    };
    await fetch(`api/${valueDestiny}/add/playlist`, options)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          dispatch(toggleModal(modalLogin));
        } else {
          new Error(response.json());
        }
      })
      .then((data) => {
        setPlaylistsDestiny([
          {
            value: data['id'],
            label: formData.playlist_name,
            link: data?.external_urls?.spotify || dado.link || null,
          },
          ...playlistsDestiny,
        ]);
        setOpened(false);
      })
      .finally(() => {
        setButtonLoadingForm(false);
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
      setClickedItem(null);
      setSelectedRowKeys([]);
      setDataSource([]);
      setTransferenciaConcluida(false);
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
      setClickedItem(null);
      setSelectedRowKeys([]);
      setDataSource([]);
      setTransferenciaConcluida(false);
    }
  }, [valueOrigin]);

  useEffect(() => {
    return () => {
      setLoaderPlaylistDestiny(false);
      setShowplaylistDestiny(false);
      setClickedItem(null);
      setSelectedRowKeys([]);
      setDataSource([]);
      setTransferenciaConcluida(false);
      setDataSourceModal([]);
      setOpenedModalMusic(false);
      setValueDestiny('');
      setValueOrigin('');
      setPlaylistsOrigin([]);
      setPlaylistsDestiny([]);
      setPlyalistOriginId('');
      setPlyalistDestinyId('');
      setTransferenciaConcluida(false);
      setOpened(false);
    };
  }, []);

  const form = useForm({
    initialValues: {
      playlist_name: '',
      description: '',
      is_public: true,
    },

    // functions will be used to validate values at corresponding key
    validate: (value) => ({
      playlist_name:
        !value.playlist_name.trim() && 'Nome da Playlist é obrigatório',
    }),
  });
  useEffect(() => {
    if (!plyalistOriginId || !plyalistDestinyId) {
      setClickedItem(null);
      setSelectedRowKeys([]);
      setDataSource([]);
      setTransferenciaConcluida(false);
    }
  }, [plyalistOriginId, plyalistDestinyId]);

  async function transferir() {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        origem: valueOrigin,
        destino: valueDestiny,
        id_playlist_origem: plyalistOriginId,
        id_playlist_destino: plyalistDestinyId,
      }),
    };
    await fetch('api/transferencia', options)
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
        if (data['tracksResposta']) {
          setDataSource(data['tracksResposta']);
          setTransferenciaConcluida(true);
        }
      })
      .finally(() => {
        setButtonLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const onClickAddMusic = () => {
    selectedRowKeys.forEach((key) => {
      const uri = dataSourceModal.find((item) => item.id == key).uri;
      fetch(`api/${valueDestiny}/add/playlist/items`, {
        method: 'POST',
        body: JSON.stringify({
          playlist_id: plyalistDestinyId,
          uris: uri,
        }),
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          } else if (response.status == 401) {
            dispatch(toggleModal(modalLogin));
          } else {
            new Error(response.json());
          }
        })
        .then((data) => {
          const item = dataSource.find((item) => item.id == clickedItem);
          if (item) {
            item.status = 'OK';
            setDataSource([...dataSource]);
          }
        })
        .finally(() => {});
      setSelectedRowKeys([]);
      setDataSourceModal([]);
      setClickedItem(null);
      setOpenedModalMusic(false);
    });
  };
  return (
    <main className={styles.main} style={{ gap: '2rem' }}>
      <ScrollArea></ScrollArea>
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
                    onChange={(val) => {
                      setPlyalistDestinyId(val);
                      setPlyalistDestinyLink(
                        playlistsDestiny.find((x) => x.value == val)?.link ?? ''
                      );
                    }}
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
        <Button
          disabled={!(plyalistOriginId && plyalistDestinyId)}
          loading={buttonLoading}
          loaderProps={{ color: 'blue', opacity: 1 }}
          onClick={() => {
            setDataSource([]);
            setButtonLoading(true);
            transferir();
          }}
        >
          Transferir
        </Button>
      </Box>

      {transferenciaConcluida && dataSource.length > 0 && (
        <>
          {plyalistDestinyLink ? (
            <>
              <QRCode value={plyalistDestinyLink} /> {plyalistDestinyLink}{' '}
            </>
          ) : null}

          <Table
            width='100%'
            height='100%'
            title={() => (
              <Button
                size='xs'
                onClick={() => {
                  const ws = XLSX.utils.json_to_sheet(
                    dataSource.filter((x) => x.status === 'NOT FOUND')
                  );
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, 'Não Transferidos');
                  const ws2 = XLSX.utils.json_to_sheet(
                    dataSource.filter((x) => x.status !== 'NOT FOUND')
                  );
                  XLSX.utils.book_append_sheet(wb, ws2, 'Transferidos');
                  XLSX.writeFile(wb, 'Exportação.xlsx');
                }}
              >
                Exportar
              </Button>
            )}
            dataSource={dataSource || []}
            columns={[
              {
                title: 'Título',
                dataIndex: 'musicName',
                key: 'musicName',
                sorter: (a, b) => a.musicName.localeCompare(b.musicName),
              },
              {
                title: 'Artista',
                dataIndex: 'artistName',
                key: 'artistName',
                sorter: (a, b) => a.artistName.localeCompare(b.artistName),
              },
              {
                title: 'Album',
                dataIndex: 'albumName',
                key: 'albumName',
                sorter: (a, b) => a.albumName.localeCompare(b.albumName),
              },
              {
                title: 'Situação',
                dataIndex: 'status',
                key: 'status',
                render: (text, record, index) => {
                  if (record.status === 'NOT FOUND') {
                    return (
                      <Tooltip title={`Música não encontrada! :(`}>
                        <IconInfoCircle key={index} size={16} color='red' />
                      </Tooltip>
                    );
                  } else if (record.status === 'DUPLICATED') {
                    return (
                      <Tooltip title={`Música já existe na playlist! :(`}>
                        <IconCheck key={index} size={16} color='orange' />
                      </Tooltip>
                    );
                  } else
                    return (
                      <Tooltip title={`Música encontrada e Transferida! :)`}>
                        <IconCheck key={index} size={16} color='green' />
                      </Tooltip>
                    );
                },
                sorter: (a, b) => a.status.localeCompare(b.status),
                defaultSortOrder: 'ascend',
                filters: [
                  {
                    text: 'Encontrada',
                    value: 'OK',
                  },
                  {
                    text: 'Não Encontrada',
                    value: 'NOT FOUND',
                  },
                  {
                    text: 'Duplicada',
                    value: 'DUPLICATED',
                  },
                ],
                onFilter: (value, record) => record.status.indexOf(value) === 0,
                onCell: (record, rowIndex) => ({
                  onClick: async () => {
                    if (record.status === 'NOT FOUND') {
                      const query =
                        "track:'" +
                        record.musicName.replace(/[\']+/g, '') +
                        "' artist:'" +
                        record.artistName.replace(/[\']+/g, '') +
                        "'";

                      const data = await fetch(
                        'api/' + valueDestiny + '/search',
                        {
                          method: 'POST',
                          body: JSON.stringify({
                            query: query,
                            type: 'track',
                            limit: 10,
                            offset: 0,
                          }),
                        }
                      )
                        .then((response) => {
                          return response.json();
                        })
                        .then((resp) => {
                          return resp.tracks.items.map((item) => {
                            return {
                              id: item.id,
                              musicName: item.name,
                              artistName: item.artists[0].name,
                              albumName: item.album.name,
                              image: item.album.images[0].url || '',
                              uri: item.uri || item.id,
                            };
                          });
                        });
                      setClickedItem(record.id);
                      setOpenedModalMusic(true);
                      setDataSourceModal(data);
                    }
                  },
                  onDoubleClick: (record) => {
                    navigator.clipboard.writeText(
                      record.musicName +
                        ' ' +
                        record.artistName +
                        ' ' +
                        record.albumName
                    );
                  },
                }),
              },
            ]}
            pagination={{
              position: ['topRight', 'bottomRight'],
              defaultPageSize: 10,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total}`,
              pageSizeOptions: ['10', '20', '50', '100'],
              total: dataSource.length,
              locale: {
                items_per_page: '/ página',
                jump_to_confirm: 'Confirmar',
                prev_page: 'Página Anterior',
                next_page: 'Próxima Página',
              },
            }}
            locale={{
              sortTitle: 'Ordenar',
              filterTitle: 'Filtros',
              filterConfirm: 'Filtrar',
              filterReset: 'Limpar',
              emptyText: 'Nenhum registro encontrado',
              selectAll: 'Selecionar Tudo',
              selectInvert: 'Inverter Seleção',
              filterCheckall: 'Selecionar Tudo',
              filterSearchPlaceholder: 'Pesquisar',
              triggerAsc: 'Ordenar Crescente',
              triggerDesc: 'Ordenar Decrescente',
              cancelSort: 'Cancelar Ordenação',
            }}
            loading={false}
            rowKey={(record) => record.id}
          />
        </>
      )}
      <Modal
        overlayColor={
          theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        size={'lg'}
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={openedModalMusic}
        transition='fade'
        transitionDuration={600}
        transitionTimingFunction='ease'
        onClose={() => {
          setOpenedModalMusic(false);
          setSelectedRowKeys([]);
          setClickedItem(null);
          setDataSourceModal([]);
        }}
        title='Músicas Encontradas'
        centered
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button
              type='primary'
              onClick={() => {
                onClickAddMusic();
              }}
              disabled={!selectedRowKeys.length}
            >
              Adicionar músicas
            </Button>
            <span style={{ marginLeft: 8 }}>
              {selectedRowKeys.length
                ? `Selecionado ${selectedRowKeys.length} items`
                : ''}
            </span>
          </div>
          <Table
            dataSource={dataSourceModal || []}
            columns={[
              {
                title: '',
                dataIndex: 'image',
                key: 'image',
                render: (text, record, index) => {
                  return (
                    <Avatar
                      key={index}
                      shape='square'
                      size={64}
                      icon={
                        text ? (
                          <Image src={text} alt='Capa do Álbum' />
                        ) : (
                          <IconCameraOff />
                        )
                      }
                    />
                  );
                },
              },
              {
                title: 'Título',
                dataIndex: 'musicName',
                key: 'musicName',
              },
              {
                title: 'Artista',
                dataIndex: 'artistName',
                key: 'artistName',
              },
              {
                title: 'Album',
                dataIndex: 'albumName',
                key: 'albumName',
              },
            ]}
            pagination={false}
            loading={false}
            rowKey={(record) => record.id}
            rowSelection={rowSelection}
          />
        </div>
      </Modal>
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
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
        title='Criar Playlist'
        centered
      >
        <form
          onSubmit={form.onSubmit((values) => {
            setButtonLoadingForm(true);
            newPlyalist(values);
            form.reset();
          })}
        >
          <TextInput
            placeholder='Nome da Playlist'
            label='Nome'
            name='playlist_name'
            style={{ padding: '10px' }}
            {...form.getInputProps('playlist_name')}
          />
          <TextInput
            placeholder='Descrição da Playlist'
            label='Descrição'
            name='description'
            style={{ padding: '10px' }}
            {...form.getInputProps('description')}
          />
          <Checkbox
            label='Pública'
            {...form.getInputProps('is_public', { type: 'checkbox' })}
            name='is_public'
            style={{ padding: '10px' }}
          />
          <Button type='submit' loading={buttonLoadingForm}>
            Criar
          </Button>
        </form>
      </Modal>
    </main>
  );
}
