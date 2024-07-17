import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  const a = expect(linkElement)
  a.toHaveBeenLastCalledWith()
  a.toBeInTheDocument();
});
