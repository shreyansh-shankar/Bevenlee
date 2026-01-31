import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to Your App
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          A modern full-stack application with FastAPI and Next.js
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/auth/signin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}