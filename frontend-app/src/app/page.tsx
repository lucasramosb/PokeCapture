'use client'

import styles from "./page.module.css";
import { useRouter } from 'next/navigation';

export default function Home() {

  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <div className={styles.page}>
      <h1 >Bem-vindo ao Mundo Pokémon!</h1>
      <button onClick={handleClick}>Encontrar Pokémons</button>
    </div>
  );
}
