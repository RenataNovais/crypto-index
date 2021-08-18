import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

// Snackbar.
import { useSnackbar } from 'notistack';

// Material UI.
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

// Material UI icons.
import EditIcon from '@material-ui/icons/Edit';

import LogoComplete from '../img/logo_btc_complete.png';
import LogoLoading from '../img/logo_btc_loading.png';

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: theme.spacing(16, 'auto'),
    padding: theme.spacing(8),
    width: '90%',
    boxSizing: 'border-box',

    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(6, 'auto'),
      padding: theme.spacing(4),
    }
  },

  img: {
    maxWidth: '50%',

    [theme.breakpoints.down('sm')]: {
      maxWidth: '70%'
    }
  }
}));

const Home = () => {
  const [ theme, classes ] = [ useTheme(), useStyles() ];
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [ edit, setEdit ] = useState(false);
  const [ erro, setErro ] = useState({ type: 'waitingLogin', msg: '' });
  const [ currencies, setCurrencies ] = useState({});
  const [ bpi, setBpi ] = useState(null);
  const [ btc, setBtc ] = useState(1);

  const handleBtcChange = (e) => {
    setBtc(e.target.value)

    setCurrencies({
      usd: e.target.value * bpi.USD.rate_float,
      brl: e.target.value * bpi.BRL.rate_float,
      eur: e.target.value * bpi.EUR.rate_float,
      cad: e.target.value * bpi.CAD.rate_float
    })
  }

  const handleLoginError = (msg, type) => {
    const newErr = { type: 'authErr', msg };

    enqueueSnackbar(msg, {
      action: () => <Button color='secondary' variant='contained' size='small' onClick={ () =>  setErro(newErr) }>Logar</Button>,
      preventDuplicate: true,
      persist: true,
      variant: type
    });
  }

  useEffect(() => {
    async function getQuotation() {
      const auth = localStorage.getItem('user:AuthToken');

      if (auth) {
        setErro({ type: '', msg: '' });

        try {
          const req = await fetch('http://localhost:3001/api/crypto/btc', {
            method: 'GET',
            headers: {
              'Authorization': auth
            }
          })
          const json = await req.json();

          if (req.status !== 200) {
            throw new Error(json.message)
          }

          setBpi(json.bpi);

          setCurrencies({
            usd: json.bpi.USD.rate_float,
            brl: json.bpi.BRL.rate_float,
            eur: json.bpi.EUR.rate_float,
            cad: json.bpi.CAD.rate_float
          });

        } catch (err) {
          if (err.message === 'Token inválido') {
            handleLoginError(err.message, 'warning');

          } else {
            setErro({ type: 'reqFail', msg: err.message });
          }
        }

      } else {
        const msg = 'Usuário não autenticado.'

        handleLoginError(msg, 'warning');
      }
    }

    getQuotation();
  }, []);

  if (erro.type === 'reqFail') {
    enqueueSnackbar(erro.msg, {
      action: () => <Button color='primary' variant='contained' size='small' onClick={ () => window.location.reload() }>Atualizar</Button>,
      preventDuplicate: true,
      variant: 'error'
    })
  }

  if (erro.type === 'authErr') {
    closeSnackbar();

    return (
      <Redirect to='/login' />
    )
  }

  if (!bpi || !currencies) {
    return (
      <Container component='div'>
        <Paper className={ classes.paper } elevation={ 4 }>
          <img src={LogoLoading} alt='Carregando...' style={{ width: '20%', marginBottom: theme.spacing(2) }} />
          {erro.type === 'waitingLogin' ? (
            <Typography variant='h5'>Aguarde, estamos carregando!</Typography>

          ) : (
            <Typography variant='h5'>Aguarde, estamos carregando as cotações!</Typography>
          )}
        </Paper>
      </Container>
    )
  }

  if (edit && bpi) {
    return (
      <Redirect to={{ pathname: '/edit', bpi }} />
    )
  }

  return(
    <Container component='div'>
      <Paper className={ classes.paper } elevation={ 4 }>
        <div style={{ width: '100%', textAlign: 'right' }}>
          <Button variant='contained' color='primary' startIcon={<EditIcon />} onClick={() => setEdit(true) }>Alterar</Button>
        </div>
        <img className={ classes.img } src={LogoComplete} alt='Logo Bitcoin' />

        <Grid container spacing={ 2 } style={{ marginBottom: theme.spacing(6) }}>
          <Grid item xs={ 12 } style={{ marginBottom: theme.spacing(6), marginTop: theme.spacing(3) }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '40%', margin: '0 auto' }}>
              <TextField variant='outlined' size='medium' type='number' label='BTC' value={ btc } onChange={ (e) => handleBtcChange(e) } />

              <Typography variant='caption'>Digite aqui o valor em BTC</Typography>
            </div>
          </Grid>

          <Grid item xs={ 12 } md={ 3 }>
            <TextField variant='standard' size='small' inputProps={{ readOnly: true }} label='USD' value={ currencies.usd } />
          </Grid>

          <Grid item xs={ 12 } md={ 3 }>
            <TextField variant='standard' size='small' inputProps={{ readOnly: true }} label='BRL' value={ currencies.brl } />
          </Grid>

          <Grid item xs={ 12 } md={ 3 }>
            <TextField variant='standard' size='small' inputProps={{ readOnly: true }} label='EUR' value={ currencies.eur } />
          </Grid>

          <Grid item xs={ 12 } md={ 3 }>
            <TextField variant='standard' size='small' inputProps={{ readOnly: true }} label='CAD' value={ currencies.cad } />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Home;
