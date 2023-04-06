import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '../Login';
import { act } from 'react-dom/test-utils';

describe('Render Login form elements', () => { 

    test('should render textbox for username', () => { 
        render(<Login />)
        const usernameElement = screen.getByLabelText(/username/i)
        expect(usernameElement).toBeInTheDocument()
    });

    test('should render textbox for password', () => { 
        render(<Login />)
        const passwrdElement = screen.getByLabelText(/password/i)
        expect(passwrdElement).toBeInTheDocument()
     });

     test('should render checkbox for show password', () => {
        render(<Login />)
        const chkboxElement = screen.getByRole("checkbox")
        expect(chkboxElement).toBeInTheDocument()
     });

     test('should render log in button', () => {
        render(<Login />)
        const loginButtonElement = screen.getByRole("button")
        expect(loginButtonElement).toBeInTheDocument()    
    });
})

describe('Input for username and password', () => {

    test('should be able to input username', async () => { 
        const user = userEvent.setup()
        render(<Login />)
        const usernameElement = await screen.findByLabelText(/username/i)
        await act(async () => {
            await user.type(usernameElement, 'testuser')
        });
        expect(usernameElement).toHaveValue('testuser')
     });

     test('should be able to input password', async () => { 
        const user = userEvent.setup()
        render(<Login />)
        const passwordElement = await screen.findByLabelText(/password/i)
        await act(async () => {
            await user.type(passwordElement, 'testpass')
        });
        expect(passwordElement).toHaveValue('testpass')
     });
})

const passVisibility = async (user, passwordInputElement, showPasswrdElement, type1, type2) => {
    expect(passwordInputElement).toHaveProperty('type', type1)
    await act(async () => {
        await user.click(showPasswrdElement)
    });
    expect(passwordInputElement).toHaveProperty('type', type2)
}

describe('Show password functionality', () => { 

    test('should toggle password visibility when checkbox clicked', async () => { 
        const user = userEvent.setup()
        render(<Login />)
        const showPasswrdElement = screen.getByRole('checkbox')
        const passwordInputElement = await screen.findByLabelText(/password/i)
        await passVisibility(user, passwordInputElement, showPasswrdElement, 'password', 'text')
        await passVisibility(user, passwordInputElement, showPasswrdElement, 'text', 'password')
    });
 })

describe('Login authentication', () => { 
    
    
    
    test('Username and password sent to database', async () => { 

    });

 })
