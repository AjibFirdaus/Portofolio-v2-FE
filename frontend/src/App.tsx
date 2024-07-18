import React, { useRef } from 'react';
import './App.css';
import NavBar from './components/navbar';
import Home from './section/home';
import About from './section/about';
// import Skills from './section/skills';
import Projects from './section/projects';
// import Certificates from './section/certificates';
import Contact from './section/contact';
import Messages from './section/messages';
import useCheckLogin from './hooks/fetchCheckLogin';

import { ToastProvider } from './components/toastContext';

function App() {
  const { isLoggedIn, checkingLogin } = useCheckLogin();
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const certificatesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  if (checkingLogin) return <div className='flex justify-center'><span className="loading loading-bars loading-lg h-screen"></span></div>;

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <ToastProvider>
        <NavBar scrollToSection={scrollToSection} refs={{ homeRef, aboutRef, skillsRef, projectsRef, certificatesRef, contactRef }} />
        <div ref={homeRef}><Home scrollToSection={scrollToSection} refs={{ projectsRef }} /></div>
        <div ref={aboutRef}><About /></div>
        {/* <div ref={skillsRef}><Skills /></div> */}
        <div ref={projectsRef}><Projects /></div>
        {/* <div ref={certificatesRef}><Certificates /></div> */}
        <div ref={contactRef}><Contact /></div>
        <>
          {isLoggedIn && (
            <div><Messages /></div>
          )}
        </>
      </ToastProvider>
    </>
  );
}

export default App;