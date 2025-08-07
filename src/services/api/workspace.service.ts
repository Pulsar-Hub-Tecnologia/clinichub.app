import { api } from '.';
import { AppRoutes } from './config/enum';

export interface WorkspaceData {
  name: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    cep: string;
    number: string;
    street: string;
    neighborhood: string;
    city: string;
    state: {
      acronym: string;
      name: string;
    };
  };
}

class WorkspaceService {
  static async getWorkspace(): Promise<Partial<WorkspaceData>> {
    try {
      const response = await api.get(AppRoutes.WORKSPACE);
      console.log(response, "DISGRAAÇÇÇAAAA")
      return response.data
    } catch {
      return {
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
          }
        }
      }
    }
  }

  static async updateWorkspace(body: Partial<WorkspaceData>): Promise<Partial<WorkspaceData>> {
    try {
      const response = await api.put(AppRoutes.WORKSPACE, body);
      return response.data
    } catch {
      return {
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
          }
        }
      }
    }
  }
}

export default WorkspaceService;
