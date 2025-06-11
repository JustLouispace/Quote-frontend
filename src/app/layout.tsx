import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'QuoteVote',
    description: 'Vote for your favorite quotes',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full bg-gray-50">
            <body className={`${inter.className} min-h-screen flex flex-col`}>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}