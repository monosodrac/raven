import { useEffect, useState } from 'react';
import { AppRouter } from './routes';
import { useAuth } from './hooks/useAuth';

function App() {
  const { restoreSession } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
    setIsLoading(false);
  }, [restoreSession]);

  if (isLoading) {
    return <div>Carregando...</div>; // Placeholder para enquanto o estado é restaurado
  }

  return <AppRouter />;
}

export default App;
