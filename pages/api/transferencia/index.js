export default function handler(req, res) {
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

  //Passos Origem
  //1 - Pegar as musicas da playlist origem
  let tracks_origem;
  const link = 'api/' + origem + '/playlist/tracks';
  const options = {
    method: 'POST',
    body: [
      {
        playlist_id: id_playlist_origem,
        limit: 100,
      },
    ],
  };

  res.body = options;
  res.redirect(link);
  // fetch(link, options)
  //   .then((response) => {
  //     console.log(response.json());
  //     res.status(200).json(response.json());
  //     res.send();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: err.message,
  //     });
  //   });
  //Passos Destino
  //1 - Procurar as musicas da playlist de origem
  //2 - Adicionar as musicas na playlist de destino
}
