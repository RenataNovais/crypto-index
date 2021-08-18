import React, { useState, useEffect } from 'react';
import Context from '../context/Context';

export default function Provider(props) {
  const state = {

  }


  return (
    <Context.Provider value={state}>
      {props.children}
    </Context.Provider>
  );
};
