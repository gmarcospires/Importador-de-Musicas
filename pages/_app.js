import '../styles/globals.css';
import Head from 'next/head';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Transfira Playlits! - Transferir Playlists</title>
        <meta
          name="description"
          content="Transfira músicas do Spotify e Deezer"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Component {...pageProps} />
      </div>
      <Footer name="Gmarcospires" href="https://github.com/gmarcospires" />
    </>
  );
}

export default MyApp;
