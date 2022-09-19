import Head from 'next/head'
import Image from 'next/image'
import Button from '../components/Button'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Transfira Playlits!</title>
        <meta name="description" content="Transfira músicas do Spotify e Deezer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Transfira Playlits!
        </h1>

        <p className={styles.description}>
          Transfira Playlits facilmente!
        </p>

        <div className={styles.grid}>
            <Button href="/transferir" className={styles.card}>Comece agora!</Button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/gmarcospires"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            Gmarcospires
          </span>
        </a>
      </footer>
    </div>
  )
}
