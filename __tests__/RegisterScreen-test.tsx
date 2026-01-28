import Register from '@/app/register';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }: any) => children,
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
}));

jest.mock('../src/context/AuthContext', () => ({
    useAuth: () => ({
        register: jest.fn(),
        loading: false,
    }),
}));

describe('<Register />', () => {
    it('renders Register text', () => {
        const { getByText } = render(<Register />);
        expect(getByText('Register')).toBeTruthy();
    });

    it('renders inputs and button', () => {
        const { getByPlaceholderText, getByText } = render(<Register />);
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('First Name')).toBeTruthy();
        expect(getByPlaceholderText('Last Name')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
        expect(getByText('Luo käyttäjä')).toBeTruthy();
    });

    it('shows error when fields are empty and register attempted', () => {
        const { getByText } = render(<Register />);
        const button = getByText('Luo käyttäjä');
        fireEvent.press(button);
        expect(getByText('Täytä kaikki kentät')).toBeTruthy();
    });

    it('changes button text when loading', () => {
        const authModule = require('../src/context/AuthContext');
        jest.spyOn(authModule, 'useAuth').mockReturnValue({
            register: jest.fn(),
            loading: true,
        });
        const { getByText } = render(<Register />);
        expect(getByText('Luodaan käyttäjää...')).toBeTruthy();
    });

    it('shows error when passwords do not match', () => {
        const { getByPlaceholderText, getByText } = render(<Register />);
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@email.com');
        fireEvent.changeText(getByPlaceholderText('First Name'), 'First');
        fireEvent.changeText(getByPlaceholderText('Last Name'), 'Last');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password1');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password2');
        fireEvent.press(getByText('Luo käyttäjä'));
        expect(getByText('Salasanat eivät täsmää')).toBeTruthy();
    });

});

describe('Register Function', () => {
    it('calls register function with correct credentials', () => {
        const mockRegister = jest.fn().mockResolvedValue(undefined);
        const authModule = require('../src/context/AuthContext');
        jest.spyOn(authModule, 'useAuth').mockReturnValue({
            register: mockRegister,
            loading: false,
        });

        const { getByPlaceholderText, getByText } = render(<Register />);
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@email.com');
        fireEvent.changeText(getByPlaceholderText('First Name'), 'First');
        fireEvent.changeText(getByPlaceholderText('Last Name'), 'Last');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password');
        fireEvent.press(getByText('Luo käyttäjä'));

        expect(mockRegister).toHaveBeenCalledWith('test@email.com', 'password', 'First', 'Last');
    });

    it('displays error message when registration fails with duplicate email', async () => {
        const mockRegister = jest.fn().mockRejectedValue(
            new Error('The email address is already in use by another account.')
        );
        const authModule = require('../src/context/AuthContext');
        jest.spyOn(authModule, 'useAuth').mockReturnValue({
            register: mockRegister,
            loading: false,
        });

        const { getByPlaceholderText, getByText, queryByText } = render(<Register />);
        
        expect(queryByText('The email address is already in use by another account.')).toBeNull();
        
        fireEvent.changeText(getByPlaceholderText('Email'), 'existing@example.com');
        fireEvent.changeText(getByPlaceholderText('First Name'), 'First');
        fireEvent.changeText(getByPlaceholderText('Last Name'), 'Last');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password');
        fireEvent.press(getByText('Luo käyttäjä'));

        await waitFor(() => {
            expect(getByText('The email address is already in use by another account.')).toBeTruthy();
        });
    });

    it('displays error message when registration fails with weak password', async () => {
        const mockRegister = jest.fn().mockRejectedValue(
            new Error('Password should be at least 6 characters.')
        );
        const authModule = require('../src/context/AuthContext');
        jest.spyOn(authModule, 'useAuth').mockReturnValue({
            register: mockRegister,
            loading: false,
        });

        const { getByPlaceholderText, getByText, queryByText } = render(<Register />);
        
        expect(queryByText('Password should be at least 6 characters.')).toBeNull();
        
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('First Name'), 'First');
        fireEvent.changeText(getByPlaceholderText('Last Name'), 'Last');
        fireEvent.changeText(getByPlaceholderText('Password'), 'pass');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'pass');
        fireEvent.press(getByText('Luo käyttäjä'));

        await waitFor(() => {
            expect(getByText('Password should be at least 6 characters.')).toBeTruthy();
        });
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});
