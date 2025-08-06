import { AxiosResponse } from 'axios';
import { api } from '.';
import { AppRoutes } from './config/enum';

interface CreateAccountProps {
  workspace_type: 'PERSONAL' | 'BUSINESS';
  email: string;
  password: string;
  name: string;
  cpf: string;
  crm_number?: string;
  workspace_name?: string;
  cnpj?: string;
}

class AccountService {
  static async createAccount(body: CreateAccountProps): Promise<AxiosResponse> {
    const response = await api.post(AppRoutes.ACCOUNT, body);
    return response;
  }

  static async getAccount(): Promise<AxiosResponse> {
    const response = await api.get(AppRoutes.ACCOUNT);
    return response;
  }

  static async validateAccount({
    field,
    value,
  }: {
    field: string;
    value: string;
  }): Promise<AxiosResponse> {
    const response = await api.get(
      AppRoutes.ACCOUNT + `/validate?field=${field}&value=${value}`,
    );
    return response;
  }

  static async signWorkspace(workspace_id: string): Promise<AxiosResponse> {
    const response = await api.post(AppRoutes.ACCOUNT + '/accesses/sign-workspace', { workspace_id });
    return response;
  }
}

export default AccountService;
