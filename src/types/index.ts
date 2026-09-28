export type Language = 'uz' | 'ru' | 'en';

export type Currency = 'UZS' | 'USD' | 'EUR' | 'RUB';

export type UserRole = 'owner' | 'manager' | 'employee';

export type BusinessType = 
  | 'retail' 
  | 'restaurant' 
  | 'service' 
  | 'online_store' 
  | 'freelancer' 
  | 'workshop' 
  | 'other';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  businessIds: string[];
  activeBusinessId: string;
  language: Language;
  avatar?: string;
}

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  currency: Currency;
  initialBalance: number;
  cashBalance: number;
  bankBalance: number;
  address?: string;
  phone?: string;
  email?: string;
  taxNumber?: string;
  taxRate?: number; // percentage, e.g. 4% or 12%
  createdAt: string;
  updatedAt: string;
}

export interface BusinessMember {
  id: string;
  businessId: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  purchasePrice: number; // Cost of Goods Sold base
  sellingPrice: number;
  quantity: number;
  minStock: number;
  supplierId?: string;
  supplierName?: string;
  unit: string; // 'dona', 'kg', 'litr', 'metr', 'quti'
  image?: string;
  description?: string;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  totalPaid: number;
  currentDebt: number; // amount customer owes to business
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  currentDebt: number; // amount business owes to supplier
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number; // for COGS calculation
  total: number;
  unit: string;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  businessId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingDebt: number;
  paymentMethod: 'cash' | 'card' | 'bank' | 'other';
  status: 'completed' | 'partial' | 'debt';
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface Purchase {
  id: string;
  businessId: string;
  supplierId?: string;
  supplierName: string;
  items: PurchaseItem[];
  totalAmount: number;
  paidAmount: number;
  remainingDebt: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMethod: 'cash' | 'card' | 'bank' | 'other';
  purchaseDate: string;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  businessId: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'card' | 'bank' | 'other';
  description: string;
  receipt?: string;
  createdAt: string;
  createdBy: string;
}

export interface Debt {
  id: string;
  businessId: string;
  type: 'receivable' | 'payable'; // receivable = customer owes us, payable = we owe supplier
  partyId?: string;
  partyName: string;
  partyPhone?: string;
  originalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  notes?: string;
  relatedSaleId?: string;
  relatedPurchaseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DebtPayment {
  id: string;
  businessId: string;
  debtId: string;
  partyName: string;
  type: 'receivable' | 'payable';
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank' | 'other';
  date: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface Transaction {
  id: string;
  businessId: string;
  type: 'sale' | 'purchase' | 'expense' | 'customer_payment' | 'supplier_payment' | 'adjustment' | 'refund';
  amount: number;
  isIncome: boolean;
  relatedPerson?: string;
  paymentMethod: 'cash' | 'card' | 'bank' | 'other';
  description: string;
  referenceId?: string;
  createdBy: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  businessId: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface AuditLog {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  action: string;
  objectType: string;
  objectId?: string;
  details: string;
  createdAt: string;
}

export type DateFilter = 'today' | 'yesterday' | 'week' | 'month' | 'last_month' | 'all' | 'custom';
