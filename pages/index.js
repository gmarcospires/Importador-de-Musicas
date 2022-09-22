import Button from '../components/Button';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Transfira Playlists!</h1>
      <p className={styles.description}>Transfira Playlits facilmente!</p>
      <div className={styles.grid}>
        <Button href="/inicio" className={styles.card}>
          Comece agora!
        </Button>
      </div>
    </main>
  );
}
