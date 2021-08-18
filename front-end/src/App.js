// React e libs.
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Main components.
import * as common from './common';
import Provider from './provider/Provider';

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

  React.useEffect(() => {
    const themePreference = localStorage.getItem('user:themePreference');

    if (themePreference === 'light' || themePreference === 'dark') {
      chooseTheme(themePreference)
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Provider>
        <div className="App" style={{ margin: 0, padding: 0, maxHeight: '100vh' }}>
          <BrowserRouter>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/edit' component={EditCurrency} />
              <Route exact path='/' component={Home} />
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
