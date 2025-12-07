export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN', // Dono do SaaS
  CLINIC_ADMIN = 'CLINIC_ADMIN', // Dono da Clínica
  CLINIC_STAFF = 'CLINIC_STAFF' // Funcionário
}

export interface Batch {
  id: string;
  batchNumber: string; // Número do Lote
  expiryDate: string; // YYYY-MM-DD
  quantity: number;
  entryDate: string;
  supplier?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  minStockLevel: number;
  unit: string; // ml, un, cx
  price: number;
  batches: Batch[];
}

export interface Tenant {
  id: string;
  name: string; // Nome da Clínica
  ownerName: string;
  email: string;
  password?: string; // Added for mock auth
  plan: 'PRO'; // Single Plan SaaS
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  paymentStatus?: 'PAID' | 'OVERDUE'; // Controle financeiro
  joinedDate: string;
}

export interface DashboardStats {
  totalValue: number;
  lowStockCount: number;
  expiredCount: number;
  expiringSoonCount: number; // 30 dias
}