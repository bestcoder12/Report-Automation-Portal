import { render, screen } from '@testing-library/react';
import { SideBar }  from '../SideBar';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Render sidebar correctly', () => { 
    
    const MockSideBar = () => {
        <Router>
            <SideBar />
        </Router>
    }

    test('should render hamburger icon', async () => { 
        render(<MockSideBar />)
        const iconElement = screen.getByTestId('hamIcon')
        
        //expect(iconElement).toBeVisible()
     });
 })