import { render, screen } from '@testing-library/react';
import { SideBar }  from '../SideBar';
import { SidebarContent } from '../SidebarContent';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Render sidebar correctly', () => { 
    
    const MockSideBar = () => {
        <Router>
            <SideBar content={SidebarContent} />
        </Router>
    }

    test('should render hamburger icon', async () => { 
        const sdbr = render(<MockSideBar />)
        //const iconElement = screen.getByTestId('hamIcon')
        
        //expect(iconElement).toBeVisible()
     });
 })