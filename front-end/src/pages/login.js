// React and libs.
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

// Snackbar.
import { useSnackbar } from 'notistack';

// Material UI.
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

// Material UI icons.
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import * as common from '../common';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      margin: 0,
      maxHeight: '100vh',
      '> div': {
        maxHeight: '100vh'
      }
    }
  },

  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: theme.spacing(20, 'auto'),
    padding: theme.spacing(8, 30),
    width: '90%',

    [theme.breakpoints.down('sm')]: {
      maxHeight: '85vh',
      margin: theme.spacing(6, 'auto'),
      padding: theme.spacing(4),
    }
  },
  avatar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  }
}));

const Login = () => {
  const [ theme, classes ] = [ useTheme(), useStyles() ];
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [ erro, setErro ] = useState({ type: 'waitingLogin', msg: '' });
  const [ enabled, setEnabled ] = useState(false);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ erroEmail, setErroEmail ] = useState('');
  const [ erroPassword, setErroPassword ] = useState('');

  const handleLoginError = (msg, type) => {
    const newErr = { type: 'authErr', msg };

    enqueueSnackbar(msg, {
      action: () => <Button color='primary' variant='outlined' size='small' onClick={ () =>  setErro(newErr) }>Atualizar</Button>,
      preventDuplicate: true,
      variant: type
    });
  }

  const requestLogin = async () => {
    if (!common.validateEmail(email) && !common.validatePassword(password)) {
      setErroEmail('O email é obrigatório e deve ser válido (exemplo@exemplo.com).');
      setErroPassword('A senha é obrigatória e deve conter 6 números.');

    } else if (!common.validateEmail(email)) {
      setErroEmail('O email é obrigatório e deve ser válido (exemplo@exemplo.com).');
      setErroPassword('');

    } else if (!common.validatePassword(password)) {
      setErroPassword('A senha é obrigatória e deve conter 6 números.');
      setErroEmail('');

    } else {
      try {
        const req = await fetch(`http://localhost:3001/api/login`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        const json = await req.json();

        if (req.status !== 200) {
          throw new Error(json.message)
        }

        if (json.token) {
          localStorage.setItem('user:AuthToken', json.token)

          setEnabled(true);
        }

      } catch (err) {
        handleLoginError(err.message, 'error');
      }
    }

  }

  if (erro.type === 'authErr') {
    closeSnackbar();

    return window.location.reload();
  }

  if (enabled) {
    return (
      <Redirect to='/' />
    )
  }

  return (
    <Container component='main'>
      <Paper className={ classes.paper } elevation={ 4 }>
        <Avatar className={ classes.avatar }>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5" style={{ marginBottom: theme.spacing(2) }}>Entrar</Typography>

        <TextField
          required
          autoFocus
          variant='outlined'
          margin='normal'
          id='email'
          label='Email'
          name='email'
          type='email'
          style={{ width: '80%' }}
          error={ erroEmail !== '' }
          helperText={ erroEmail }
          value={email}
          onChange={ e => setEmail(e.target.value) }
        />

        <TextField
          required
          variant='outlined'
          margin='normal'
          id='password'
          label='Senha'
          name='password'
          type='password'
          style={{ width: '80%' }}
          error={ erroPassword !== '' }
          helperText={ erroPassword }
          inputProps={{ maxLength: 6 }}
          value={password}
          onChange={ e => setPassword(e.target.value) }
        />

        <Button
          variant='contained'
          color='primary'
          style={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(4) }}
          onClick={() => requestLogin()}
          disabled={ !email || !password || password.length < 6 }
        >
          Entrar
        </Button>
      </Paper>
    </Container>
  )
}

export default Login;
