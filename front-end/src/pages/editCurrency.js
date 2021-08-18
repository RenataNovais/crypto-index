import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

// Snackbar.
import { useSnackbar } from 'notistack';

// Material UI.
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

// Material UI icons.
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import LogoComplete from '../img/logo_btc_complete.png';

const currencies = [
  {
    value: 'BRL',
    label: 'Real (R$)',
    prefix: 'R$',
  },
  {
    value: 'EUR',
    label: 'Euro (€)',
    prefix: '€',
  },
  {
    value: 'CAD',
    label: 'Dolar Canadense ($)',
    prefix: '$',
  },
];

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: theme.spacing(20, 'auto'),
    padding: theme.spacing(8),
    width: '90%',

    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(6, 'auto'),
      padding: theme.spacing(4),
    }
  },

  img: {
    maxWidth: '100%'
  }
}));

const EditCurrency = (props) => {
  const [ theme, classes ] = [ useTheme(), useStyles() ];
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [ erro, setErro ] = useState({ type: '', msg: '' });
  const [ redirectHome, setRedirectHome ] = useState(false);
  const [ newCurrency, setNewCurrency ] = useState(0);
  const [currency, setCurrency] = useState('BRL');

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleError = (msg, type) => {
    const newErr = { type: 'reqErr', msg };

    enqueueSnackbar(msg, {
      action: () => <Button color='primary' variant='outlined' size='small' onClick={ () =>  setErro(newErr) }>Atualizar</Button>,
      preventDuplicate: true,
      persist: true,
      variant: type
    });
  }

  const updateCurrency = async () => {
    try {
      const req = await fetch(`http://localhost:3001/api/crypto/btc`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currency, value: newCurrency })
      });
      const json = await req.json();

      if (req.status !== 200) {
        throw new Error(json.message)
      }

      if (json.message === 'Valor alterado com sucesso!') {
        setRedirectHome(true);
      }

    } catch (err) {
      handleError(err.message, 'error');
    }
  }

  if (redirectHome || erro.type !== '' || !props.location.bpi) {
    if (erro.type !== '') {
      closeSnackbar();
    }

    return (
      <Redirect to='/' />
    )
  }

  return(
    <Container component='div'>
      <Paper className={ classes.paper } elevation={ 4 }>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Button
            variant='text'
            color='primary'
            style={{ width: '20%' }}
            startIcon={<ArrowBackIcon />} onClick={() => setRedirectHome(true) }
          >
            <img className={ classes.img } src={LogoComplete} alt='Logo Bitcoin' />
          </Button>
        </div>

        <Typography variant='h6' style={{ margin: theme.spacing(3, 0)}}>Alterar valor da cotação de uma moeda</Typography>

        <Grid container spacing={ 2 } style={{ marginBottom: theme.spacing(6) }}>
          <Grid item xs={ 12 } md={ 6 } style={{ margin: theme.spacing(3, 0) }}>
            <TextField
              id="standard-select-currency"
              select
              label="Moeda"
              value={currency}
              onChange={handleChange}
              helperText="Por favor, selecione sua moeda"
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={ 12 } md={ 6 } style={{ margin: theme.spacing(3, 0) }}>
            <TextField
              variant='standard'
              inputProps={{ readOnly: true }}
              label='Valor atual'
              value={ `${currencies.find(x => x.value === currency).prefix} ${props.location.bpi[currency].rate_float / props.location.bpi.USD.rate_float }` }
            />
          </Grid>

          <Grid item xs={ 12 } style={{ margin: theme.spacing(3, 0) }}>
            <TextField variant='outlined' type='number' label='Novo valor' value={ newCurrency } onChange={(e) => setNewCurrency(e.target.value)} />
          </Grid>

          <Grid item xs={ 12 } style={{ margin: theme.spacing(1, 0) }}>
            <Button variant='contained' color='primary' onClick={updateCurrency}>Atualizar</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default EditCurrency;
