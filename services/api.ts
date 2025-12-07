import { MOCK_INVENTORY, MOCK_TENANTS } from '../constants';
import { Product, Tenant } from '../types';

// Simula um delay de rede (ex: 500ms) para parecer uma API real
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * SERVICE LAYER
 * No futuro, substitua o conteúdo destas funções por chamadas ao Prisma (Server Actions)
 * ou chamadas fetch para sua API (/api/products).
 */

export const api = {
  products: {
    list: async (): Promise<Product[]> => {
      await delay(600);
      return [...MOCK_INVENTORY];
    },
    create: async (product: Product): Promise<Product> => {
      await delay(800);
      console.log('API: Creating product', product);
      return product;
    },
    update: async (product: Product): Promise<Product> => {
      await delay(500);
      console.log('API: Updating product', product);
      return product;
    }
  },
  
  tenants: {
    list: async (): Promise<Tenant[]> => {
      await delay(600);
      return [...MOCK_TENANTS];
    },
    updateStatus: async (id: string, status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'): Promise<void> => {
      await delay(400);
      console.log(`API: Tenant ${id} status changed to ${status}`);
    }
  }
};
