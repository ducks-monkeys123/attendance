import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Outlet } from 'react-router';
import type { User } from 'firebase/auth';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation, Authentication } from '@toolpad/core/AppProvider';
import { firebaseSignOut, signInWithGoogle, onAuthStateChanged } from './firebase/auth';
import SessionContext, { type Session } from './SessionContext';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main',
  },
  {
    segment: 'attendance/', // Full path to the Dashboard route
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'attendance/scan/', // Full path to the Scan page route
    title: 'Scan OR Code',
    icon: <img src="/attendance/qr_code.svg" alt="Logo" style={{ height: 24 }} />,
  }
];


const BRANDING = {
  title: 'Attendance',
  logo: <img src="/attendance/icon.svg" alt="Logo" style={{ height: 24 }} />,
  homeUrl: "/attendance/"
};

const AUTHENTICATION: Authentication = {
  signIn: signInWithGoogle,
  signOut: firebaseSignOut,
};

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  const sessionContextValue = React.useMemo(
    () => ({
      session,
      setSession,
      loading,
    }),
    [session, loading],
  );

  React.useEffect(() => {
    // Returns an `unsubscribe` function to be called during teardown
    const unsubscribe = onAuthStateChanged((user: User | null) => {
      if (user) {
        setSession({
          user: {
            name: user.displayName || '',
            email: user.email || '',
            image: user.photoURL || '',
          },
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={session}
      authentication={AUTHENTICATION}
    >
      <SessionContext.Provider value={sessionContextValue}>
        <Outlet />
      </SessionContext.Provider>
    </ReactRouterAppProvider>
  );
}
