import React from 'react';
import Container from './components/container/Container'
import './components/assets/styles/Style.css';
import {LoginProvider} from './context/LoginContext';
import { AdminProvider } from './context/AdminContext';
import { LocalProvider } from './context/LocalContext';

function App() {
  return (
    <AdminProvider>
    <LoginProvider>
    <LocalProvider>
    <div className='container'>
       <Container />
    </div>
    </LocalProvider>
    </LoginProvider>
    </AdminProvider>
  );
}

export default App;
