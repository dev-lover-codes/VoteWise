
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-primary dark:text-white mb-4">404</h1>
      <h2 className="text-3xl font-heading font-semibold text-slate-800 dark:text-slate-200 mb-6">Page Not Found</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-lg">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300">
        Go Home
      </Link>
    </div>
  );
}