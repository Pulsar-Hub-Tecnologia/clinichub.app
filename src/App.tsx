import '@/App.css';
import Loading from '@/components/loading/loading';
import { AuthProvider } from '@/context/auth-context';
import { LoadingProvider } from '@/context/loading-context';
import { ThemeProvider } from '@/context/theme-context';
import { AppRoute } from '@/routes/app.routes';
import { ModeToggle } from './components/mode-toggle/mode-toggle';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <LoadingProvider>
        <AuthProvider>
          <Loading />
          <AppRoute />
          <ModeToggle />
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
