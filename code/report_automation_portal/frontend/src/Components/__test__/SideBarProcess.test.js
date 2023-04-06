import { render, screen } from '@testing-library/react';
import { SideBarProcess } from '../SideBarProcess';
import { BrowserRouter as Router } from 'react-router-dom'

describe('Render options', () => { 

    const MockSideBarProcess = (mockOpt, mockKey) => {
        <Router>
            <SideBarProcess menuopt={mockOpt} menukey={mockKey}/>
        </Router>
    }

    test('should have text for option', async () => { 
        const optList = [
            {
                title: 'Test1',
                path: '#',
                icon: '',
            }
        ]
        const keyOpts = optList.indexOf(0).title

        render(<MockSideBarProcess mockOpt={optList} keyOpts={keyOpts} />)
        const textElement = await screen.findAllByText(optList.indexOf(0).title)
        expect(textElement).toBeInTheDocument()
     })
 })