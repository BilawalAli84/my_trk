import AuthGuard from 'app/auth/AuthGuard';
// import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import Reporting from 'app/views/dashboard/Reporting';
// import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [...dashboardRoutes],
  },
  // {
  //   path: '/reporting',
  //   element: (
  //     <AuthGuard>
  //       <MatxLayout />
  //     </AuthGuard>
  //   )
  // },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="dashboard" /> },
  // {
  //   path: '/reporting',
  //   element: <Reporting/>,
  // },
  { path: '*', element: <NotFound /> },
];

export default routes;
