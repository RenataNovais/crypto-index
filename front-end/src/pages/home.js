import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

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
    margin: theme.spacing(20, 'auto'),
    padding: theme.spacing(8),
    width: '90%',

    [theme.breakpoints.down('sm')]: {
      maxHeight: '85vh',
      margin: theme.spacing(6, 'auto'),
      padding: theme.spacing(4),
    }
  },

  img: {
    maxWidth: '65%'
  }
}));

const Home = () => {
  const [ theme, classes ] = [ useTheme(), useStyles() ];
  const [ edit, setEdit ] = useState(false);
  const [ bpi, setBpi ] = useState(null);
  const [ btc, setBtc ] = useState(1);
  const [ usd, setUsd ] = useState(0);
  const [ brl, setBrl ] = useState(0);
  const [ eur, setEur ] = useState(0);
  const [ cad, setCad ] = useState(0);

  const handleBtcChange = (e) => {
    setBtc(e.target.value)

    setUsd(e.target.value * bpi.USD.rate_float);
    setBrl(e.target.value * bpi.BRL.rate_float);
    setEur(e.target.value * bpi.EUR.rate_float);
    setCad(e.target.value * bpi.CAD.rate_float);
  }

  useEffect(() => {
    async function getQuotation() {
      const auth = localStorage.getItem('user:AuthToken');

      if (auth) {
        const req = await fetch('http://localhost:3001/api/crypto/btc', {
          method: 'GET',
          headers: {
            'Authorization': auth
          }
        })
        const json = await req.json();

        setBpi(json.bpi);

        setUsd(json.bpi.USD.rate_float);
        setBrl(json.bpi.BRL.rate_float);
        setEur(json.bpi.EUR.rate_float);
        setCad(json.bpi.CAD.rate_float);

      } else {
        console.log('Usuário não autenticado.') // FIXME: Criar diálogo de erro.
      }
    }

    getQuotation();
  }, [])

  if (!bpi) {
    return (
      <Container component='div'>
        <Paper className={ classes.paper } elevation={ 4 }>
          <img src={LogoLoading} alt='Carregando...' style={{ width: '20%', marginBottom: theme.spacing(2) }} />
          <Typography variant='h5'>Aguarde, estamos carregando as cotações!</Typography>
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
            <TextField variant='standard' size='small' inputProps={{ readOnly: true }} label='USD' value={ usd } />
          </Grid>

          <Grid item xs={ 12 } md={ 3 }>
            <TextField variant='standard' size='small' inputProps={{ readOnly: true }} label='BRL' value={ brl } />
          </Grid>

          <Grid item xs={ 12 } md={ 3 }>
            <TextField variant='standard' size='small' inputProps={{ readOnly: true }} label='EUR' value={ eur } />
          </Grid>

          <Grid item xs={ 12 } md={ 3 }>
            <TextField variant='standard' size='small' inputProps={{ readOnly: true }} label='CAD' value={ cad } />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Home;
