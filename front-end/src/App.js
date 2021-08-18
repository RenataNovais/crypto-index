// React e libs.
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

// Main components.
import * as common from './common';

// Pages.
import Home from './pages/home';
import Login from './pages/login';
import EditCurrency from './pages/editCurrency.js';

// Material UI.
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

// Styles.
import './App.css';

function App() {
  const [theme, chooseTheme] = common.useThemeChooser();

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
        <CssBaseline />

        <div className="App" style={{ margin: 0, padding: 0, maxHeight: '100vh' }}>
          <BrowserRouter>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/edit' component={EditCurrency} />
              <Route exact path='/' component={Home} />
            </Switch>
          </BrowserRouter>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
