import ImageCarousel from '@/components/carousel/carousel';
import { Label } from '@/components/ui/label';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ClinicHubLogo from "/logo.png"
import ClinicHubLoginImage1 from "/carrosel/image1.png";
import ClinicHubLoginImage2 from "/carrosel/image2.png";
import ClinicHubLoginImage3 from "/carrosel/image3.png";
import AnimatedComponent from '@/components/animated-component';
import BasicInput from '@/components/basic-input/basic-input';
import { Mail, Phone, Send, ArrowLeft } from 'lucide-react';
import { emailValidator } from '@/utils/valid';
import { Button } from '@/components/ui/button';
import AuthService from '@/services/api/auth.service';

export default function ForgotPassword() {
  const { onLoading, offLoading } = useLoading();
  const navigate = useNavigate();

  const [data, setData] = useState('');


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await onLoading();

    e.preventDefault();
    if (data === '') {
      toast.warn('Preencha as credenciais corretamnete');
    } else {
      await AuthService.forgotPassword(data).then((response) => {
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate('/login');
      }
    })
    .catch((error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    })
    .finally(async () => {
      await offLoading();
    })};
  };

  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const disabled = data === '' || emailError !== undefined;

  return (
  <section>
    <div className="flex w-full min-h-dvh">
      <div className='flex flex-col justify-center w-full lg:w-1/3 px-6 py-4 lg:px-16 space-y-5 xl:space-y-4 2xl:space-y-6'>
        <AnimatedComponent type='slide-from-left' delay={100} duration='duration-500'>
          <section id='header' className='space-y-10'>
            <div className='space-y-2'>
              <div className="flex items-center space-x-2">
                <img src={ClinicHubLogo} />
                <span className="text-xl font-semibold">ClinicHub</span>
              </div>
              <p className="text-sm">Sistema de Gestão em Saúde</p>
            </div>
            <span className="block text-primary hover:underline ml-1 cursor-pointer text-left" onClick={() => navigate('/login')}>
                <ArrowLeft className="inline-block mr-1" />
                Voltar ao login
              </span>
            <div className='space-y-1'>
              <h1 className="text-3xl font-bold">Esqueceu sua senha?</h1>
              <p>Não se preocupe, enviaremos instruções para redefinir sua senha</p>
            </div>
          </section>
        </AnimatedComponent>

        <AnimatedComponent type='slide-from-bottom' delay={200} duration='duration-700' className='space-y-5 xl:space-y-4 2xl:space-y-6'>

            <form onSubmit={handleSubmit} id="inputs" className='space-y-8'>
              <BasicInput
                label="E-mail"
                leftIcon={
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
                id="email"
                type="email"
                error={emailError}
                placeholder="Digite seu e-mail cadastrado"
                value={data}
                onChange={(e) => {
                  setData(e.target.value);
                }}
                onBlur={() => {
                  if (!emailValidator(data)) {
                    setEmailError('Preencha o e-mail corretamente');
                  } else {
                    setEmailError(undefined);
                  }
                }}
                autoComplete="email"
                required
              />



              <Button
                className="mt-8 w-full py-6 text-lg font-semibold bg-primary hover:bg-primary-foreground text-white flex items-center justify-center space-x-2"
                disabled={disabled}
                type="submit"
                >
                <Send className="h-5 w-5" />
                Enviar instruções

              </Button>
              <div id="help-section" className="mt-8 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                        <i className="text-primary text-xl" data-fa-i2svg=""><svg className="svg-inline--fa fa-circle-info" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">Precisa de ajuda?</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Se você não receber o e-mail em alguns minutos, verifique sua pasta de spam ou entre em contato com o suporte.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a
                              href="tel:+551112345678"
                              className="flex text-sm text-primary hover:underline transition-colors cursor-pointer font-medium"
                            >
                              <Phone className="inline-block mr-1" />
                              +55 11 1234-5678
                            </a>
                            <a
                              href="mailto:suporte@clinichub.com.br"
                              className="flex text-sm text-primary hover:underline transition-colors cursor-pointer font-medium"
                            >
                              <Mail className="inline-block mr-1" />
                              suporte@clinichub.com.br
                            </a>
                        </div>
                    </div>
                </div>
            </div>
              <Label
                className="text-center block text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                Lembrou da senha?
                <span className="text-primary hover:underline ml-1 cursor-pointer" onClick={() => {navigate('/login')}}>Fazer login</span>
              </Label>
            </form>
        </AnimatedComponent>
      </div>
      <section id='bubbles' className='hidden lg:block lg:w-2/3 min-h-full bg-gradient-to-r from-primary to-primary-foreground relative'>
        <div className='absolute min-h top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 z-20'>
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
