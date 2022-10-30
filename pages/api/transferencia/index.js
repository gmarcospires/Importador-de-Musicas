import { getCookie } from 'cookies-next';
import {
  getMusicsPlaylistOrigem,
  searchMusicsDestiny,
  getUriTracks,
  addMusicsDestiny,
} from '../../../js/transferencia.js';

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

  const tracks_origem = await getMusicsPlaylistOrigem(
    origem,
    access_token_origem,
    id_playlist_origem
  );

  //DEEZER
  // Album => album->title
  // artist => artist->name
  // nome musica => title  ou title_short

  //SPOTIFY
  // Album => track->album->name
  // artist => track->artists->[0]->name
  // nome musica => track->name  ou title_short
  // isrc => track->external_ids->isrc

  console.log('PASSO ORIGEM COMPLETO', tracks_origem.length);

  //Passos Destino
  //1 - Procurar as musicas da playlist de origem

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

  const respostaSearch = await searchMusicsDestiny(
    destino,
    access_token_destino,
    tracks_origem
  );

  console.log('PESQUISA DESTINO COMPLETA');
  let uris = getUriTracks(respostaSearch);

  //2 - Adicionar as musicas na playlist de destino
  await addMusicsDestiny(destino, access_token_destino, uris);

  res.status(200).json({
    resposta: respostaSearch.filter((item) => item.encontrado),
    noResponse: respostaSearch.filter((item) => !item.encontrado),
  });
}
