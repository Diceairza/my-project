
import React from 'react';

export enum InvoiceStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
  VOID = 'Void',
  PARTIALLY_PAID = 'Partially Paid', // Added for clarity
}

export enum QuoteStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  CONVERTED = 'Converted to Invoice',
  EXPIRED = 'Expired',
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  address?: string;
}

export interface BaseDocument {
  id: string;
  number: string;
  customer: Customer;
  issueDate: string;
  items: LineItem[];
  subtotal: number;
  taxRate: number; // Percentage, e.g., 10 for 10%
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  currency: string; // e.g., 'USD', 'AUD'
}

export interface Invoice extends BaseDocument {
  dueDate: string;
  status: InvoiceStatus;
  paymentRecords?: PaymentRecord[];
  projectId?: string; // For Job & Project Tracking
  publicViewId?: string; // For public payment links, can be same as id
  daysOverdue?: number; // For display in InvoiceList
}

export interface Quote extends BaseDocument {
  expiryDate: string;
  status: QuoteStatus;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method?: string; // e.g., 'Credit Card', 'Bank Transfer', 'Cash'
  reference?: string; // For manual payments
  gateway?: string; // e.g., 'Stripe', 'PayPal', 'Ozow', 'PayFast'
  gatewayTransactionId?: string; // ID from the payment gateway
  paymentMethodType?: 'Online' | 'Manual' | string; // To distinguish online vs manual payments
  paymentMethodDetails?: string; // Specifics for manual like Cheque No.
}

// For Recharts example
export interface ChartDataPoint {
  name: string;
  value: number;
}

// For Sidebar module definition
export interface ModuleInfo {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
  subModules?: ModuleInfo[]; // For nested navigation if needed
}

// Inventory Management Types
export enum CostTrackingMethod {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  AVERAGE_COST = 'Average Cost',
  STANDARD_COST = 'Standard Cost',
}

export interface InventoryLocation {
  id: string;
  name: string;
  address?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactEmail?: string;
  phone?: string;
  defaultTaxRate?: number; // Useful for supplier-specific tax rates if applicable
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string; // Stock Keeping Unit
  description?: string;
  category?: string;
  unit: string; // e.g., 'pcs', 'kg', 'ltr', 'box'
  purchaseCost: number; // Cost to acquire one unit
  salePrice: number; // Price at which one unit is sold
  currentStock: number; // Quantity on hand
  reorderLevel: number; // Minimum stock level before reordering is triggered
  optimumLevel?: number; // Maximum or ideal stock level
  preferredSupplierId?: string; // ID of the preferred supplier
  locationId?: string; // ID of the primary location (for simple multi-location)
  costTrackingMethod?: CostTrackingMethod;
  imageUrl?: string; // URL for item image
  barcode?: string; // UPC/EAN or other barcode
  notes?: string;
}

export interface StockAdjustment {
    id: string;
    itemId: string;
    itemName: string; // For display
    date: string;
    quantityChange: number; // Positive for increase, negative for decrease
    reason: string;
    notes?: string;
}


// Banking & Cash Flow Types
export enum BankAccountType {
  BANK_ACCOUNT = 'Bank Account',
  CREDIT_CARD = 'Credit Card',
  PETTY_CASH = 'Petty Cash',
}

export interface BankAccount {
  id: string;
  accountName: string;
  bankName?: string; // Optional, as petty cash might not have a bank
  accountType: BankAccountType;
  accountNumberMasked?: string; // e.g., **** **** **** 1234
  currency: string; // e.g., ZAR
  balance: number;
  lastRefreshed?: string; // For simulated bank feeds
}

export enum BankTransactionType {
  DEBIT = 'Debit', // Money out
  CREDIT = 'Credit', // Money in
}

export enum BankTransactionStatus {
  UNRECONCILED = 'Unreconciled',
  RECONCILED = 'Reconciled',
  PENDING = 'Pending', // For transactions that haven't cleared yet
}

export interface BankTransaction {
  id: string;
  accountId: string; // Links to BankAccount
  date: string; // Transaction date
  description: string; // What the bank shows
  payeeOrSource?: string; // Who was paid or where money came from
  amount: number; // Always positive, type determines inflow/outflow
  type: BankTransactionType; // Debit or Credit
  status: BankTransactionStatus;
  category?: string; // User-assigned category, e.g., 'Office Supplies', 'Revenue'
  notes?: string;
}

// Bills & Expense Management Types
export enum BillStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted', // Submitted for approval
  AWAITING_PAYMENT = 'Awaiting Payment', // Approved, ready to be paid
  PAID = 'Paid',
  PARTIALLY_PAID = 'Partially Paid',
  OVERDUE = 'Overdue',
  VOID = 'Void',
}

export interface BillLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number; // Item-specific tax rate if different from bill default
  total: number;
}

export interface Bill {
  id: string;
  supplierId: string;
  billNumber: string; // Supplier's invoice number
  billDate: string; // Date on supplier's bill
  dueDate: string;
  items: BillLineItem[];
  subtotal: number;
  taxRate: number; // Overall tax rate for the bill
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: BillStatus;
  paidAmount?: number;
  paymentDate?: string;
  notes?: string;
  attachments?: { name: string; url: string }[]; // Simulated attachments
  projectId?: string; // For Job & Project Tracking
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
}

export enum PaymentMethod {
  CASH = 'Cash',
  CREDIT_CARD = 'Credit Card',
  BANK_TRANSFER = 'Bank Transfer',
  COMPANY_CARD = 'Company Card',
  CHEQUE = 'Cheque',
  OTHER = 'Other',
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  categoryId: string;
  supplierId?: string; // Optional, if expense is from a known supplier
  amount: number;
  currency: string;
  taxAmount?: number; // Optional, if tax is tracked separately for expenses
  paymentMethod?: PaymentMethod;
  paidFromAccountId?: string; // Link to BankAccount if paid from specific account
  status?: 'Pending' | 'Approved' | 'Reimbursed' | 'Rejected'; // For expense claims workflow
  receiptUrl?: string; // URL to the uploaded receipt
  notes?: string;
  projectId?: string; // For Job & Project Tracking
}

// Taxation Module Types
export interface TaxSummaryData {
  totalSalesGross: number;
  totalTaxableSalesNet: number;
  gstCollected: number;
  totalPurchasesGross: number;
  totalTaxablePurchasesNet: number;
  gstPaid: number;
  netGstPosition: number;
  currency: string;
  taxRate: number;
  periodStart?: string; // For date-filtered reports
  periodEnd?: string;   // For date-filtered reports
}

// Payroll & Workforce Management Types
export enum EmployeeStatus {
  ACTIVE = 'Active',
  ON_LEAVE = 'On Leave',
  PROBATION = 'Probation',
  TERMINATED = 'Terminated',
  RESIGNED = 'Resigned',
}

export enum PayFrequency {
  WEEKLY = 'Weekly',
  BI_WEEKLY = 'Bi-Weekly', // Every two weeks
  MONTHLY = 'Monthly',
  FORTNIGHTLY = 'Fortnightly', 
}

export enum DeductionType {
  PAYE = 'PAYE (Tax)', 
  UIF = 'UIF (Unemployment)', 
  SDL = 'SDL (Skills Levy)', 
  PENSION = 'Pension Fund',
  MEDICAL_AID = 'Medical Aid',
  GARNISHEE = 'Garnishee Order',
  OTHER = 'Other',
}

export interface AllowanceDeductionItem {
    id: string;
    description: string;
    type: 'Allowance' | 'Deduction';
    amount: number;
    recurring: boolean;
}

export interface Employee {
  id: string;
  employeeId: string; 
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  idNumber?: string; 
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';

  email: string;
  phoneNumber?: string;
  address?: {
    street: string;
    suburb: string;
    city: string;
    postalCode: string;
    country: string;
  };

  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;

  bankName?: string;
  bankBranchCode?: string;
  bankAccountNumber?: string;
  bankAccountType?: 'Cheque' | 'Savings' | 'Transmission'; 

  sarsTaxNumber?: string; 
  taxOffice?: string; 

  jobTitle: string;
  department?: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  startDate: string;
  endDate?: string; 
  reportsToEmployeeId?: string; 
  
  payRate: number; 
  payFrequency: PayFrequency;
  currency: string; 
  
  allowances?: AllowanceDeductionItem[];
  deductions?: AllowanceDeductionItem[];
  
  leaveBalance?: {
    [key in LeaveType]?: number; // e.g., { ANNUAL_LEAVE: 15, SICK_LEAVE: 10 }
  };

  status: EmployeeStatus;
  notes?: string;
}

export enum LeaveType {
  ANNUAL_LEAVE = 'Annual Leave',
  SICK_LEAVE = 'Sick Leave',
  FAMILY_RESPONSIBILITY_LEAVE = 'Family Responsibility Leave',
  MATERNITY_LEAVE = 'Maternity Leave',
  PARENTAL_LEAVE = 'Parental Leave', 
  STUDY_LEAVE = 'Study Leave',
  UNPAID_LEAVE = 'Unpaid Leave',
  OTHER = 'Other',
}

export enum LeaveRequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED_BY_EMPLOYEE = 'Cancelled by Employee',
  CANCELLED_BY_ADMIN = 'Cancelled by Admin',
  TAKEN = 'Taken', 
}

export interface LeaveRequest {
  id: string;
  employeeId: string; 
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  numberOfDays?: number; 
  reason?: string; 
  status: LeaveRequestStatus;
  requestedDate: string; 
  approvedByEmployeeId?: string; 
  processedDate?: string; 
  comments?: string; 
}

// Reporting & Analytics Types
export type ReportPeriod = 'all_time' | 'this_month' | 'this_quarter' | 'this_year' | 'last_month' | 'last_quarter' | 'last_year' | 'custom';

export interface ProfitAndLossData {
  currency: string;
  revenue: { total: number; sources: { name: string; amount: number }[] }; 
  costOfGoodsSold: { total: number; details?: { name: string; amount: number }[] }; 
  grossProfit: number;
  operatingExpenses: { total: number; categories: { name: string; amount: number }[] };
  operatingProfit: number; 
}

export interface BalanceSheetData {
  currency: string;
  asOfDate: string;
  assets: {
    total: number;
    current: { total: number; cash: number; accountsReceivable: number; inventory: number; other?: number };
    nonCurrent?: { total: number; propertyPlantEquipment?: number; intangibleAssets?: number; other?: number };
  };
  liabilities: {
    total: number;
    current: { total: number; accountsPayable: number; shortTermDebt?: number; taxPayable: number; other?: number };
    nonCurrent?: { total: number; longTermDebt?: number; other?: number };
  };
  equity: {
    total: number;
  };
}

export interface CashFlowData {
  currency: string;
  totalInflows: number;
  totalOutflows: number;
  netCashFlow: number;
  inflowsByCategory: { category: string; amount: number }[];
  outflowsByCategory: { category: string; amount: number }[];
}

export interface AgedDocument {
  id: string;
  documentNumber: string;
  customerOrSupplierName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  amountDue: number;
  daysOverdue: number;
  currency: string;
  status: InvoiceStatus | BillStatus;
}

// Job & Project Tracking Types
export enum ProjectStatus {
  PLANNING = 'Planning',
  ACTIVE = 'Active',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  customerId?: string; 
  startDate?: string;
  endDate?: string;
  budget?: number; 
  status: ProjectStatus;
  currency: string; 
}

// General Ledger Types
export enum AccountType {
  ASSET = 'Asset',
  LIABILITY = 'Liability',
  EQUITY = 'Equity',
  INCOME = 'Income',
  EXPENSE = 'Expense',
  COST_OF_SALES = 'Cost of Sales', 
}

export interface ChartOfAccount {
  id: string;
  accountNumber: string; 
  name: string;
  type: AccountType;
  description?: string;
  parentAccountId?: string; 
  balance?: number; 
  isSystemAccount?: boolean; 
  currency: string;
}

export interface JournalEntryLine {
  id: string;
  accountId: string; 
  debit: number; 
  credit: number; 
  description?: string; 
}

export enum JournalEntryStatus {
  DRAFT = 'Draft',
  POSTED = 'Posted',
  VOID = 'Void',
}

export interface JournalEntry {
  id: string;
  entryNumber: string; 
  date: string;
  description: string; 
  lines: JournalEntryLine[];
  status: JournalEntryStatus;
  totalDebits: number;
  totalCredits: number;
  currency: string;
}

// User Management Types
export interface User {
  id: string;
  username: string;
  password?: string; 
  fullName: string;
  role: 'Admin' | 'Bookkeeper' | 'Sales' | 'Staff' | 'Payroll Manager'; // Added Payroll Manager
  email?: string;
  isActive?: boolean;
  lastLogin?: string; // Added for User Management display
}
