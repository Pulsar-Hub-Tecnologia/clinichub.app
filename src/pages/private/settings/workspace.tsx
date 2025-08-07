import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Upload, Image, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BasicInput from '@/components/basic-input/basic-input';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import AddressService, { GetState } from '@/services/api/address.service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useLoading } from '@/context/loading-context';
import WorkspaceService, { WorkspaceData } from '@/services/api/workspace.service';
import { formatarCEP, formatCpfCnpj, formatPhone } from '@/utils/formats';

interface IWorkspaceData extends WorkspaceData {
  appointmentOnline: boolean;
  whatsappNotification: boolean;
  selfRegister: boolean;
}

const defaultWorkspaceData: IWorkspaceData = {
  name: "",
  cnpj: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: {
    cep: "",
    number: "",
    street: "",
    neighborhood: "",
    city: "",
    state: {
      acronym: "",
      name: "",
    },
  },
  appointmentOnline: false,
  whatsappNotification: false,
  selfRegister: false,
};

type NestedKeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
  ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
  : `${K}`;
}[keyof T & (string | number)];

export default function WorkspaceSettings() {
  const [statesList, setStatesList] = useState<GetState[]>([])
  const [workspaceData, setWorkspaceData] = useState<Partial<IWorkspaceData>>(defaultWorkspaceData)
  const [hasChanged, setHasChanged] = useState<boolean>(false)

  const { onLoading, offLoading } = useLoading()

  useEffect(() => {
    (async () => {
      try {
        onLoading()
        const [responseStates, responseWorkspace] = await Promise.allSettled([
          AddressService.getStates(),
          WorkspaceService.getWorkspace()
        ])

        if (responseWorkspace.status === "rejected" || responseStates.status === "rejected") {
          toast.error("Ops! Não conseguimos carregar os dados do seu workspace no momento!")
          return
        }

        setStatesList(responseStates.value)
        setWorkspaceData({
          name: responseWorkspace.value.name,
          cnpj: responseWorkspace.value.cnpj,
          email: responseWorkspace.value.email,
          address: responseWorkspace.value.address,
          phone: responseWorkspace.value.phone,
          whatsapp: responseWorkspace.value.whatsapp,
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message)
        }
      } finally {
        offLoading()
      }
    })()
  }, [])

  const handleSaveData = async () => {
    try {
      onLoading()
      await WorkspaceService.updateWorkspace(workspaceData)
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

  const handleChangeData = <T extends NestedKeyOf<IWorkspaceData>>(field: T, value: any) => {
    setHasChanged(true);
    return setWorkspaceData((prev) => {
      const newPrev = { ...prev };
      const [mainField, subField] = field.split('.');

      if (subField) {
        // @ts-ignore
        newPrev[mainField] = {
          // @ts-ignore
          ...newPrev[mainField],
          [subField]: value,
        };
      } else {
        // @ts-ignore
        newPrev[mainField] = value;
      }

      return newPrev;
    });
  };

  const copyRegisterLink = () => {
    if (!navigator.clipboard) {
      return toast.warn("Ops! Parece que seu navegador não tem área de transferência!")
    }

    navigator.clipboard.writeText("Link de Registro...")
    return toast.info("O Link foi copiado!")
  }

  const concatAddress = () => {
    const parts = [];

    if (workspaceData.name) {
      parts.push(workspaceData.name);
    }

    const addressParts = [];
    if (workspaceData.address?.street) {
      addressParts.push(workspaceData.address.street);
    }
    if (workspaceData.address?.number) {
      addressParts.push(workspaceData.address.number);
    }

    if (addressParts.length > 0) {
      parts.push(addressParts.join(', '));
    }

    if (workspaceData.address?.neighborhood) {
      parts.push(workspaceData.address.neighborhood);
    }
    if (workspaceData.address?.city) {
      parts.push(workspaceData.address.city);
    }

    return parts.join(' - ');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-6 gap-5">
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações da Clínica</h1>
            <p className="text-sm text-gray-500">{concatAddress()}</p>
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
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <BasicInput
                label="Nome da Clínica"
                placeholder="Digite Nome da Clínica"
                id="clininName"
                type="text"
                value={workspaceData.name}
                onChange={(e) => handleChangeData("name", e.target.value)}
              />
              <BasicInput
                label="CNPJ"
                placeholder="Digite CNPJ"
                id="cnpj"
                type="text"
                value={formatCpfCnpj(workspaceData.cnpj)}
                onChange={(e) => handleChangeData("cnpj", e.target.value)}
              />
              <BasicInput
                label="Telefone Principal"
                placeholder="Digite Telefone Principal"
                id="phone"
                type="tel"
                value={formatPhone(workspaceData.phone)}
                onChange={(e) => handleChangeData("phone", e.target.value)}
              />
              <BasicInput
                label="WhatsApp"
                placeholder="Digite WhatsApp"
                id="whatsApp"
                type="tel"
                value={formatPhone(workspaceData.whatsapp)}
                onChange={(e) => handleChangeData("whatsapp", e.target.value)}
              />
              <BasicInput
                label="E-mail"
                placeholder="contato@clinicacentro.com.br"
                id="email"
                type="email"
                value={workspaceData.email}
                onChange={(e) => handleChangeData("email", e.target.value)}
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
                value={formatarCEP(workspaceData.address?.cep)}
                onChange={(e) => handleChangeData("address.cep", e)}
              />
              <BasicInput
                label="Número"
                placeholder="123"
                id="number"
                type="text"
                value={workspaceData.address?.number}
                onChange={(e) => handleChangeData("address.number", e.target.value)}
              />
              <BasicInput
                label="Rua"
                placeholder="Rua das Flores"
                id="street"
                type="text"
                value={workspaceData.address?.street}
                onChange={(e) => handleChangeData("address.street", e.target.value)}
              />
              <BasicInput
                label="Bairro"
                placeholder="Centro"
                id="neighborhood"
                type="text"
                value={workspaceData.address?.neighborhood}
                onChange={(e) => handleChangeData("address.neighborhood", e.target.value)}
              />
              <BasicInput
                label="Cidade"
                placeholder="São Paulo"
                id="city"
                type="text"
                value={workspaceData.address?.city}
                onChange={(e) => handleChangeData("address.city", e.target.value)}
              />
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Select defaultValue={workspaceData.address?.state.acronym} onValueChange={(e) => handleChangeData("address.state", { acronym: e, name: statesList.find(state => state.sigla === e)?.nome! })}>
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

                onChange={(e) => handleChangeData("name", e.target.value)}
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
