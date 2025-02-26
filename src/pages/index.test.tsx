import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

// Mock the next/head component
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: any) => {children},
  };
});

// Mock the next/image component
jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      return <img {...props} />;
    },
  };
});

// Mock the next/font/google
jest.mock('next/font/google', () => {
  return {
    Geist: () => ({
      variable: 'mocked-geist-sans',
    }),
    Geist_Mono: () => ({
      variable: 'mocked-geist-mono',
    }),
  };
});

describe('Home Component', () => {
  beforeEach(() => {
    render(<Home />);
  });

  it('renders the page title', () => {
    // Check if the page has the correct title
    const title = document.title;
    expect(title).toBe('Create Next App');
  });

  it('renders the Next.js logo', () => {
    const logo = screen.getByAltText('Next.js logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/next.svg');
  });

  it('renders the list of instructions', () => {
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('Get started by editing src/pages/index.tsx');
    expect(listItems[1]).toHaveTextContent('Save and see your changes instantly.');
  });

  it('renders the call-to-action buttons', () => {
    const deployButton = screen.getByText('Deploy now');
    expect(deployButton).toBeInTheDocument();
    expect(deployButton).toHaveAttribute('href', 'https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app');
    
    const docsButton = screen.getByText('Read our docs');
    expect(docsButton).toBeInTheDocument();
    expect(docsButton).toHaveAttribute('href', 'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app');
  });

  it('renders the footer with links', () => {
    const learnLink = screen.getByText('Learn');
    expect(learnLink).toBeInTheDocument();
    expect(learnLink).toHaveAttribute('href', 'https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app');
    
    const examplesLink = screen.getByText('Examples');
    expect(examplesLink).toBeInTheDocument();
    expect(examplesLink).toHaveAttribute('href', 'https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app');
    
    const nextjsLink = screen.getByText('Go to nextjs.org →');
    expect(nextjsLink).toBeInTheDocument();
    expect(nextjsLink).toHaveAttribute('href', 'https://nextjs.org?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app');
  });
});