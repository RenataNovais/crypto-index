import React from 'react';

// Material UI styles.
import { createTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { deepOrange } from '@material-ui/core/colors';

// Globals.

// Simple email validator from "http://stackoverflow.com/questions/46155".
const EMAIL_RE = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const PASSWORD_RE = /^\d+$/;

export const NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  maximumFractionDigits: 2
})

const DEFAULT_THEME = createTheme();

const LIGHT_THEME = createTheme({
  palette: {
    primary: {
      main: '#f7931a'
    },

    secondary: {
      main: '#ac6612'
    },

    text: {
      primary: grey[800],
      secondary: grey[500],
      disabled: 'rgba(0, 0, 0, 0.15)'
    },

    background: {
      paper: '#ffff',
      default: '#ffff'
    },

    divider: grey[300]
  },

  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          minWidth: 320,
          minHeight: '100vh',

          '& > div': {
            minHeight: '100vh'
          }
        }
      }
    },

    MuiAlert: {
      icon: {
        marginRight: 20
      }
    },

    MuiBadge: {
      anchorOriginTopRightRectangle: {
        top: 0,
        right: '-10%',
        transform: 'scale(1) translate(50%, -50%)',
        transformOrigin: '100% 0%',

        '&$invisible': {
          transform: 'scale(0) translate(50%, -50%)'
        }
      }
    },

    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: DEFAULT_THEME.spacing(2)
        }
      }
    }
  }
});

const DARK_THEME = createTheme({
  palette: {
    type: 'dark',

    primary: {
      main: '#cac6bf'
    },

    secondary: {
      main: deepOrange[300]
    },

    text: {
      primary: '#cac6bf',
      secondary: '#aba398',
      disabled: '#393939'
    },

    background: {
      paper: '#181a1b',
      default: '#1b1d1e'
    }
  },

  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          minWidth: 320,
          minHeight: '100vh',

          '& > div': {
            minHeight: '100vh'
          }
        }
      }
    },

    MuiAlert: {
      icon: {
        marginRight: 20
      }
    },

    MuiAppBar: {
      colorPrimary: {
        color: '#e8e6e3',
        backgroundColor: deepOrange[900]
      }
    },

    MuiBadge: {
      anchorOriginTopRightRectangle: {
        top: 0,
        right: '-10%',
        transform: 'scale(1) translate(50%, -50%)',
        transformOrigin: '100% 0%',

        '&$invisible': {
          transform: 'scale(0) translate(50%, -50%)'
        }
      }
    },

    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: DEFAULT_THEME.spacing(2)
        }
      }
    }
  }
});

// Validations.
export const validateEmail = value => {
  return EMAIL_RE.test(value);
};

export const validatePassword = value => {
  return PASSWORD_RE.test(value);
}

// Common functions.
export const useThemeChooser = () => {
  const [theme, setTheme] = React.useState(LIGHT_THEME)

  const chooseTheme = name => {
    if (name === 'light') {
      setTheme(LIGHT_THEME);

      localStorage.setItem('user:themePreference', 'light');

    } else {
      setTheme(DARK_THEME);

      localStorage.setItem('user:themePreference', 'dark');
    }
  };

  return [theme, chooseTheme];
};
