declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      dark: string
      main: string
      light: string
      bodyBg: string
      darkBg: string
      lightBg: string
      tooltipBg: string
      tableHeaderBg: string
      deep: string,
      mid: string,
      bright: string,
      gold: string,
      goldSoft: string,
    }
  }
  interface PaletteOptions {
    customColors?: {
      dark?: string
      main?: string
      light?: string
      bodyBg?: string
      darkBg?: string
      lightBg?: string
      tooltipBg?: string
      tableHeaderBg?: string
    }
  }
}

export { }
