import { render, screen } from '@testing-library/react';
import { Login } from '../Login' 

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
        
     });
})

/* test('should make password visible after clicking on checkbox',
 async () => { 

  }) */