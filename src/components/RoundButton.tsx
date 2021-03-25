import * as React from 'react';
import clsx from 'clsx';
import { styled, makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    borderRadius: 10,
  },
});

const RoundButton = ({ className, ...props }: any) => {
  const classes = useStyles();
  return <Button className={clsx(classes.root, className)} {...props} />;
}

export default RoundButton;
