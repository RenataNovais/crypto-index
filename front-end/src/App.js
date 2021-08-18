// React e libs.
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Main components.
import * as common from './common';
import Provider from './provider/Provider';

// Pages.
import Home from './pages/home';
import Login from './pages/login';

// Material UI.
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, useTheme } from '@material-ui/core/styles';

// Styles.
import './App.css';

function App() {
  const [ theme, chooseTheme ] = common.useThemeChooser();

  React.useEffect(() => {
    const themePreference = localStorage.getItem('user:themePreference');

    if (themePreference === 'light' || themePreference === 'dark') {
      chooseTheme(themePreference)
    }
  });

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />

      <Provider>
        <div className="App">
          <BrowserRouter>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/' component={Home} />
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
