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

interface GetAccountResponse {
  cpf: string;
  created_at: string;
  deleted_at: string | null;
  email: string;
  has_reset_pass: boolean;
  id: string;
  name: string;
  password_hash: string;
  picture: string | null;
  regional_council_number: string;
  reset_password_expires: string | null;
  token_reset_password: string | null;
  updated_at: string;
}

class AccountService {
  static async createAccount(body: CreateAccountProps): Promise<AxiosResponse> {
    const response = await api.post(AppRoutes.ACCOUNT, body);
    return response;
  }

  static async getAccount(): Promise<GetAccountResponse> {
    try {
      const response = await api.get(AppRoutes.ACCOUNT);
      return response.data
    } catch {
      return {
        cpf: "",
        created_at: "",
        deleted_at: null,
        email: "",
        has_reset_pass: false,
        id: "",
        name: "",
        password_hash: "",
        picture: null,
        regional_council_number: "",
        reset_password_expires: null,
        token_reset_password: null,
        updated_at: "",
      }
    }
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
