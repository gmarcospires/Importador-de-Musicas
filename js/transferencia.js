import { Music } from './music-model';

//1 - Pegar as musicas da playlist origem
export const getMusicsPlaylistOrigem = async (
  origem,
  access_token_origem,
  id_playlist_origem
) => {
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
      })
      .catch((err) => {
        console.log(err);
      });
    qtd_paginas++;
  } while (ultima_pagina['next']);
  let tracks = [];

  for (const track of tracks_origem) {
    let musicas = new Music();
    musicas.origem.servico = origem;
    musicas.origem.id = track.id || track.track.id;
    musicas.origem.musicName = track.title || track.track?.name;
    musicas.origem.artistName =
      track.artist?.name || track.track?.artists[0]?.name;
    musicas.origem.albumName = track.album?.title || track.track?.album?.name;
    musicas.origem.type = track.type || track.track?.type;
    musicas.origem.isrc = track.track?.external_ids?.isrc || '';
    tracks = [...tracks, musicas];
  }
  return tracks;
};

//1 - Procurar as musicas no destino
export const searchMusicsDestiny = async (
  destino,
  access_token_destino,
  tracks_origem
) => {
  let respostaSearch = [];
  let noResponse = [];

  for (const track of tracks_origem) {
    let musicName = track.origem.musicName;
    let artistName = track.origem.artistName;
    let albumName = track.origem.albumName;
    let type = track.origem.type;

    let url = process.env.HOST + 'api/' + destino + '/search';
    let query =
      "track:'" +
      musicName.replace(/[\']+/g, '') +
      "' artist:'" +
      artistName.replace(/[\']+/g, '') +
      // "' album:'" +
      // albumName +
      "'";
    track.searchQuery = query;

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
          track.destino.servico = destino;
          track.destino.id = resposta[0].id || resposta[0].id;
          track.destino.musicName = resposta[0].title || resposta[0]?.name;
          track.destino.artistName =
            resposta[0].artist?.name || resposta[0]?.artists[0]?.name;
          track.destino.albumName =
            resposta[0].album?.title || resposta[0]?.album?.name;
          track.destino.type = resposta[0].type || resposta[0]?.type;
          track.destino.isrc = resposta[0].external_ids?.isrc || '';

          track.uri = resposta[0].uri || '';
          track.encontrado = true;

          respostaSearch = [...respostaSearch, ...resposta];
        } else {
          noResponse = [
            ...noResponse,
            {
              query: query,
              response: jsonResponse,
            },
          ];
        }
      })
      .catch((err) => {
        noResponse = [
          ...noResponse,
          {
            query: query,
            response: err.jsonResponse,
          },
        ];
      });
  }
  //Ordenar pelos encontrados
  tracks_origem.sort((a, b) => {
    if (a.encontrado && !b.encontrado) return -1;
    if (!a.encontrado && b.encontrado) return 1;
  });
  return tracks_origem;
};

export function getUriTracks(tracks) {
  let tracks_uri = [];
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].encontrado) {
      tracks_uri = [...tracks_uri, tracks[i]?.uri || tracks[i].destino.id];
    }
  }

  const corte = 50;
  let uris = [];
  for (var i = 0; i < tracks_uri.length; i = i + corte) {
    uris.push(tracks_uri.slice(i, i + corte));
  }

  return uris;
}

export async function addMusicsDestiny(destino, access_token_destino, uris) {
  for (const uri of uris) {
    let url = process.env.HOST + 'api/' + destino + '/add/playlist/items';
    let optionsSearch = {
      method: 'POST',
      body: JSON.stringify({
        playlist_id: id_playlist_destino,
        uris: uri,
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
      });
  }
  return 1;
}
