import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.tsx'; // Corrected import path with .tsx extension
import Footer from '../components/Footer.tsx'; // Corrected import path with .tsx extension

const MainLayout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Sets isScrolled to true if scroll position is greater than 10px from the top
      setIsScrolled(window.scrollY > 10);
    };

    // Add scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);
    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <div className="flex flex-col min-h-screen">
      {/* The Header component, which is fixed at the top */}
      <Header isScrolled={isScrolled} />

      {/*
        The main content area.
        'pt-24' (padding-top: 6rem or 96px) is added to ensure that
        the content below the fixed header is not overlapped by it.
        This padding should roughly match the height of your Header component.
        'flex-grow' ensures this main section takes up available vertical space.
      */}
      <main className="flex-grow pt-8">
        {/*
          Outlet renders the current route's component.
          It will now start 96px below the top of the viewport,
          effectively appearing below the fixed Header.
        */}
        <Outlet />
      </main>

      {/* The Footer component */}
      <Footer />
    </div>
  );
};

export default MainLayout;
