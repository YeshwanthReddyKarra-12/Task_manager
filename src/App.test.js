import { render, screen } from '@testing-library/react';
import App from './TaskManager';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

test('renders learn react link', () => {
  render(<App />);
  render(<Login />);
  render(<Register />);
  render(<Navbar />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
