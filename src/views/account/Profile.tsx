import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { format } from 'date-fns-tz';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';

import { useStore } from '../../overmind';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

interface Props {
  className?: string;
}

const Profile: React.FC<Props> = ({ className, ...rest }) => {
  const classes = useStyles();

  const { auth } = useStore();
  const user = auth.user;

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        {user && (
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Avatar
              className={classes.avatar}
              src={user.avatar_url ?? ''}
            />
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h3"
            >
              {user.name}
            </Typography>
            <Typography
              className={classes.root}
              color="textSecondary"
              variant="body1"
            >
              {format(new Date(), 'hh:mm', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
            </Typography>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="primary"
          fullWidth
          variant="text"
        >
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
