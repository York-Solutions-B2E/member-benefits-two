// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the API service
jest.mock('./services/api', () => ({
    authApi: {
        getCurrentUser: jest.fn(),
        logout: jest.fn(),
    },
    dashboardApi: {
        getDashboardData: jest.fn(),
    },
    default: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/' }),
}));