import React, { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './app';
import Login from './authentication/login/login';
import BookingList from './food_service/pages/booking_list/BookingList';
import Structure from './food_service/pages/structure/Structure';
import Edit from './food_service/pages/edit/Edit';
import Create from './food_service/pages/create/Create';
import Home from './employee/Home';
import Payment from './payment/payment';
import Receipt from './payment/receipt/receipt';
import PaymentMethod from './payment/paymentmethod/PaymentMethod'; // Ensure this path and name are correct
import SignUpPages from './authentication/Register/SignUpPages';
import Booking from './room/booking/pages/booking';
import CustomerCreate from './room/customer';
import UserCreate from './employee/UsersCreate';
import UsersUpdate from './employee/UsersUpdate';

const RouterComponent: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <SignUpPages />,
    },
    {
      path: '/login',
      element: <App />,
      children: [
        { path: 'dashboard', element: <h2>Dashboard Content</h2> },

        // Room
        { path: 'room', element: <Booking /> },
        { path: 'customer', element: <CustomerCreate /> },

        // Food Service
        { path: 'food-service', element: <BookingList /> },
        { path: 'food-service/structure/:bookingID', element: <Structure /> },
        { path: 'manage-data', element: <Edit /> },
        { path: 'manage-data/create-menu', element: <Create /> },

        // Employee
        { path: 'employee', element: <Home /> },
        { path: 'employee/create', element: <UserCreate /> },
        { path: 'employee/update/:id', element: <UsersUpdate /> },

        // Payment
        { path: 'payment', element: <Payment /> },
        { path: 'receipt', element: <Receipt /> },
        { path: 'paymentmethod', element: <PaymentMethod /> },
        { path: 'logout', element: <h2>Logout</h2> },
        { path: '*', element: <h2>404 - Not Found</h2> },
      ],
    },
  ]);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
};

export default RouterComponent;
