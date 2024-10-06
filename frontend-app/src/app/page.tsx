'use client'

import Button from "./components/button/button";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Container from "./components/container/container";

export default function Home() {

  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <div className={styles.page}>
      <Container>
          <h1 className={styles.title}>PokeCapture</h1>
          <Image src="/pokebola.png" alt="pokebola" width={150} height={150} />
          <Button text="Encontrar Pokémons" onClick={handleClick} className={styles.customButton} />
      </Container>
    </div>

  );
}
