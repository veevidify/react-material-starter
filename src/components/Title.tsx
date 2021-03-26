import Typography from '@material-ui/core/Typography';

interface TitleProps {
  children?: React.ReactNode;
}

const Title: React.FC<TitleProps> = (props) => {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

export default Title;
