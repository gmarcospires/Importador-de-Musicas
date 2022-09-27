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
  const link = process.env.HOST + 'api/' + origem + '/playlist/tracks';
  let qtd_paginas = 0;
  let offset = 0;
  let ultima_pagina = {};

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
  //TODO: - Verificar se a musica ja existe na playlist de destino
  //TODO: - Verificar localidade
  // tracks_origem.forEach(track => {
  //   let musicName = tracks_origem[i].title || tracks_origem[i].track?.name;
  //   let artistName = tracks_origem[i].artist?.name || tracks_origem[i].track?.artists[0]?.name;
  //   let albumName = tracks_origem[i].album?.title || tracks_origem[i].track?.album?.name;

  // });
  let respostaSearch = [];
  let noResponse = []; //musicas que nao foram encontradas
  for (let i = 0; i < 10; i++) {
    let musicName = tracks_origem[i].title || tracks_origem[i].track?.name;
    let artistName =
      tracks_origem[i].artist?.name || tracks_origem[i].track?.artists[0]?.name;
    let albumName =
      tracks_origem[i].album?.title || tracks_origem[i].track?.album?.name;
    let type = tracks_origem[i].type || tracks_origem[i].track?.type;

    // console.log('Origem', musicName, artistName, albumName, type);
    // DEEZER
    // query "album" "artist" "track"
    // type
    // limit
    // offset

    //SPOTIFY
    // query 
    // type "album" "artist" "track"
    // limit
    // offset

    //Ajustar para não ter ' " em qualquer lugar da query
    //Ajustar para pegar o album 
    //"track:'I'm with You' artist:'Vance Joy'"
   //"track:'Something Got Between Us - Harvey Sutherland Remix' artist:'The Jungle Giants' album:'Something Got Between Us Harvey Sutherland Remix'"
    console.log('(((e))iii(r)'.replace('(', '').replace(')', ''));
    let url = process.env.HOST + 'api/' + destino + '/search';
    let query =
      "track:'" +
      musicName +
      "' artist:'" +
      artistName +
      // "' album:'" +
      // albumName+
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
            })
          );
        }
      })
      .then((jsonResponse) => {
        //  console.log(jsonResponse);
        let resposta = jsonResponse['data'] || jsonResponse['tracks']['items'];
        // console.log(resposta)
        if(resposta.length){
          respostaSearch = [...respostaSearch, ...resposta];
        }else{
          noResponse = [...noResponse, {
            query: query, //
            response: jsonResponse,
          }];
        }
        return 1;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err.message,
        });
      });
  }
  // TODO - Types que não existem no destino e vice versa
  res.status(200).json({
    resposta: respostaSearch,
    noResponse: noResponse,
    });

  //2 - Adicionar as musicas na playlist de destino
}
