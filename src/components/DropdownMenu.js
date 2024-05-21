import React, { useEffect, useState } from 'react';
import '../styles/DropdownMenu.css';

const ordersOpenImg = '../../icons/orders-blue-open.png';
const ordersClosedImg = '../../icons/orders-blue.png';
const reservationsOpenImg = '../../icons/reservation-open-blue.png';
const reservationsClosedImg = '../../icons/reservation-blue.png';
const tablesOpenImg = '../../icons/tables-blue-open.png';
const tablesClosedImg = '../../icons/tables-blue.png';
const dotsClosedImg = '../../icons/dots-blue.png';
const dotsOpenImg = '../../icons/dots-open.png'; 
const menuOpenImg = '../../icons/menu-open.png';
const menuClosedImg = '../../icons/menu-closed.png';
const floorplanOpenImg = '../../icons/floorplan-open.png';
const floorplanClosedImg = '../../icons/floorplan-closed.png';
const settingsOpenImg = '../../icons/settings-open.png';
const settingsClosedImg = '../../icons/settings-closed.png';

function DropdownMenu({ changeMode, currentMode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setActiveButton(null); // Reset active button when menu is toggled
  };

  const handleButtonClick = (buttonName, mode) => {
    setActiveButton(buttonName);
    changeMode(mode); // Call changeMode function passed from parent component
  };

  const [isScrollAtTop, setIsScrollAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the scroll position is at the top
      const atTop = window.scrollY === 0;
      setIsScrollAtTop(atTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`dropdown ${isOpen ? 'open' : 'closed'} ${isScrollAtTop ? '' : 'hidden'}`}>
      <button className={`dots-button ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <img src={isOpen ? dotsOpenImg : dotsClosedImg} alt="Dots Icon" />
      </button>
      {isOpen && (
        <>
          <button className={`reservations-button ${activeButton === 'reservations' || currentMode === 1 ? 'active' : ''}`} onClick={() => handleButtonClick('reservations', 1)}>
            <img src={activeButton === 'reservations' || currentMode === 1 ? reservationsOpenImg : reservationsClosedImg} alt="Reservations Icon" width="25px" color='black' />
          </button>
          <button className={`orders-button ${activeButton === 'orders' || currentMode === 2 ? 'active' : ''}`} onClick={() => handleButtonClick('orders', 2)}>
            <img src={activeButton === 'orders' || currentMode === 2 ? ordersOpenImg : ordersClosedImg} alt="Orders Icon" width="25px" color='black' />
          </button>
          <button className={`tables-button ${activeButton === 'tables' || currentMode === 3 ? 'active' : ''}`} onClick={() => handleButtonClick('tables', 3)}>
            <img src={activeButton === 'tables' || currentMode === 3 ? tablesOpenImg : tablesClosedImg} alt="Tables Icon" width="25px" color='black' />
          </button>
          <button className={`menu-button ${activeButton === 'menu' || currentMode === 4 ? 'active' : ''}`} onClick={() => handleButtonClick('menu', 4)}>
            <img src={activeButton === 'menu' || currentMode === 4 ? menuOpenImg : menuClosedImg} alt="Menu Icon" width="25px" color='black' />
          </button>
          <button className={`floorplan-button ${activeButton === 'floorplan' || currentMode === 5 ? 'active' : ''}`} onClick={() => handleButtonClick('floorplan', 5)}>
            <img src={activeButton === 'floorplan' || currentMode === 5 ? floorplanOpenImg : floorplanClosedImg} alt="Floorplan Icon" width="25px" color='black' />
          </button>
          <button className={`settings-button ${activeButton === 'settings' || currentMode === 6 ? 'active' : ''}`} onClick={() => handleButtonClick('settings', 6)}>
            <img src={activeButton === 'settings' || currentMode === 6 ? settingsOpenImg : settingsClosedImg} alt="Settings Icon" width="25px" color='black' />
          </button>
        </>
      )}
    </div>
  );
}

export default DropdownMenu;
