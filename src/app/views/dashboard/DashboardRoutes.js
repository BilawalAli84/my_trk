import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import Reporting from 'app/views/dashboard/Reporting';
import Tracking from 'app/views/dashboard/Tracking';
import Domain from 'app/views/dashboard/Domain';
import Conversion from 'app/views/dashboard/Conversion';
import UrlRules from 'app/views/dashboard/UrlRules';

const Analytics = Loadable(lazy(() => import('./Analytics')));

const dashboardRoutes = [
  { path: '/dashboard', element: <Analytics />, auth: authRoles.guest },
  {
    path: '/reporting',
    element: <Reporting />
  },
  {
    path: '/tracking',
    element: <Tracking />
  },
  {
    path: '/domain',
    element: <Domain />
  },
  {
    path: '/conversion',
    element: <Conversion />
  },
  {
    path: '/url_rules',
    element: <UrlRules />
  },
  
];

export default dashboardRoutes;
