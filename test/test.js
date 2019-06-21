'use strict';
const expect       = require( 'chai' ).expect;
const EventManager = require( './../lib/index.js' ).EventManager;

const shouldCreateTheManager = () => {
  return it( 'Should create a manager object', () => {
    const eventManager = new EventManager();
    const exists       = !!(eventManager.event);
    expect( exists ).to.equal( true );
  } );
};

const mustCallEventMultipleTimes = () => {
  let counter = 0;

  const eventListener = () => {
    counter++;
  };

  return it( 'Must call event listener multiple times', () => {
    const eventManager = new EventManager();
    eventManager.addEventListener( 'test', 'test', eventListener );

    const maxCall = Math.floor( Math.random() * 20 ) + 5;
    for (let i = 0; i < maxCall; i++) {
      eventManager.event( 'test', 'test' );
    }

    expect( counter === maxCall ).to.equal( true );
  } );
};

const mustCallEventOnce = () => {
  let counter = 0;

  const eventListener = () => {
    counter++;
  };

  return it( 'Must call event listener only once', () => {
    const eventManager = new EventManager();
    eventManager.addEventListener( 'test', 'test', eventListener, true );

    const maxCall = Math.floor( Math.random() * 20 ) + 5;
    for (let i = 0; i < maxCall; i++) {
      eventManager.event( 'test', 'test' );
    }

    expect( counter === 1 ).to.equal( true );
  } );
};

const mustNotCallTheEventMoreThanOnceA = () => {
  let counter = 0;

  const eventListener = () => {
    counter++;
  };

  return it( 'Must not call event listener after removal (removeEventListener)', () => {
    const eventManager = new EventManager();
    eventManager.addEventListener( 'test', 'test', eventListener, true );
    eventManager.event( 'test', 'test' );
    eventManager.removeEventListener( 'test', 'test', eventListener );
    eventManager.event( 'test', 'test' );

    expect( counter === 1 ).to.equal( true );
  } );
};

const mustNotCallTheEventMoreThanOnceB = () => {
  let counter = 0;

  const eventListener = () => {
    counter++;
  };

  return it( 'Must not call event listener after removal (removeListener)', () => {
    const eventManager = new EventManager();
    eventManager.addEventListener( 'test', 'test', eventListener, true );
    eventManager.event( 'test', 'test' );
    eventManager.removeListener( eventListener );
    eventManager.event( 'test', 'test' );

    expect( counter === 1 ).to.equal( true );
  } );
};

describe( 'Event Manager Test', () => {
  shouldCreateTheManager();
  mustCallEventMultipleTimes();
  mustCallEventOnce();
  mustNotCallTheEventMoreThanOnceA();
  mustNotCallTheEventMoreThanOnceB();
} );
