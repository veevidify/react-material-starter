import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from './layouts/Dashboard';
import Main from './layouts/Main';
import AccountView from './views/account';
import CustomerListView from './views/customers';
import DashboardView from './views/dashboard';
import LoginView from './views/auth/LoginView';
import NotFoundView from './views/errors/NotFoundView';
import ProductListView from './views/products';
import RegisterView from './views/auth/RegisterView';
import SettingsView from './views/settings';

import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  Icon as IconType,
} from 'react-feather';

interface RouteProps {
  href: string;
  path: string;
  title: string;
  Icon: IconType;
  Component: React.FC;
}

export const authed: RouteProps[] = [
  {
    href: '/app/dashboard',
    path: 'dashboard',
    Icon: BarChartIcon,
    title: 'Dashboard',
    Component: DashboardView,
  },
  {
    href: '/app/customers',
    path: 'customers',
    Icon: UsersIcon,
    title: 'Customers',
    Component: CustomerListView,
  },
  {
    href: '/app/products',
    path: 'products',
    Icon: ShoppingBagIcon,
    title: 'Products',
    Component: ProductListView,
  },
  {
    href: '/app/account',
    path: 'account',
    Icon: UserIcon,
    title: 'Account',
    Component: AccountView,
  },
  {
    href: '/app/settings',
    path: 'settings',
    Icon: SettingsIcon,
    title: 'Settings',
    Component: SettingsView,
  },
];

export const authenticatedRoutes = [
  {
    path: 'app',
    element: <Dashboard />,
    children: [
      ...(authed.map(({ path, Component }) => ({ path, element: <Component /> }))),
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> },
    ]
  },
  {
    path: '/',
    element: <Dashboard />,
    children: [
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export const guest: RouteProps[] = [
  {
    href: '/login',
    Icon: LockIcon,
    title: 'Login',
    path: 'login',
    Component: LoginView,
  },
  {
    href: '/register',
    Icon: UserPlusIcon,
    title: 'Register',
    path: 'register',
    Component: RegisterView,
  },
];

export const guestRoutes = [
  {
    path: '/',
    element: <Main />,
    children: [
      ...(guest.map(({ path, Component }) => ({ path, element: <Component /> }))),
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];
