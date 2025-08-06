import {
  useState,
  createContext,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { decryptData, encryptData } from '@/utils/encrypt';
import { api } from '@/services/api';

export interface Access {
  picture: string;
  workspace_id: string;
  type: string;
  name: string;
  role: string;
}

interface AuthUser {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextInterface {
  accesses: Access[];
  user: AuthUser | undefined;
  workspace?: Access;
  token: string;
  signIn: (data: { accesses: Access[]; user: AuthUser; token: string }) => void;
  signOut: () => void;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | undefined>>;
  signWorkspace: (workspace: Access) => Promise<void>;
  signInWithWorkspace: (token: string) => void;
  api: typeof api;
  headers: {
    headers: {
      workspace_id: string;
    };
  };
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

interface AuthProviderInterface {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderInterface) => {
  const [token, setToken] = useState('');
  const [accesses, setAccesses] = useState<Access[]>([]);
  const [workspace, setWorkspace] = useState<Access>();
  const [user, setUser] = useState<AuthUser | undefined>(undefined);

  useEffect(() => {
    const authCookie = Cookies.get('clinic_auth') as string;
    const { user, accesses } = authCookie ? decryptData(authCookie) : { user: undefined, accesses: [] };
    const cookieToken = Cookies.get('clinic_token') as string;
    const cookieWorkspace = Cookies.get('clinic_workspace');
    const workspace = cookieWorkspace ? JSON.parse(cookieWorkspace) : undefined;
    //Validar se o usuário possui workspace, se não tiver, redirecionar para a página de workspaces
    // if (!cookieWorkspace) {
    //   window.location.href = '/tela-de-seleção-de-workspace/clinicas';
    //   return;
    // }
    if (user && accesses && cookieToken) {
      setUser(user);
      setAccesses(accesses);
      setToken(cookieToken);
      setWorkspace(workspace);
      console.log('AuthProvider: User and accesses set from cookies');
    }
  }, []);

  const signIn = (data: { accesses: Access[]; user: AuthUser; token: string }) => {
    const { accesses, user, token } = data;
    setToken(token);
    setUser(user);
    setAccesses(accesses);
    Cookies.set('clinic_token', token, { expires: 7 });
    Cookies.set('clinic_auth', encryptData({accesses, user}), { expires: 7 });
  };

  const signInWithWorkspace = (token: string) => {
    Cookies.set('clinic_workspace_token', token, { expires: 7 });
  };

  const signOut = () => {
    Cookies.remove('clinic_auth');
    Cookies.remove('clinic_workspace');
    setToken('');
    setUser(undefined);
    setAccesses([]);
    setWorkspace(undefined);
  };

  const headers = {
    headers: {
      workspace_id: workspace?.workspace_id ?? '',
    },
  };

  async function signWorkspace(workspace: Access) {
    setWorkspace(workspace);
    Cookies.set('clinic_workspace', JSON.stringify(workspace), { expires: 7 });
  }

  return (
    <AuthContext.Provider
      value={{
        accesses,
        user,
        token,
        workspace,
        signIn,
        signOut,
        setUser,
        api,
        signWorkspace,
        headers,
        signInWithWorkspace
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuthAdmin = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
