import { render, screen } from '@testing-library/react';
import { App } from './App';
import { describe, expect, test } from 'vitest';

describe('Component | App', () => {
  test('should render the app component', () => {
    render(<App />);
    expect(screen.getByText('Rendered from react app')).toBeInTheDocument();
  });
});
