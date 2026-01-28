import Login from '@/app/login';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-native-safe-area-context', () => {
return {
    SafeAreaProvider: ({ children }: any) => children,
};
});

jest.mock('expo-router', () => ({
useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
}),
}));

jest.mock('../src/context/AuthContext', () => ({
useAuth: () => ({
    login: jest.fn(),
    loading: false,
}),
}));

describe('<Login />', () => {
    it('renders login inputs', () => {
        const { getByText, getByPlaceholderText } = render(<Login />);
        expect(getByText('Login')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Kirjaudu sisään')).toBeTruthy();
    });

    it('shows error when fields are empty and login is pressed', () => {
        const { getByText } = render(<Login />);
        const loginButton = getByText('Kirjaudu sisään');
        fireEvent.press(loginButton);
        expect(getByText('Täytä kaikki kentät')).toBeTruthy();
    });

    it('changes button text when loading', () => {
        const authModule = require('../src/context/AuthContext');
        jest.spyOn(authModule, 'useAuth').mockReturnValue({
            login: jest.fn(),
            loading: true,
        });
        const { getByText } = render(<Login />);
        expect(getByText('Kirjaudutaan sisään...')).toBeTruthy();
    });

});

describe('Login Function', () => {
    it('calls login function with correct credentials', () => {
        const mockLogin = jest.fn().mockResolvedValue(undefined);
        const authModule = require('../src/context/AuthContext');
        jest.spyOn(authModule, 'useAuth').mockReturnValue({
            login: mockLogin,
            loading: false,
        });
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByText('Kirjaudu sisään');
        fireEvent.changeText(emailInput, 'email');
        fireEvent.changeText(passwordInput, 'password');
        fireEvent.press(loginButton);
        expect(mockLogin).toHaveBeenCalledWith('email', 'password');
    });

    it('displays error message when login fails with incorrect password', async () => {
        const mockLogin = jest.fn().mockRejectedValue(
            new Error('The password is invalid')
        );
        const authModule = require('../src/context/AuthContext');
        jest.spyOn(authModule, 'useAuth').mockReturnValue({
            login: mockLogin,
            loading: false,
        });

        const { getByPlaceholderText, getByText, queryByText } = render(<Login />);
        expect(queryByText('Virhe kirjautumisessa: tarkista sähköposti ja salasana')).toBeNull();
        const loginButton = getByText('Kirjaudu sisään');
        fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(getByText('Virhe kirjautumisessa: tarkista sähköposti ja salasana')).toBeTruthy();
        });
    });

});

afterEach(() => {
    jest.restoreAllMocks();
});