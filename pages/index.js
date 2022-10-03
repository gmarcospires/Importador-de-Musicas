import { Button } from '@mantine/core';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Transfira Playlists!</h1>
      <p className={styles.description}>Transfira Playlits facilmente!</p>
      <div className={styles.grid}>
        <Link href='/inicio' passHref>
          <Button component='a'>Comece agora!</Button>
        </Link>
      </div>
    </main>
  );
}
