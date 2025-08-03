import {
  useState,
  createContext,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { User } from '../types/User';
import { decryptData, encryptData } from '@/utils/encrypt';
import { api } from '@/services/api';

interface AuthContextInterface {
  token: string;
  signIn: (user: User) => void;
  signWorkspace: (workspace_id: string) => Promise<void>;
  user: User | undefined;
  signOut: () => void;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  headers: {
    headers: {
      workspace_id: string;
    };
  };
  api: typeof api;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

interface AuthProviderInterface {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderInterface) => {
  const [token, setToken] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    role: 'MEMBER',
  });

  useEffect(() => {
    const cookieUser = Cookies.get('clinic_user');
    const cookieToken = Cookies.get('clinic_token') as string;
    const cookieWorkspace = Cookies.get('clinic_workspace_id') as string;
    if (cookieUser && cookieToken) {
      const parsedUser: User = decryptData(cookieUser);
      setUser(parsedUser);
      setToken(cookieToken); // supondo que o token está dentro de user
      setWorkspaceId(cookieWorkspace); // supondo que o token está dentro de user
    }
  }, []);

  const signIn = async (user: User) => {
    setToken(user.token!);
    setUser(user);
    Cookies.set('clinic_user', encryptData(user), { expires: 7 }); // persiste por 7 dias
    Cookies.set('clinic_token', user.token!, { expires: 7 }); // persiste por 7 dias
  };

  const signOut = () => {
    Cookies.remove('clinic_token'); // persiste por 7 dias
    Cookies.remove('clinic_user'); // persiste por 7 dias
    Cookies.remove('clinic_workspace_id'); // persiste por 7 dias
    setToken('');
    setWorkspaceId('');
    setUser({
      id: '',
      name: '',
      email: '',
      role: 'MEMBER',
    });
  };

  const headers = {
    headers: {
      workspace_id: workspaceId,
    },
  };

  async function signWorkspace(workspace_id: string) {
    setWorkspaceId(workspace_id);
    Cookies.set('clinic_workspace_id', workspace_id, { expires: 7 }); // persiste por 7 dias
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        headers,
        signIn,
        signOut,
        user,
        setUser,
        api,
        signWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
