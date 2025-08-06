import { useAuthAdmin } from "@/context/auth-context";
import AccountService from "@/services/api/account.service";
import AuthService from "@/services/api/auth.service";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify";

export default function ValidateEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, email } = useParams();
  const { signIn, signWorkspace, signInWithWorkspace, } = useAuthAdmin()

  useEffect(() => {
    (async () => {
      if (!token || !email) return navigate('/login');

      const response = await AuthService.validateEmail(token, email);

      if (response.status === 200) {
        signIn(response.data);

        const accesses = response.data.accesses;
        if (accesses.length === 1) {
          AccountService.signWorkspace(accesses[0].workspace_id)
            .then((response) => {
              signInWithWorkspace(response.data);
              signWorkspace(accesses[0]);
              navigate('/dashboard');
            })
            .catch((error) => {
              if (error instanceof AxiosError) {
                console.error(error);
                toast.error(
                  error.response?.data?.message || 'Algo deu errado, tente novamente.'
                );
              }
            });
        } else if (accesses.length > 1) {
          return navigate('/workspaces');
        } else {
          return toast.error('Você ão npossui acesso a nenhuma clínica.');
        }
      }

      return navigate('/login');
    })()
  }, [])

  if (location.pathname !== "/validate-email") {

  }


  return <></>
}