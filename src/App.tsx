import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

const Home = React.lazy(() => import('./pages/Home'));
const Chat = React.lazy(() => import('./pages/Chat'));
const Timeline = React.lazy(() => import('./pages/Timeline'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Myths = React.lazy(() => import('./pages/Myths'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Profile = React.lazy(() => import('./pages/Profile'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-16">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/myths" element={<Myths />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;