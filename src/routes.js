import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import UserView from 'src/views/user/UserView';
import EstimatesView from 'src/views/estimate/EstimateView';
import UserDetail from './views/user/detail';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import {getCurrentUser} from './assets/login';

const userData = getCurrentUser() || null;
var progress = localStorage.getItem("progress") || null;
const routes = [
  {
    path: 'admin',
    element: <DashboardLayout />,
    children: [
      { path: 'user', element: userData ? <UserView />:<Navigate to="/login" /> },
      { path: 'estimates', element: userData ? <EstimatesView />:<Navigate to="/login" /> },
      { path: 'user/detail/:id', element: userData ? <UserDetail /> :<Navigate to="/login" /> }, 
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    children: [
      { path: 'app', element: userData ? <Navigate to="/admin/user" /> : <Navigate to="/login" />},
      { path: 'login', element: <LoginView /> },
      { path: '/', element: userData ?<Navigate to="/app" /> : <Navigate to="/login" />},
      { path: '404', element: <NotFoundView /> },      
      { path: '*', element: <Navigate to="/404" /> }  
    ]
  }
];

export default routes;
