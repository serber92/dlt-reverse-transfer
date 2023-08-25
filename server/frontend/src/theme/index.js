import { createMuiTheme } from '@material-ui/core/styles'
import overrides from './overrides';

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#005A4E' },
  },
  overrides,
});

export default theme;
