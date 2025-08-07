import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Upload, Image, Check } from 'lucide-react';
import BasicInput from '@/components/basic-input/basic-input';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useLoading } from '@/context/loading-context';
import AccountService, { AccountData } from '@/services/api/account.service';
import { useAuthAdmin } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { formatPhone } from '@/utils/formats';

const defaultAccountData: AccountData = {
  id: "",
  name: "",
  email: "",
  phone: "",
  cpf: "",
  regional_council_number: "",
  picture: undefined,
  especiality: "",
  date_birth: "",
  bio: "",
  has_reset_pass: false,
  has_verified_email: false,
  password_hash: "",
  reset_password_expires: undefined,
  token_reset_password: undefined,
  created_at: "",
  updated_at: undefined,
  deleted_at: undefined,
}

export default function Account() {
  const [accountData, setAccountData] = useState<AccountData>(defaultAccountData)
  const [hasChanged, setHasChanged] = useState<boolean>(false)

  const { onLoading, offLoading } = useLoading()
  const { workspace } = useAuthAdmin()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    (async () => {
      try {
        onLoading()
        const responseAccout = await AccountService.getAccount()
        setAccountData(responseAccout)
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message)
        }

        toast.error("Ops! Tivemos um erro interno!")
      } finally {
        offLoading()
      }
    })()
  }, [])

  const handleSaveData = async () => {
    try {
      onLoading()
      await AccountService.updateAccount(accountData)
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error(error.message || "Ops! Tivemos um erro ao atualizar seus dados!")
      }
      toast.error("Ops! Tivemos um erro ao atualizar seus dados!")
    } finally {
      setHasChanged(false)
      offLoading()
    }
  }

  const handleChangeData = <T extends keyof AccountData>(field: T, value: AccountData[T] | boolean) => {
    setHasChanged(true)
    return setAccountData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-6 gap-5">
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minha Conta</h1>
            <p className="text-sm text-gray-500">Gerencie suas informações pessoais e preferências</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={'default'} className="flex items-center gap-1" disabled={!hasChanged} onClick={handleSaveData}>
            {hasChanged ? <Save className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            <span className='hidden md:inline'>{hasChanged ? "Salvar Alterações" : "Dados Atualizados"}</span>
          </Button>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Informações Pessoais</CardTitle>
              {workspace?.type === "BUSINESS" && workspace.role !== "PROFESSIONAL" && (
                <div className='flex items-center gap-2'>
                  <p>Sou profissional</p>
                  <Switch checked={workspace.role === "HYBRID"} />
                </div>)
              }
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <BasicInput
                label="Nome Completo"
                placeholder="Digite seu Nome Completo"
                id="clininName"
                type="text"
                value={accountData.name}
                onChange={(e) => handleChangeData("name", e.target.value)}
              />
              <BasicInput
                label="E-mail"
                placeholder="Digite o seu Email"
                id="email"
                type="email"
                value={accountData.email}
                onChange={(e) => handleChangeData("email", e.target.value)}
              />
              <BasicInput
                label="Telefone"
                placeholder="Digite o seu Telefone"
                id="phone"
                type="tel"
                value={formatPhone(accountData.phone)}
                maxLength={15}
                onChange={(e) => handleChangeData("phone", e.target.value)}
              />
              <BasicInput
                label="CRM"
                placeholder="Digite o seu CRM"
                id="crm"
                type="text"
                maxLength={13}
                value={accountData.regional_council_number}
                onChange={(e) => handleChangeData("regional_council_number", e.target.value)}
              />
              <BasicInput
                label="Especialidade"
                placeholder="Digite o sua Especialidade"
                id="especiality"
                type="text"
                value={accountData.especiality}
                onChange={(e) => handleChangeData("especiality", e.target.value)}
              />
              <BasicInput
                label="Data de Nascimento"
                placeholder="Digite o sua Data de Nascimento"
                id="dateBirth"
                type="date"
                value={accountData.date_birth}
                onChange={(e) => handleChangeData("date_birth", e.target.value)}
              />
              <BasicInput
                className="h-20"
                label="Bio Profissional"
                placeholder="Digite o sua Bio Prossional"
                id="bio"
                value={accountData.bio}
                useTextArea={true}
                onChange={(e) => handleChangeData("bio", e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Preferências do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <div className='flex items-center justify-between w-full'>
                <div>
                  <h2>Tema Escuro</h2>
                  <p className="text-sm text-gray-500">Ativar modo escuro na interface</p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Segurança da Conta</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">

            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Logo da Clínica</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <AspectRatio ratio={16 / 9} className='flex items-center justify-center'>
                <Image className='h-10 w-10' />
              </AspectRatio>
              <Button className="mb-2 flex items-center gap-1">
                <Upload className="h-4 w-4" />
                Enviar Logo
              </Button>
              <p className="text-xs text-gray-500">PNG, JPG até 2MB</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
