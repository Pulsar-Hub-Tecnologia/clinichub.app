import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '@/pages/public/login.tsx';
import PrivateRoute from './private.routes.tsx';
import { useTheme } from '@/context/theme-context.tsx';
import { ToastContainer } from 'react-toastify';
import { SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar.tsx';
import ForgotPassword from '@/pages/public/forgot-password.tsx';
import RecoverPassword from '@/pages/public/recover-password.tsx';
// import { useAuth } from '@/context/auth-context.tsx';
import RegisterAccess from '@/pages/public/register-access.tsx';
import RegisterInfo from '@/pages/public/register-info.tsx';
import Dashboard from '@/pages/private/dashboard.tsx';
import { Access, useAuthAdmin } from '@/context/auth-context.tsx';
import Workspaces from '@/pages/private/workspaces.tsx';
import VerifyEmail from '@/pages/public/verify-email.tsx';
import ValidateEmail from '@/pages/public/validate-email.tsx';
import Account from '@/pages/private/account.tsx';
import WorkspaceSettings from '@/pages/private/settings/workspace.tsx';

export const AppRoute = () => {
  const { theme } = useTheme();
  const { accesses, workspace } = useAuthAdmin();
  let workspace_id: string;
  let access: Access | undefined;

  if (workspace) {
    workspace_id = workspace.workspace_id;
    access = accesses.find(access => access.workspace_id === workspace_id)!;
  }

  const pagesAdmin = [
    {
      path: '/account',
      allowedRoles: ['ADMIN', 'OWNER', 'PROFESSIONAL', 'HYBRID'],
      component: Account,
    },
    {
      path: '/settings/workspace',
      allowedRoles: ['ADMIN', 'OWNER', 'PROFESSIONAL', 'HYBRID'],
      component: WorkspaceSettings,
    },
    {
      path: '/dashboard',
      allowedRoles: ['ADMIN', 'OWNER', 'PROFESSIONAL', 'HYBRID'],
      component: Dashboard,
    }
  ];

  const pagesPaciente = [
    { path: '/pacientes-dashboard', allowedRoles: ['PACIENTES'], component: Account },
  ]

  return (
    <>
      <ToastContainer theme={theme} />
      <Router>
        <Routes>
          <Route path={'/login'} element={<Login />} />
          <Route path={'/workspaces'} element={<Workspaces />} />
          <Route path={'/register-access'} element={<RegisterAccess />} />
          <Route path={'/register-info'} element={<RegisterInfo />} />
          <Route path={'/verify-email'} element={<VerifyEmail />} />
          <Route path={'/validate-email/:token/:email'} element={<ValidateEmail />} />
          <Route path={'/forgot-password'} element={<ForgotPassword />} />
          <Route path={'/recover/:token/:email'} element={<RecoverPassword />} />
          <Route path={'/*'} element={<Login />} />

          {access &&
            pagesAdmin
              .filter((page) => page.allowedRoles.includes(access.role))
              .map((e) => (
                <Route
                  key={e.path}
                  path={e.path}
                  element={
                    <PrivateRoute>
                      <SidebarProvider>
                        <AppSidebar
                          side="left"
                          access={access}
                        />
                        <e.component />
                      </SidebarProvider>
                    </PrivateRoute>
                  }
                />
              ))}

          {pagesPaciente
            .map((e) => (
              <Route
                key={e.path}
                path={e.path}
                element={
                  <PrivateRoute>
                    <SidebarProvider>
                      <AppSidebar
                        side="left"
                      />
                      <e.component />
                    </SidebarProvider>
                  </PrivateRoute>
                }
              />
            ))}
        </Routes>
      </Router>
    </>
  );
};
