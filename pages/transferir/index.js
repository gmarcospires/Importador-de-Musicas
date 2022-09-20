import Head from "next/head";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import styles from "../../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Transfira Playlits! - Transferir Playlists</title>
        <meta
          name="description"
          content="Transfira músicas do Spotify e Deezer"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Transfira Playlists!</h1>

        <p className={styles.description}>Transfira Playlits facilmente!</p>

        <div className={styles.grid}>
          <Button
            href=""
            onClick={() => {
              fetch("/api/spotify/login")
                .then((response) => {
                  console.log(response);
                  if (response.status === 200) {
                    return response.json();
                  } else {
                    console.log("Erro ao fazer login");
                  }
                })
                .then((jsonResponse) => {
                  window.localStorage.setItem("spotfy", jsonResponse);
                  console.log(window.localStorage.getItem("spotfy"));
                });
              // .catch((error) => {
              //   console.log(error);
              // });
            }}
            className={styles.card}
          >
            Logar
          </Button>
        </div>
      </main>

      <Footer name="Gmarcospires" href="https://github.com/gmarcospires" />
    </div>
  );
}
