import React from 'react';
import NavBar from '../NavBar/NavBar';

const Layout:React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className='container-fluid'>
        {children}
      </main>
    </>
  );
};

export default Layout;