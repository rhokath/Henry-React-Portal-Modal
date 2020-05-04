import React, { useState, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './App.module.scss';

const App = () => {
  const [isNormalOpen, setIsNormalOpen] = useState(false);
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  return (
    <main className={styles.main}>
      {/* This one works just fine */}
      <button onClick={() => setIsNormalOpen(!isNormalOpen)}>
        Open a modal
      </button>
      {isNormalOpen && (
        <Modal onClose={() => setIsNormalOpen(false)}>
          This is a test
        </Modal>
      )}
      <div className={styles.stickyFooter}>
        Cookies or something you will never read about, but messes up a modal as a direct child
        <button onClick={() => setIsFooterOpen(!isFooterOpen)}>
          Open a modal
        </button>
        {isFooterOpen && (
          <Modal onClose={() => setIsFooterOpen(false)}>
            This is rendered 'inside' the sticky footer, and would normally not be allowed to fill the screen.
          </Modal>
        )}
      </div>
    </main>
  );
}

// The '!' tells typescript that this must be defined. Technically, if someone
// delete the div from index.html this would null, and we would get a runtime
// error. There are ways of fixing this, or atleast throwing an error earlier, but
// I'll leave that as an exercise.
const portalRoot = document.querySelector('#portal-root')!;

const Portal: React.FC = ({ children }) => {
  const [portalElem] = useState(() => document.createElement('div'));

  useEffect(() => {
    portalRoot.appendChild(portalElem);
    return () => {
      portalRoot.removeChild(portalElem);
    };
  }, [portalElem]);

  return (
    createPortal(children, portalElem)
  );
};

type ModalProps = {
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {

  // Stop body from scrolling, while preserving scroll position.
  // Yes, we are doing DOM manipulation and you cannot stop me.
  useLayoutEffect(() => {
    const scrollY = window.scrollY;
    const position = document.body.style.position;
    document.body.style.position = 'fixed';
    const top = document.body.style.top;
    document.body.style.top = `-${scrollY}px`;
    return () => {
      document.body.style.position = position;
      document.body.style.top = top;
      Number(scrollY) && window.scrollTo(0, Number(scrollY));
    };
  }, []);

  const handleCloseClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };
  return (
    <Portal>
      <div className={styles.modal} onClick={handleCloseClick}>
        <div className={styles.modalContents}>
          {children}
        </div>
      </div>
    </Portal>
  )
};

export default App;
