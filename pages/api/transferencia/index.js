import { getCookie } from 'cookies-next';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }
  const body = JSON.parse(req.body);

  const origem = body.origem;
  const destino = body.destino;
  const id_playlist_origem = body.id_playlist_origem;
  const id_playlist_destino = body.id_playlist_destino;
  const access_token_origem = getCookie('access_token_' + origem, { req, res });
  const access_token_destino = getCookie('access_token_' + destino, {
    req,
    res,
  });

  //Passos Origem
  //1 - Pegar as musicas da playlist origem
  let tracks_origem = [];
  let qtd_paginas = 0;
  let offset = 0;
  let ultima_pagina = {};
  const link = process.env.HOST + 'api/' + origem + '/playlist/tracks';

  do {
    offset = qtd_paginas * 20;
    let options = {
      method: 'POST',
      body: JSON.stringify({
        playlist_id: id_playlist_origem,
        limit: 20,
        offset: offset,
        access_token: access_token_origem,
      }),
    };

    await fetch(link, options)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(
            JSON.stringify({
              status: response.status,
              statusText: response.statusText,
            })
          );
        }
      })
      .then((jsonResponse) => {
        ultima_pagina = jsonResponse;
        let resposta = jsonResponse['data'] || jsonResponse['items'];

        tracks_origem = [...tracks_origem, ...resposta];
        return 1;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err.message,
        });
      });
    qtd_paginas++;
  } while (ultima_pagina['next']);

  //DEEZER
  // Album => album->title
  // artist => artist->name
  // nome musica => title  ou title_short

  //SPOTIFY
  // Album => track->album->name
  // artist => track->artists->[0]->name
  // nome musica => track->name  ou title_short
  // isrc => track->external_ids->isrc

  //Passos Destino
  //1 - Procurar as musicas da playlist de origem

  // res.status(200).json({
  //   resposta: tracks_origem,
  //   noResponse: [],
  // });
  console.log('PASSO ORIGEM COMPLETO', tracks_origem.length);
  let respostaSearch = [];
  let noResponse = []; //musicas que nao foram encontradas
  let tracksResposta = [];

  //   // DEEZER
  //   // query "album" "artist" "track"
  //   // type
  //   // limit
  //   // offset

  //   //SPOTIFY
  //   // query
  //   // type "album" "artist" "track"
  //   // limit
  //   // offset

  for (const track of tracks_origem) {
    let musicName = track.title || track.track?.name;
    let artistName = track.artist?.name || track.track?.artists[0]?.name;
    let albumName = track.album?.title || track.track?.album?.name;
    let type = track.type || track.track?.type;

    let url = process.env.HOST + 'api/' + destino + '/search';
    let query =
      "track:'" +
      musicName.replace(/[\']+/g, '') +
      "' artist:'" +
      artistName.replace(/[\']+/g, '') +
      "' album:'" +
      albumName.replace(/[\']+/g, '') +
      "'";

    let optionsSearch = {
      method: 'POST',
      body: JSON.stringify({
        query: query,
        type: type,
        limit: 1,
        offset: 0,
        access_token: access_token_destino,
      }),
    };
    await fetch(url, optionsSearch)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(
            JSON.stringify({
              status: response.status,
              statusText: response.statusText,
              jsonResponse: response.json(),
            })
          );
        }
      })
      .then((jsonResponse) => {
        let resposta = jsonResponse['data'] || jsonResponse['tracks']['items'];
        if (resposta.length) {
          respostaSearch = [...respostaSearch, ...resposta];
          tracksResposta.push({
            musicName: musicName,
            artistName: artistName,
            albumName: albumName,
            query: query,
            status: 'OK',
            id: track.id,
          });
        } else {
          noResponse = [
            ...noResponse,
            {
              query: query,
              response: jsonResponse,
            },
          ];
          tracksResposta.push({
            musicName: musicName,
            artistName: artistName,
            albumName: albumName,
            query: query,
            status: 'NOT FOUND',
            id: track.id,
          });
        }
        return 1;
      })
      .catch((err) => {
        console.log(err);
        noResponse = [
          ...noResponse,
          {
            query: query,
            response: err.jsonResponse,
          },
        ];
      });
  }
  console.log(
    'PESQUISA DESTINO COMPLETA',
    respostaSearch.length,
    noResponse.length
  );
  //2 - Adicionar as musicas na playlist de destino
  for (const track of respostaSearch) {
    let musicId = track.id;
    let uri = track.uri || null;
    let url = process.env.HOST + 'api/' + destino + '/add/playlist/items';

    let optionsSearch = {
      method: 'POST',
      body: JSON.stringify({
        playlist_id: id_playlist_destino,
        uris: uri || musicId,
        access_token: access_token_destino,
      }),
    };
    await fetch(url, optionsSearch)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          if (
            response.json()?.error?.message ==
            'This song already exists in this playlist'
          ) {
            return 1;
          }
          throw new Error(
            JSON.stringify({
              status: response.status,
              statusText: response.statusText,
              jsonResponse: response.json(),
            })
          );
        }
      })
      .then((response) => {
        return 1;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err.message,
        });
      });
  }
  tracksResposta = tracksResposta.sort((a, b) => {
    if (a.status == 'OK' && b.status == 'NOT FOUND') return 1;
    if (a.status == 'NOT FOUND' && b.status == 'OK') return -1;
    return 0;
  });
  res.status(200).json({
    tracksResposta: tracksResposta,
  });
}
