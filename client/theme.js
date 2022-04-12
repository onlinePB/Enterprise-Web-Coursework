import { createTheme } from '@material-ui/core/styles'
import { pink } from '@material-ui/core/colors'

const theme = createTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
      light: '#5c67a3',
      main: '#3f4771',
      dark: '#2e355b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#00faaf',
      main: '#00c78b',
      dark: '#007a55',
      contrastText: '#000',
    },
      openTitle: '#3f4771',
      protectedTitle: pink['400'],
      type: 'light'
    }
  });

  export default theme
