import {} from 'react'
import type { CSSProp } from 'styled-components'
declare module 'react' {
  interface Attributes {
    css?: CSSProp | undefined
  }
}

// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;
    colors: {
      main: string;
      secondary: string;
    };
  }
}
