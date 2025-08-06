import AnimatedComponent from '@/components/animated-component';
import BasicInput from '@/components/basic-input/basic-input';
import { Button } from '@/components/ui/button';
import ClinicHubLogo from "/logo.png"
import ClinicHubLoginImage1 from "/carrosel/image1.png";
import ClinicHubLoginImage2 from "/carrosel/image2.png";
import ClinicHubLoginImage3 from "/carrosel/image3.png";
import { Label } from '@/components/ui/label';
import { useAuthAdmin } from '@/context/auth-context';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogIn, Mail, Lock } from 'lucide-react';
import ImageCarousel from '@/components/carousel/carousel';
import { emailValidator } from '@/utils/valid';
import { Card } from '@/components/ui/card';
import AuthService from '@/services/api/auth.service';
import AccountService from '@/services/api/account.service';

interface FormFields {
  email: string;
  password: string;

}

const defaultFormFields: FormFields = {
  email: "",
  password: ""
}

export default function Login() {

  const { onLoading, offLoading } = useLoading();
  const { signIn, signInWithWorkspace, signWorkspace } = useAuthAdmin();
  const [data, setData] = useState(defaultFormFields);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  const setUser = (field: keyof FormFields, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLoading();

    try {
      if (!data.email || !data.password) {
        toast.warn('Preencha as credenciais corretamente');
        return;
      }
      if (!emailValidator(data.email)) {
        setEmailError('Preencha o e-mail corretamente');
        return;
      }

      const { email, password } = data;
      const response = await AuthService.login(email, password);

      if (response.status === 200) {
        await signIn(response.data);

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
          navigate('/workspaces');
        } else {
          toast.error('Você não possui acesso a nenhuma clínica.');
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.'
        );
      }
    } finally {
      await offLoading();
    }
  };


  const disabled = data.email === '' || data.password === '' || emailError !== undefined;

  return (

    <section>
      <div className="flex w-full min-h-dvh">
        <Card className='flex flex-col justify-center  lg:w-1/3 px-6 py-4 lg:px-14 space-y-5 xl:space-y-4 2xl:space-y-6'>
          <AnimatedComponent type='slide-from-left' delay={100} duration='duration-500'>
            <section id='header' className='space-y-10'>
              <div className='space-y-2'>
                <div className="flex items-center space-x-2">
                  <img src={ClinicHubLogo} />
                  <span className="text-xl font-semibold">ClinicHub</span>
                </div>
                <p className="text-sm">Sistema de Gestão em Saúde</p>
              </div>
              <div className='space-y-1'>
                <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
                <p>Acesse sua conta para continuar</p>
              </div>
            </section>
          </AnimatedComponent>

          <AnimatedComponent type='slide-from-bottom' delay={200} duration='duration-700' className='space-y-5 xl:space-y-4 2xl:space-y-6'>

            <form onSubmit={handleSubmit} id="inputs" className='space-y-5'>
              <BasicInput
                label="E-mail"
                leftIcon={
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
                id="email"
                type="email"
                error={emailError}
                placeholder="seu@email.com"
                value={data.email}
                onChange={(e) => {
                  setUser('email', e.target.value);
                }}
                onBlur={() => {
                  if (!emailValidator(data.email)) {
                    setEmailError('Preencha o e-mail corretamente');
                  } else {
                    setEmailError(undefined);
                  }
                }}
                autoComplete="email"
                required
              />
              <BasicInput
                label="Senha"
                placeholder="Digite sua senha"
                id="password"
                type="password"
                value={data.password}
                required
                onChange={(e) => setUser('password', e.target.value)}
                leftIcon={
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
              />
              <span className="text-right block text-primary hover:underline ml-1 cursor-pointer" onClick={() => navigate('/forgot-password')}>
                Esqueceu a senha?
              </span>

              <Button
                className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary-foreground text-white flex items-center justify-center space-x-2"
                disabled={disabled}
                type="submit"
              >
                <LogIn className="h-5 w-5" />
                Entrar

              </Button>
              <Label
                className="text-center block text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Não tem uma conta?
                <span className="text-primary hover:underline ml-1 cursor-pointer" onClick={() => navigate('/register-access')}>Cadastre-se gartuitamente</span>
              </Label>
            </form>
          </AnimatedComponent>
        </Card>
        <section id='bubbles' className='hidden lg:block lg:w-2/3 min-h-full bg-gradient-to-r from-primary to-primary-foreground relative'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 z-20'>
            <ImageCarousel
              images={[
                ClinicHubLoginImage1,
                ClinicHubLoginImage2,
                ClinicHubLoginImage3,
              ]}
            />
          </div>
          <div className="absolute bottom-1 left-[10%] w-6 h-6 rounded-full opacity-0 bg-white animate-bubble-float-1 z-10"></div>
          <div className="absolute bottom-1 left-[30%] w-30 h-30 rounded-full opacity-0 bg-white animate-bubble-float-2 z-10"></div>
          <div className="absolute bottom-1 left-[50%] w-7 h-7 rounded-full opacity-0 bg-white animate-bubble-float-3 z-10"></div>
          <div className="absolute bottom-1 left-[70%] w-12 h-12 rounded-full opacity-0 bg-white animate-bubble-float-1 [animation-delay:3s] z-10"></div>
          <div className="absolute bottom-1 left-[90%] w-9 h-9 rounded-full opacity-0 bg-white animate-bubble-float-2 [animation-delay:1s] z-10"></div>
        </section>
      </div>
    </section>
  );
}


