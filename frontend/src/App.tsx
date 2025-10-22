import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './graphql/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ClaimsListGraphQL from './components/ClaimsListGraphQL';
import ClaimDetail from './components/ClaimDetail';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout pageTitle="Dashboard">
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/claims" element={
              <ProtectedRoute>
                <Layout pageTitle="Claims">
                  <ClaimsListGraphQL />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/claims/:id" element={
              <ProtectedRoute>
                <Layout pageTitle="Claim Detail">
                  <ClaimDetail />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;