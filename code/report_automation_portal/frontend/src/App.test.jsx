import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

const MockApp = () => {
  <Router>
    <App />
  </Router>;
};

describe('should render landing page', () => {
  test('should render blank page', () => {
    render(<MockApp />);
    const divElements = screen.getAllByText('');
    expect(divElements.length).toBe(2);
  });
});
