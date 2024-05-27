import React from 'react';
import { render } from '@testing-library/react';
import Page from './page';

const mockHomePage = jest.fn(() => <div>Mock Home Page</div>);

jest.mock('./home-page', () => ({
    __esModule: true,
    default: () => mockHomePage(),
}));

describe('Page', () => {
    it('renders Home page', () => {
        render(<Page />);

        expect(mockHomePage).toHaveBeenCalled();
    });
});

