import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { AppBar, Box, Hidden, IconButton, Toolbar, makeStyles } from '@material-ui/core';
import Logo from '../../components/Logo';
import { guest } from '../../route';

const useStyles = makeStyles({
  root: {},
  toolbar: {
    height: 64,
  },
});

interface Props {
  className?: string;
}

const TopBar: React.FC<Props> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Hidden mdDown>
          {guest.map(({ title, href, Icon }) => (
            <IconButton key={title} color="inherit" href={href}>
              <Icon />
            </IconButton>
          ))}
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
