'use client';

import dynamic from 'next/dynamic';

// Disable SSR for NavBar to avoid hydration issues with localStorage
const NavBar = dynamic(() => import('@/components/ui/NavBar'), { ssr: false });

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <NavBar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </div>
            </main>
            <footer className="bg-white border-t border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} QuoteVote. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}
