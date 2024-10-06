'use client'

import Button from "./components/button/button";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {

  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>PokeCapture</h1>
        <Image src="/pokebola.png" alt="pokebola" width={150} height={150} />
        <Button text="Encontrar Pokémons" onClick={handleClick} className={styles.customButton} />
      </div>
    </div>

  );
}
