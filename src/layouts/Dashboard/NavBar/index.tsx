import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
} from '@material-ui/core';
import NavItem from './NavItem';

import { authed } from '../../../route';
import { useStore } from '../../../overmind';

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
  spacedText: {
    marginTop: 10,
    marginBottom: 10,
  },
}));

interface Props {
  onMobileClose: () => void;
  openMobile: boolean;
}

const NavBar: React.FC<Props> = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  const { auth } = useStore();
  const user = auth.user;

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      {user && (
        <Box alignItems="center" display="flex" flexDirection="column" p={2}>
          <Avatar
            className={classes.avatar}
            component={RouterLink}
            src={user.avatar_url ?? ''}
            to="/app/account"
          />
          <Typography className={classes.spacedText} color="textPrimary" variant="h5">
            {user.name}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {user.location ?? user.login ?? ''}
          </Typography>
        </Box>
      )}

      <Divider />
      <Box p={2}>
        <List>
          {authed.map(({ href, title, Icon }) => (
            <NavItem href={href} key={title} title={title} icon={Icon} />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer anchor="left" classes={{ paper: classes.desktopDrawer }} open variant="persistent">
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default NavBar;
