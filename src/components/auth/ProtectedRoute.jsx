import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { TOKEN_KEY, STORE_KEY } from '../../utils/constants';
import api from '../../services/api';

/**
 * Protected Route Component
 * Checks authentication and validates token before allowing access
 * Optimized with timeout to prevent long loading times
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    let cancelled = false;
    let timeoutId = null;

    const validateToken = async () => {
      // If no token, skip validation
      if (!token) {
        if (!cancelled) {
          setIsValidating(false);
          setIsAuthenticated(false);
        }
        return;
      }

      try {
        // Use a lightweight endpoint to validate token
        // /whoami is faster than /dashboard as it only returns store info
        // Set a short timeout (3 seconds) to prevent long waits
        const validationPromise = api.get('/whoami', {
          timeout: 3000, // 3 seconds max wait
        });

        // Race between validation and timeout
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Token validation timeout'));
          }, 3000);
        });

        await Promise.race([validationPromise, timeoutPromise]);
        
        if (timeoutId) clearTimeout(timeoutId);

        if (!cancelled) {
          setIsAuthenticated(true);
          setIsValidating(false);
        }
      } catch (error) {
        if (timeoutId) clearTimeout(timeoutId);

        // Token is invalid or expired, or request timed out
        if (!cancelled) {
          // Clear invalid token
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(STORE_KEY);
          setIsAuthenticated(false);
          setIsValidating(false);
        }
      }
    };

    validateToken();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token]);

  // Show loading state only briefly (max 3 seconds)
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg-base">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-ice-primary/40 border-t-ice-primary rounded-full animate-spin"
               style={{ animation: 'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
               role="status"
               aria-label="Loading" />
          <p className="text-sm text-neutral-text-secondary">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/shopify/login" state={{ from: location }} replace />;
  }

  return children;
}

