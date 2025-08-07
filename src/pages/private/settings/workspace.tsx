import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Upload, Image } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BasicInput from '@/components/basic-input/basic-input';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import AddressService, { GetState } from '@/services/api/address.service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useLoading } from '@/context/loading-context';

interface AccountData {
  basic: {
    name: string;
    cnpj: string;
    phone: string;
    whatsapp: string;
    email: string;
  }
  address: {
    cep: string;
    number?: number;
    street: string;
    neighborhood: string;
    city: string;
    state: {
      acronym: string;
      name: string;
    }
  }
}

const defaultAccountData = {
  basic: {
    name: "",
    cnpj: "",
    phone: "",
    whatsapp: "",
    email: "",
  },
  address: {
    cep: "",
    number: undefined,
    street: "",
    neighborhood: "",
    city: "",
    state: {
      acronym: "",
      name: "",
    }
  }
}

export default function WorkspaceSettings() {
  const [statesList, setStatesList] = useState<GetState[]>([])
  const [accountData, setAccountData] = useState<AccountData>(defaultAccountData)

  const { onLoading, offLoading } = useLoading()

  useEffect(() => {
    (async () => {
      try {
        onLoading()
        const responseStates = await AddressService.getStates()
        setStatesList(responseStates)
        setAccountData(defaultAccountData)
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message)
        }
      } finally {
        offLoading()
      }
    })()
  }, [])

  const copyRegisterLink = () => {
    if (!navigator.clipboard) {
      return toast.warn("Ops! Parece que seu navegador não tem área de transferência!")
    }

    navigator.clipboard.writeText("Link de Registro...")
    return toast.info("O Link foi copiado!")
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-6 gap-5">
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações da Clínica</h1>
            <p className="text-sm text-gray-500">Endereço da Clínica</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={'default'} className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            <span className='hidden md:inline'>Salvar Alterações</span>
          </Button>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <BasicInput
                label="Nome da Clínica"
                placeholder="Digite Nome da Clínica"
                id="clininName"
                type="text"
                value={accountData.basic.name}
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
              <BasicInput
                label="CNPJ"
                placeholder="Digite CNPJ"
                id="cnpj"
                type="text"
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
              <BasicInput
                label="Telefone Principal"
                placeholder="Digite Telefone Principal"
                id="phone"
                type="tel"
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
              <BasicInput
                label="WhatsApp"
                placeholder="Digite WhatsApp"
                id="whatsApp"
                type="tel"
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
              <BasicInput
                label="E-mail"
                placeholder="contato@clinicacentro.com.br"
                id="email"
                type="email"
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <BasicInput
                label="CEP"
                placeholder="01234-567"
                id="cep"
                type="text"
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
              <BasicInput
                label="Número"
                placeholder="123"
                id="number"
                type="number"
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
              <BasicInput
                label="Rua"
                placeholder="Rua das Flores"
                id="street"
                type="text"
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
              <BasicInput
                label="Bairro"
                placeholder="Centro"
                id="neighborhood"
                type="text"
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
              <BasicInput
                label="Cidade"
                placeholder="São Paulo"
                id="city"
                type="text"
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                {/* [TODO]: Alterar o DEFAULT VALUE para o valor vindo do banco */}
                <Select defaultValue="SP">
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statesList.map(state => (
                      <SelectItem key={state.id} value={state.sigla}>{state.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <BasicInput
                label="Complemento"
                placeholder="Sala, andar, etc."
                id="complement"
                type="text"
              // defaultValue={}
              // onChange={(e) => setUser('password', e.target.value)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Configurações avançadas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <div className='flex items-center justify-between w-full'>
                <div>
                  <h2>Permitir agendamento online</h2>
                  <p className="text-sm text-gray-500">Pacientes podem agendar consultas pelo sistema</p>
                </div>
                <Switch />
              </div>
              <div className='flex items-center justify-between w-full '>
                <div>
                  <h2>Notificações por WhatsApp</h2>
                  <p className="text-sm text-gray-500">Enviar lembretes e confirmações via WhatsApp</p>
                </div>
                <Switch />
              </div>
              <div className='flex items-center justify-between w-full '>
                <div>
                  <h2>Permitir que os pacientes se autocadastrem</h2>
                  <p className="text-sm text-gray-500">Os pacientes poderão se cadastrar por um link </p>
                </div>
                <Switch />
              </div>

              <h2 className='text-primary font-semibold hover:underline cursor-pointer w-fit mt-5' onClick={copyRegisterLink}>Copiar link de cadastro</h2>
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
