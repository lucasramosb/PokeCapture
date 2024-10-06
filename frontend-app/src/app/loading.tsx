import { CgPokemon } from 'react-icons/cg';

export default function loading() {
  return (
    <div style={{    
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      color: '#333',
      }}>
      <CgPokemon size={50} />
    </div>
  );
}