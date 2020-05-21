import React, { useState, useEffect } from 'react';
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
          <Modal onClose={() =>setIsFooterOpen(false)}>
            This is rendered 'inside' the sticky footer, and would normally not be allowed to fill the screen.
          </Modal>
        )}
      </div>
    </main>
  );
}

// We will use a hardcoded portal root to make things easier. You have to put a
// dom node in here though, I'm not doing that for you.
/*
! tells typescript yes this value can be null or undefined but it is defined, assume that this exists
*/
const portalRoot = document.querySelector('#portal-root')!;

const Portal: React.FC = ({ children }) => {
  // This should do portal things
  //lazy initialization == initialize useState with a function
  //so will only run of first render, similar to it being in constructor of class component
  //here it's a hack because trying to encapsulate side effect
  const [targetElem] = useState(()=>{
    document.createElement('div')
  });
  useEffect(()=> {
    portalRoot.appendChild(targetElem)
    //clean up function
    return () => { 
      portalRoot.removeChild(targetElem)
    }

  }, [targetElem])
  return (
   createPortal(
     children,
     targetElem
   )
  );
};
type ModalProps = {
  //returns nothing
  onClose: () => void;
}
// This should do modal things (using Portal) and apply styles to the containing div(s)
const Modal: React.FC<ModalProps> = ({ children, onClose}) => {
  //this way you don't have to stop event propogation
  const handleContainerClick = (e: React.MouseEvent) => {
    if(e.currentTarget === e.target){
      onClose()
    }
  }
  //prevent scrolling outside of modal
  useEffect(() => {
    document.body.style.position = 'fixed'
    return () => {
      document.body.style.position = ''
    }
  })
  return (
    <Portal>
      <div className={styles.modalContainer} onClick={handleContainerClick}>
        <div className={styles.modal}>
        {children}
        </div>
      </div>
    </Portal>
  )
};

export default App;
