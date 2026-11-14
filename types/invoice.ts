export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface SenderInfo {
  businessName: string;
  address: string;
  email: string;
  phone: string; // Nomor WhatsApp
  bankDetails: BankDetails;
}

export interface ClientInfo {
  name: string;
  company: string;
  email: string;
  phone: string; // Nomor WhatsApp
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type DiscountType = 'fixed' | 'percentage';

export interface Discount {
  type: DiscountType;
  value: number;
}

export interface Invoice {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  sender: SenderInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  discount: Discount | number; // supports structured Discount or simple number
  taxRate: number; // Persentase PPN (%)
  notes?: string;
}
