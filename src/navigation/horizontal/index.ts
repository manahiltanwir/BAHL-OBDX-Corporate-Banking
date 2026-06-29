// ** Icon imports
// import Apps from 'mdi-material-ui/Apps'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'

// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    //Example Page
    {
      title: 'Example Page 1',
      icon: CurrencyUsd,
      path: '/category'
    },
    //Page with children example
    // {
    //   icon: Apps,
    //   title: 'Apps',
    //   children: [
    //     {
    //       title: 'Dashboard',
    //       icon: EmailOutline,
    //       path: '/apps/email'
    //     },
    //     {
    //       title: 'Client',
    //       icon: EmailOutline,
    //       path: '/apps/email'
    //     },
    //     {
    //       title: 'Employee',
    //       icon: EmailOutline,
    //       path: '/apps/email'
    //     },
    //     {
    //       title: 'Project',
    //       icon: EmailOutline,
    //       path: '/apps/email'
    //     },
    //     {
    //       title: 'Assignment',
    //       icon: EmailOutline,
    //       path: '/apps/email'
    //     },
    //     {
    //       title: 'Report',
    //       icon: EmailOutline,
    //       path: '/apps/email'
    //     }
    //   ]
    // }
  ]
}

export default navigation
