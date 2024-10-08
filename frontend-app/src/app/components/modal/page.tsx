import { ReactNode, MouseEvent } from 'react';
import styles from './modal.module.css';

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({onClose, children}) => {

    // Função que lida com o clique fora do modal
    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
          }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContainer}>
                {children}
            </div>
        </div>
    )
}