import { Product, Tenant } from './types';

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'admin-saas',
    name: 'EstéticaStock HQ',
    ownerName: 'Admin Geral',
    email: 'admin@saas.com',
    password: 'admin',
    plan: 'PRO',
    status: 'ACTIVE',
    paymentStatus: 'PAID',
    joinedDate: '2023-01-01'
  },
  {
    id: 't1',
    name: 'Clínica Belleza Total',
    ownerName: 'Dra. Ana Silva',
    email: 'ana@belleza.com',
    password: '123',
    plan: 'PRO',
    status: 'ACTIVE',
    paymentStatus: 'PAID',
    joinedDate: '2023-05-12'
  },
  {
    id: 't2',
    name: 'Estética Avançada Dr. Pedro',
    ownerName: 'Dr. Pedro Costa',
    email: 'pedro@estetica.com',
    password: '123',
    plan: 'PRO',
    status: 'ACTIVE',
    paymentStatus: 'PAID',
    joinedDate: '2023-08-20'
  },
  {
    id: 't3',
    name: 'SkinGlow Spa',
    ownerName: 'Mariana Oliveira',
    email: 'mari@skinglow.com',
    password: '123',
    plan: 'PRO',
    status: 'SUSPENDED',
    paymentStatus: 'OVERDUE', // Pagamento Pendente
    joinedDate: '2024-01-10'
  },
  {
    id: 't4',
    name: 'DermatoCenter (Em Análise)',
    ownerName: 'Dr. Lucas Souza',
    email: 'lucas@dermatocenter.com',
    password: '123',
    plan: 'PRO',
    status: 'PENDING',
    paymentStatus: 'PAID',
    joinedDate: '2024-03-15'
  },
  {
    id: 't5',
    name: 'Harmony Estética',
    ownerName: 'Fernanda Lima',
    email: 'fernanda@harmony.com',
    password: '123',
    plan: 'PRO',
    status: 'PENDING',
    paymentStatus: 'PAID',
    joinedDate: '2024-03-16'
  }
];

export const MOCK_INVENTORY: Product[] = [
  {
    id: 'p1',
    sku: 'TOX-001',
    name: 'Toxina Botulínica Tipo A (100U)',
    description: 'Indicado para tratamento de rugas dinâmicas e hiperidrose.',
    category: 'Toxinas',
    imageUrl: 'https://picsum.photos/id/20/200/200',
    minStockLevel: 5,
    unit: 'frasco',
    price: 950.00,
    batches: [
      {
        id: 'b1',
        batchNumber: 'LOTE-A2024',
        expiryDate: '2024-12-30',
        quantity: 12,
        entryDate: '2023-11-01',
        supplier: 'BotoxPharma'
      },
      {
        id: 'b2',
        batchNumber: 'LOTE-B2025',
        expiryDate: '2025-06-15',
        quantity: 20,
        entryDate: '2024-02-15',
        supplier: 'BotoxPharma'
      }
    ]
  },
  {
    id: 'p2',
    sku: 'PRE-045',
    name: 'Preenchedor Ácido Hialurônico (Volume)',
    description: 'Preenchedor de alta densidade para contorno mandibular e malar.',
    category: 'Preenchedores',
    imageUrl: 'https://picsum.photos/id/24/200/200',
    minStockLevel: 10,
    unit: 'seringa',
    price: 680.00,
    batches: [
      {
        id: 'b3',
        batchNumber: 'VOL-998',
        expiryDate: '2024-05-20', // Expiring soon logic test
        quantity: 4,
        entryDate: '2023-01-10',
        supplier: 'DermaFill'
      }
    ]
  },
  {
    id: 'p3',
    sku: 'BIO-112',
    name: 'Bioestimulador de Colágeno',
    description: 'Estimulador de colágeno injetável, caixa com 2 frascos.',
    category: 'Bioestimuladores',
    imageUrl: 'https://picsum.photos/id/30/200/200',
    minStockLevel: 3,
    unit: 'caixa',
    price: 1200.00,
    batches: [] // Out of stock logic test
  },
  {
    id: 'p4',
    sku: 'DESC-009',
    name: 'Luvas de Procedimento (M)',
    description: 'Caixa com 100 unidades, látex free.',
    category: 'Descartáveis',
    imageUrl: 'https://picsum.photos/id/42/200/200',
    minStockLevel: 20,
    unit: 'caixa',
    price: 45.90,
    batches: [
       {
        id: 'b4',
        batchNumber: 'GLV-221',
        expiryDate: '2026-01-01',
        quantity: 50,
        entryDate: '2024-01-20',
        supplier: 'MedSafe'
      }
    ]
  }
];