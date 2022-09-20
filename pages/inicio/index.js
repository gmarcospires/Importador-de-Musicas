import Head from 'next/head';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import styles from '../../styles/Home.module.css';

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
          <Button href="/api/spotify/login" className={styles.card}>
            Logar
          </Button>
        </div>
      </main>

      <Footer name="Gmarcospires" href="https://github.com/gmarcospires" />
    </div>
  );
}
