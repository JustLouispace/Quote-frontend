import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Welcome to Quote Frontend
                </h1>
                <p className="text-center text-lg mb-8">
                    A modern quote application built with Next.js and Tailwind CSS
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        href="/login"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </main>
    );
} 