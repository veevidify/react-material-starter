import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';

import GithubLogo from '../../icons/Github';
import Page from '../../components/Page';

import { useActions } from '../../overmind';
import config from '../../config';

import { User as UserIcon } from 'react-feather';
import { IDP_TYPE } from '../../overmind/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { auth: authActions } = useActions();

  // if redirected with code
  // determine if it comes from github or idp
  // get token from api via proxy
  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes('?code=');
    if (hasCode) {
      const urlReplace = url.split('?code=');
      const code = urlReplace[1];

      const idp: IDP_TYPE = url.includes('/github') ? 'github' : 'custom';

      authActions.authenticateWithCode({
        idp,
        code,
        callback: () => {
          console.log('=> login callback');
          navigate('/app/dashboard');
        },
      });
    }
  }, [authActions, navigate]);

  return (
    <Page className={classes.root} title="Login">
      <Box display="flex" flexDirection="column" height="100%" justifyContent="center">
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: 'a@b.c',
              password: '123456',
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
              password: Yup.string().max(255).required('Password is required'),
            })}
            onSubmit={(values, _actions) => {
              console.log('== formik submit');
              authActions.login({
                username: values.email,
                password: values.password,
                callback: () => {
                  console.log('=> login callback');
                  navigate('/app/dashboard');
                },
              });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Sign in
                  </Typography>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Sign in on the internal platform
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Button
                      color="primary"
                      fullWidth
                      startIcon={<GithubLogo />}
                      href={config.githubOAuthUrl}
                      type="submit"
                      size="large"
                      variant="contained"
                    >
                      Login with Github
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      color="primary"
                      fullWidth
                      startIcon={<UserIcon />}
                      href={config.customOAuthUrl}
                      type="submit"
                      size="large"
                      variant="contained"
                    >
                      Login with Our IDP
                    </Button>
                  </Grid>
                </Grid>
                <Box mt={3} mb={1}>
                  <Typography align="center" color="textSecondary" variant="body1">
                    or login with email address
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Don&apos;t have an account?{' '}
                  <Link component={RouterLink} to="/register" variant="h6">
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
