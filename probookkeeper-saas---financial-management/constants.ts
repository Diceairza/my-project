
import React from 'react';
import { ModuleInfo, Customer, Supplier, InventoryLocation, InventoryItem, CostTrackingMethod, BankAccount, BankAccountType, BankTransaction, BankTransactionType, BankTransactionStatus, Bill, BillStatus, ExpenseCategory, Expense, PaymentMethod, BillLineItem, Invoice, InvoiceStatus, LineItem, Employee, PayFrequency, EmployeeStatus, LeaveType, LeaveRequest, LeaveRequestStatus, ReportPeriod, Project, ProjectStatus, ChartOfAccount, AccountType, JournalEntry, JournalEntryStatus, JournalEntryLine, User, AllowanceDeductionItem } from './types';
import { HomeIcon, FileTextIcon, PackageIcon, LandmarkIcon, ReceiptIcon, PercentIcon, UsersIcon, BarChart3Icon, BriefcaseIcon, CreditCardIcon, GlobeIcon, SmartphoneIcon, LinkIcon, BookOpenIcon, UserCogIcon, CalendarClockIcon, ClipboardListIcon } from './components/icons/LucideIcons'; // Removed ALIASED_ClipboardListIcon

export const APP_NAME = "ProBookkeeper SaaS";
export const DEFAULT_CURRENCY = "ZAR"; 
export const DEFAULT_TAX_RATE = 15; 
export const AUTH_TOKEN_KEY = 'probookkeeper_auth_user_id';


export const APP_MODULES: ModuleInfo[] = [
  { id: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: React.createElement(HomeIcon, { className: "w-5 h-5" }) },
  { id: 'invoicing', name: 'Invoicing & Quoting', path: '/invoicing', icon: React.createElement(FileTextIcon, { className: "w-5 h-5" }) },
  { id: 'inventory', name: 'Inventory Management', path: '/inventory', icon: React.createElement(PackageIcon, { className: "w-5 h-5" }) },
  { id: 'banking', name: 'Banking & Cash Flow', path: '/banking', icon: React.createElement(LandmarkIcon, { className: "w-5 h-5" }) },
  { id: 'expenses', name: 'Bills & Expense Management', path: '/expenses', icon: React.createElement(ReceiptIcon, { className: "w-5 h-5" }) },
  { id: 'taxation', name: 'Taxation', path: '/taxation', icon: React.createElement(PercentIcon, { className: "w-5 h-5" }) },
  { id: 'payroll', name: 'Payroll & Workforce', path: '/payroll', icon: React.createElement(UsersIcon, { className: "w-5 h-5" }) },
  { id: 'reporting', name: 'Reporting & Analytics', path: '/reporting', icon: React.createElement(BarChart3Icon, { className: "w-5 h-5" }) },
  { id: 'projects', name: 'Job & Project Tracking', path: '/projects', icon: React.createElement(ClipboardListIcon, { className: "w-5 h-5" }) }, 
  { id: 'payments', name: 'Online Payments', path: '/payments', icon: React.createElement(CreditCardIcon, { className: "w-5 h-5" }) },
  { id: 'ledger', name: 'General Ledger', path: '/ledger', icon: React.createElement(BookOpenIcon, { className: "w-5 h-5" }) },
  { id: 'usermanagement', name: 'User Management', path: '/user-management', icon: React.createElement(UserCogIcon, { className: "w-5 h-5" }) },
  { id: 'mobileweb', name: 'Mobile & Web Access', path: '/mobile-web', icon: React.createElement(SmartphoneIcon, { className: "w-5 h-5" }) },
  { id: 'integrations', name: 'Integrations', path: '/integrations', icon: React.createElement(LinkIcon, { className: "w-5 h-5" }) },
  { id: 'scheduling', name: 'Scheduling & Automation', path: '/scheduling', icon: React.createElement(CalendarClockIcon, { className: "w-5 h-5" }) },
];

export const MOCK_USERS: User[] = [
  { id: 'user_admin', username: 'admin', password: 'password123', fullName: 'Admin User', role: 'Admin', email: 'admin@example.co.za', isActive: true, lastLogin: '2024-07-28T10:00:00Z' },
  { id: 'user_bookkeeper', username: 'bookkeeper', password: 'password123', fullName: 'Bookkeeper Joe', role: 'Bookkeeper', email: 'bookkeeper@example.co.za', isActive: true, lastLogin: '2024-07-27T15:30:00Z' },
  { id: 'user_sales', username: 'sales', password: 'password123', fullName: 'Sales Person Sally', role: 'Sales', email: 'sales@example.co.za', isActive: true, lastLogin: '2024-07-28T09:00:00Z' },
  { id: 'user_payroll', username: 'payrollmgr', password: 'password123', fullName: 'Payroll Manager Pat', role: 'Payroll Manager', email: 'payroll@example.co.za', isActive: true, lastLogin: '2024-07-26T11:00:00Z' },
  { id: 'user_staff_inactive', username: 'staff_inactive', password: 'password123', fullName: 'Inactive Staff Member', role: 'Staff', email: 'inactive@example.co.za', isActive: false },
];


export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'cust_1', name: 'Alpha Corp SA (Pty) Ltd', email: 'alpha@example.co.za' },
  { id: 'cust_2', name: 'Beta Solutions CC', email: 'beta@example.co.za' },
  { id: 'cust_3', name: 'Gamma Enterprises SA', email: 'gamma@example.co.za' },
];

export const MOCK_ITEMS_CATALOG = [
  { id: 'item_1', name: 'Web Design Service', unitPrice: 1200 },
  { id: 'item_2', name: 'Consulting Hour', unitPrice: 850 }, 
  { id: 'item_3', name: 'Software License Annual', unitPrice: 7500 },
  { id: 'item_4', name: 'Graphic Design Package', unitPrice: 4500 }, 
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup_1', name: 'SA Office Supplies Pty Ltd', contactEmail: 'sales@saoffice.co.za', defaultTaxRate: 15 },
  { id: 'sup_2', name: 'Tech Component Hub SA', contactEmail: 'support@techhubsa.co.za', defaultTaxRate: 15 },
  { id: 'sup_3', name: 'Premium Print Africa', contactEmail: 'orders@premiumprint.africa', defaultTaxRate: 15 },
  { id: 'sup_4', name: 'Eskom SOC Ltd', contactEmail: 'billing@eskom.co.za', defaultTaxRate: 0 }, 
  { id: 'sup_5', name: 'Telkom SA SOC Ltd', contactEmail: 'accounts@telkom.co.za', defaultTaxRate: 15 },
];

export const MOCK_LOCATIONS: InventoryLocation[] = [
  { id: 'loc_1', name: 'JHB Main Warehouse', address: '123 Industrial Rd, Johannesburg' },
  { id: 'loc_2', name: 'CPT Downtown Store', address: '45 Main St, Cape Town' },
  { id: 'loc_3', name: 'DBN East Storage', address: '789 Storage Ln, Durban' },
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'invitem_1',
    name: 'Wireless Ergonomic Mouse',
    sku: 'MOUS-ERGO-WL-001',
    category: 'Computer Peripherals',
    unit: 'pcs',
    purchaseCost: 350.00, 
    salePrice: 699.00, 
    currentStock: 150,
    reorderLevel: 25,
    optimumLevel: 200,
    preferredSupplierId: 'sup_2',
    locationId: 'loc_1',
    costTrackingMethod: CostTrackingMethod.AVERAGE_COST,
    description: 'Comfortable wireless mouse with ergonomic design.',
    barcode: '7890123456789'
  },
  {
    id: 'invitem_2',
    name: 'A4 Ream Printer Paper (80gsm)',
    sku: 'PAPR-A4-80G-500S',
    category: 'Office Supplies',
    unit: 'ream',
    purchaseCost: 65.00, 
    salePrice: 95.00, 
    currentStock: 500,
    reorderLevel: 100,
    optimumLevel: 600,
    preferredSupplierId: 'sup_1',
    locationId: 'loc_1',
    costTrackingMethod: CostTrackingMethod.FIFO,
    description: 'Standard A4 printer paper, 500 sheets per ream.'
  },
  {
    id: 'invitem_3',
    name: 'Premium Coffee Beans (1kg Bag)',
    sku: 'COFF-PREM-ROAST-1KG',
    category: 'Pantry Supplies',
    unit: 'bag',
    purchaseCost: 220.00, 
    salePrice: 350.00, 
    currentStock: 80,
    reorderLevel: 20,
    optimumLevel: 100,
    preferredSupplierId: 'sup_3',
    locationId: 'loc_2',
    costTrackingMethod: CostTrackingMethod.LIFO,
    description: 'High-quality roasted coffee beans for office pantry.'
  },
  {
    id: 'invitem_4',
    name: 'USB-C Hub (7-in-1)',
    sku: 'HUBC-7IN1-ALU',
    category: 'Computer Accessories',
    unit: 'pcs',
    purchaseCost: 280.00, 
    salePrice: 599.00, 
    currentStock: 75,
    reorderLevel: 15,
    optimumLevel: 100,
    preferredSupplierId: 'sup_2',
    locationId: 'loc_1',
    costTrackingMethod: CostTrackingMethod.AVERAGE_COST,
    description: 'Aluminum USB-C Hub with HDMI, USB 3.0, SD card reader.'
  },
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'ba_1',
    accountName: 'FNB Business Cheque',
    bankName: 'First National Bank',
    accountType: BankAccountType.BANK_ACCOUNT,
    accountNumberMasked: '********6789',
    currency: DEFAULT_CURRENCY,
    balance: 125670.50,
    lastRefreshed: '2024-07-28T10:00:00Z',
  },
  {
    id: 'ba_2',
    accountName: 'Standard Bank Credit Card',
    bankName: 'Standard Bank',
    accountType: BankAccountType.CREDIT_CARD,
    accountNumberMasked: '************5432',
    currency: DEFAULT_CURRENCY,
    balance: -18540.20, 
    lastRefreshed: '2024-07-28T09:30:00Z',
  },
  {
    id: 'ba_3',
    accountName: 'Office Petty Cash',
    accountType: BankAccountType.PETTY_CASH,
    currency: DEFAULT_CURRENCY,
    balance: 1250.00,
  }
];

export const MOCK_BANK_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'txn_1',
    accountId: 'ba_1',
    date: '2024-07-27',
    description: 'Payment from Alpha Corp SA',
    payeeOrSource: 'Alpha Corp SA (Pty) Ltd',
    amount: 13800.00,
    type: BankTransactionType.CREDIT,
    status: BankTransactionStatus.RECONCILED,
    category: 'Sales Revenue'
  },
  {
    id: 'txn_2',
    accountId: 'ba_1',
    date: '2024-07-26',
    description: 'Office Supplies Purchase - SA Office',
    payeeOrSource: 'SA Office Supplies Pty Ltd',
    amount: 2350.75,
    type: BankTransactionType.DEBIT,
    status: BankTransactionStatus.UNRECONCILED,
    category: 'Office Expenses'
  },
  {
    id: 'txn_3',
    accountId: 'ba_1',
    date: '2024-07-25',
    description: 'Monthly Software Subscription - TechHub',
    payeeOrSource: 'Tech Component Hub SA',
    amount: 899.00,
    type: BankTransactionType.DEBIT,
    status: BankTransactionStatus.RECONCILED,
    category: 'Software & Subscriptions'
  },
  {
    id: 'txn_4',
    accountId: 'ba_2',
    date: '2024-07-24',
    description: 'Client Lunch - The Grill House',
    payeeOrSource: 'The Grill House',
    amount: 650.00,
    type: BankTransactionType.DEBIT,
    status: BankTransactionStatus.UNRECONCILED,
    category: 'Meals & Entertainment'
  },
   {
    id: 'txn_5',
    accountId: 'ba_2',
    date: '2024-07-23',
    description: 'Online Advertising - Google Ads',
    payeeOrSource: 'Google Ads',
    amount: 1500.00,
    type: BankTransactionType.DEBIT,
    status: BankTransactionStatus.PENDING,
    category: 'Marketing'
  },
  {
    id: 'txn_6',
    accountId: 'ba_1',
    date: '2024-07-22',
    description: 'Payment from Beta Solutions',
    payeeOrSource: 'Beta Solutions CC',
    amount: 9775.00,
    type: BankTransactionType.CREDIT,
    status: BankTransactionStatus.RECONCILED,
    category: 'Sales Revenue'
  },
  {
    id: 'txn_7',
    accountId: 'ba_3',
    date: '2024-07-20',
    description: 'Courier Services',
    payeeOrSource: 'Local Courier',
    amount: 120.00,
    type: BankTransactionType.DEBIT,
    status: BankTransactionStatus.RECONCILED,
    category: 'Postage & Courier'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    name: 'Alpha Corp Website Redevelopment',
    customerId: 'cust_1',
    startDate: '2024-06-01',
    endDate: '2024-09-30',
    budget: 50000,
    status: ProjectStatus.ACTIVE,
    currency: DEFAULT_CURRENCY,
    description: 'Complete overhaul of the Alpha Corp SA corporate website with new CMS integration.'
  },
  {
    id: 'proj_2',
    name: 'Beta Solutions Marketing Campaign Q3',
    customerId: 'cust_2',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    budget: 25000,
    status: ProjectStatus.PLANNING,
    currency: DEFAULT_CURRENCY,
    description: 'Digital marketing campaign for Q3 including social media and PPC.'
  },
  {
    id: 'proj_3',
    name: 'Internal Software Upgrade Project',
    startDate: '2024-05-15',
    endDate: '2024-08-15',
    budget: 75000,
    status: ProjectStatus.COMPLETED,
    currency: DEFAULT_CURRENCY,
    description: 'Upgrade internal accounting software to latest version and migrate data.'
  }
];

export const MOCK_INVOICES: Invoice[] = [
    {
      id: 'inv_1',
      number: 'INV-2024-001',
      customer: MOCK_CUSTOMERS[0],
      issueDate: '2024-07-01',
      dueDate: '2024-07-31',
      items: [{ id: 'item_1_1', description: 'Web Design Service', quantity: 1, unitPrice: 12000, total: 12000 }],
      subtotal: 12000,
      taxRate: DEFAULT_TAX_RATE,
      taxAmount: 12000 * (DEFAULT_TAX_RATE / 100),
      totalAmount: 12000 + (12000 * (DEFAULT_TAX_RATE / 100)),
      status: InvoiceStatus.SENT,
      currency: DEFAULT_CURRENCY,
      projectId: 'proj_1' 
    },
    {
      id: 'inv_2',
      number: 'INV-2024-002',
      customer: MOCK_CUSTOMERS[1],
      issueDate: '2024-07-15',
      dueDate: '2024-08-15',
      items: [{ id: 'item_2_1', description: 'Consulting Hour', quantity: 10, unitPrice: 850, total: 8500 }],
      subtotal: 8500,
      taxRate: DEFAULT_TAX_RATE,
      taxAmount: 8500 * (DEFAULT_TAX_RATE / 100),
      totalAmount: 8500 + (8500 * (DEFAULT_TAX_RATE / 100)),
      status: InvoiceStatus.PAID,
      currency: DEFAULT_CURRENCY,
      paymentRecords: [{ id: 'pr_1', date: '2024-07-22', amount: 8500 + (8500 * (DEFAULT_TAX_RATE / 100)), method: 'Bank Transfer', paymentMethodType: 'Manual'}]
    },
     {
      id: 'inv_3_vat_on_services',
      number: 'INV-2024-003',
      customer: MOCK_CUSTOMERS[2],
      issueDate: '2024-07-05', 
      dueDate: '2024-07-20', 
      items: [
        { id: 'line_3_1', description: MOCK_ITEMS_CATALOG[3].name, quantity: 1, unitPrice: MOCK_ITEMS_CATALOG[3].unitPrice, total: MOCK_ITEMS_CATALOG[3].unitPrice },
      ],
      subtotal: MOCK_ITEMS_CATALOG[3].unitPrice,
      taxRate: DEFAULT_TAX_RATE,
      taxAmount: MOCK_ITEMS_CATALOG[3].unitPrice * (DEFAULT_TAX_RATE / 100),
      totalAmount: MOCK_ITEMS_CATALOG[3].unitPrice * (1 + DEFAULT_TAX_RATE / 100),
      status: InvoiceStatus.OVERDUE,
      currency: DEFAULT_CURRENCY,
      notes: "Graphic design package with standard VAT."
    },
    {
      id: 'inv_4_draft_no_vat_impact',
      number: 'INV-2024-004',
      customer: MOCK_CUSTOMERS[0],
      issueDate: '2024-07-20',
      dueDate: '2024-08-19',
      items: [
        { id: 'line_4_1', description: "Future Project Scoping", quantity: 5, unitPrice: 500, total: 2500 },
      ],
      subtotal: 2500,
      taxRate: DEFAULT_TAX_RATE,
      taxAmount: 2500 * (DEFAULT_TAX_RATE / 100),
      totalAmount: 2500 * (1 + DEFAULT_TAX_RATE / 100),
      status: InvoiceStatus.DRAFT, 
      currency: DEFAULT_CURRENCY,
    },
    {
      id: 'inv_5_partially_paid',
      number: 'INV-2024-005',
      customer: MOCK_CUSTOMERS[1],
      issueDate: '2024-06-01',
      dueDate: '2024-06-30', // Overdue
      items: [{ id: 'item_5_1', description: 'Large Consulting Project', quantity: 1, unitPrice: 50000, total: 50000 }],
      subtotal: 50000,
      taxRate: DEFAULT_TAX_RATE,
      taxAmount: 50000 * (DEFAULT_TAX_RATE / 100), // 7500
      totalAmount: 57500,
      status: InvoiceStatus.PARTIALLY_PAID,
      currency: DEFAULT_CURRENCY,
      paymentRecords: [
        { id: 'pr_5_1', date: '2024-06-15', amount: 20000, method: 'Bank Transfer', paymentMethodType: 'Manual', reference: 'Deposit'},
        { id: 'pr_5_2', date: '2024-07-10', amount: 15000, method: 'Card Online', paymentMethodType: 'Online', gateway: 'Simulated Stripe', gatewayTransactionId: 'sim_txn_123'}
      ],
      notes: 'Invoice is overdue, with partial payments made.'
    }
];

export const MOCK_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'ec_1', name: 'Office Supplies', description: 'Stationery, paper, ink, etc.' },
  { id: 'ec_2', name: 'Rent & Utilities', description: 'Office rent, electricity, water, internet.' },
  { id: 'ec_3', name: 'Software & Subscriptions', description: 'SaaS products, software licenses.' },
  { id: 'ec_4', name: 'Travel & Accommodation', description: 'Flights, hotels, taxi fares for business trips.' },
  { id: 'ec_5', name: 'Meals & Entertainment', description: 'Client lunches, team events.' },
  { id: 'ec_6', name: 'Marketing & Advertising', description: 'Online ads, promotional materials.' },
  { id: 'ec_7', name: 'Repairs & Maintenance', description: 'Office equipment repairs, vehicle maintenance.' },
  { id: 'ec_8', name: 'Telecommunications', description: 'Phone bills, mobile data.' },
  { id: 'ec_9', name: 'Consulting & Professional Fees', description: 'Legal, accounting, or other professional services.' },
  { id: 'ec_10', name: 'Bank Charges', description: 'Fees related to bank accounts.' },
  { id: 'ec_11', name: 'Cost of Goods Sold (COGS)', description: 'Direct costs attributable to the production of goods sold.' },
];

export const MOCK_BILLS: Bill[] = [
  {
    id: 'bill_1',
    supplierId: 'sup_1', 
    billNumber: 'SAOS-INV-7890',
    billDate: '2024-07-15',
    dueDate: '2024-08-14',
    items: [
      { id: 'bli_1_1', description: 'A4 Paper Reams', quantity: 10, unitPrice: 70, total: 700 },
      { id: 'bli_1_2', description: 'Pen Box (Blue)', quantity: 5, unitPrice: 25, total: 125 }
    ],
    subtotal: 825,
    taxRate: DEFAULT_TAX_RATE,
    taxAmount: 825 * (DEFAULT_TAX_RATE / 100),
    totalAmount: 825 + (825 * (DEFAULT_TAX_RATE / 100)), 
    currency: DEFAULT_CURRENCY,
    status: BillStatus.AWAITING_PAYMENT,
    notes: 'Office stationery order.',
    projectId: 'proj_3' 
  },
  {
    id: 'bill_2',
    supplierId: 'sup_5', 
    billNumber: 'TELKOM-ACC-12345',
    billDate: '2024-07-20',
    dueDate: '2024-07-25', 
    items: [ { id: 'bli_2_1', description: 'Fibre Internet Service - July', quantity: 1, unitPrice: 899, total: 899 }],
    subtotal: 899,
    taxRate: DEFAULT_TAX_RATE,
    taxAmount: 899 * (DEFAULT_TAX_RATE / 100),
    totalAmount: 899 + (899 * (DEFAULT_TAX_RATE / 100)), 
    currency: DEFAULT_CURRENCY,
    status: BillStatus.OVERDUE,
  },
  {
    id: 'bill_3',
    supplierId: 'sup_4', 
    billNumber: 'ESKOM-007',
    billDate: '2024-07-05',
    dueDate: '2024-07-25',
    items: [ { id: 'bli_3_1', description: 'Electricity Usage - June', quantity: 1, unitPrice: 2500, total: 2500 }],
    subtotal: 2500,
    taxRate: MOCK_SUPPLIERS.find(s=>s.id === 'sup_4')?.defaultTaxRate || 0, 
    taxAmount: 2500 * ((MOCK_SUPPLIERS.find(s=>s.id === 'sup_4')?.defaultTaxRate || 0) / 100),
    totalAmount: 2500 + (2500 * ((MOCK_SUPPLIERS.find(s=>s.id === 'sup_4')?.defaultTaxRate || 0) / 100)), 
    currency: DEFAULT_CURRENCY,
    status: BillStatus.PAID,
    paidAmount: 2500,
    paymentDate: '2024-07-22'
  }
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp_1',
    date: '2024-07-10',
    description: 'Team Lunch at Spur for Alpha Project Kickoff',
    categoryId: 'ec_5', 
    supplierId: undefined, 
    amount: 750.00,
    currency: DEFAULT_CURRENCY,
    taxAmount: 0, 
    paymentMethod: PaymentMethod.COMPANY_CARD,
    paidFromAccountId: 'ba_2', 
    status: 'Approved',
    receiptUrl: 'https://example.com/receipts/spur_lunch.pdf',
    notes: 'Client meeting with Beta Solutions.',
    projectId: 'proj_1' 
  },
  {
    id: 'exp_2',
    date: '2024-07-22',
    description: 'Parking for Client Meeting',
    categoryId: 'ec_4', 
    amount: 45.00,
    currency: DEFAULT_CURRENCY,
    paymentMethod: PaymentMethod.CASH,
    paidFromAccountId: 'ba_3', 
    status: 'Approved',
    receiptUrl: 'https://example.com/receipts/parking_jul22.jpg',
  },
  {
    id: 'exp_3',
    date: '2024-07-05',
    description: 'Adobe Creative Cloud Subscription for Design Team',
    categoryId: 'ec_3', 
    amount: 999.00,
    currency: DEFAULT_CURRENCY,
    taxAmount: 999.00 * (DEFAULT_TAX_RATE / 100), 
    paymentMethod: PaymentMethod.COMPANY_CARD,
    paidFromAccountId: 'ba_2',
    status: 'Approved',
    notes: 'Monthly subscription.',
    projectId: 'proj_1' 
  }
];

const defaultAllowances: AllowanceDeductionItem[] = [
    { id: 'allow_travel_1', description: 'Travel Allowance', type: 'Allowance', amount: 1500, recurring: true },
];
const defaultDeductions: AllowanceDeductionItem[] = [
    { id: 'ded_med_1', description: 'Medical Aid (Discovery)', type: 'Deduction', amount: 2500, recurring: true },
    { id: 'ded_pen_1', description: 'Pension Fund (Company Scheme)', type: 'Deduction', amount: 1200, recurring: true },
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp_1',
    employeeId: 'EMP001',
    firstName: 'Thabo',
    lastName: 'Molefe',
    dateOfBirth: '1985-03-15',
    idNumber: '8503155000080',
    gender: 'Male',
    email: 'thabo.molefe@example.co.za',
    phoneNumber: '0721234567',
    address: { street: '123 Main Road', suburb: 'Sandton', city: 'Johannesburg', postalCode: '2196', country: 'South Africa' },
    emergencyContactName: 'Sarah Molefe',
    emergencyContactPhone: '0821234567',
    emergencyContactRelationship: 'Spouse',
    bankName: 'First National Bank',
    bankBranchCode: '250655',
    bankAccountNumber: '62000012345',
    bankAccountType: 'Cheque',
    sarsTaxNumber: '1234567890',
    taxOffice: 'Johannesburg Central',
    jobTitle: 'Senior Developer',
    department: 'Technology',
    employmentType: 'Full-time',
    startDate: '2020-01-15',
    payRate: 750000, 
    payFrequency: PayFrequency.MONTHLY,
    currency: DEFAULT_CURRENCY,
    status: EmployeeStatus.ACTIVE,
    leaveBalance: { [LeaveType.ANNUAL_LEAVE]: 15, [LeaveType.SICK_LEAVE]: 10 },
    allowances: defaultAllowances,
    deductions: defaultDeductions,
  },
  {
    id: 'emp_2',
    employeeId: 'EMP002',
    firstName: 'Aisha',
    lastName: 'Patel',
    dateOfBirth: '1992-07-20',
    idNumber: '9207204000081',
    gender: 'Female',
    email: 'aisha.patel@example.co.za',
    phoneNumber: '0739876543',
    address: { street: '45 Beach Road', suburb: 'Sea Point', city: 'Cape Town', postalCode: '8005', country: 'South Africa' },
    emergencyContactName: 'Ahmed Patel',
    emergencyContactPhone: '0839876543',
    emergencyContactRelationship: 'Father',
    bankName: 'Standard Bank',
    bankBranchCode: '051001',
    bankAccountNumber: '07000098765',
    bankAccountType: 'Savings',
    sarsTaxNumber: '0987654321',
    taxOffice: 'Cape Town City Bowl',
    jobTitle: 'Marketing Manager',
    department: 'Marketing',
    employmentType: 'Full-time',
    startDate: '2022-03-01',
    payRate: 60000, 
    payFrequency: PayFrequency.MONTHLY,
    currency: DEFAULT_CURRENCY,
    status: EmployeeStatus.ACTIVE,
    leaveBalance: { [LeaveType.ANNUAL_LEAVE]: 20, [LeaveType.SICK_LEAVE]: 7, [LeaveType.FAMILY_RESPONSIBILITY_LEAVE]: 3 },
    allowances: [{id: 'allow_car_1', description: 'Car Allowance', type: 'Allowance', amount: 3000, recurring: true}],
    deductions: defaultDeductions,
  },
  {
    id: 'emp_3',
    employeeId: 'EMP003',
    firstName: 'Sipho',
    lastName: 'Ndlovu',
    dateOfBirth: '1998-11-05',
    idNumber: '9811056000085',
    gender: 'Male',
    email: 'sipho.ndlovu@example.co.za',
    phoneNumber: '0712345678',
    jobTitle: 'Junior Accountant',
    startDate: '2023-06-01',
    payRate: 25000, 
    payFrequency: PayFrequency.MONTHLY,
    currency: DEFAULT_CURRENCY,
    status: EmployeeStatus.PROBATION,
    leaveBalance: { [LeaveType.ANNUAL_LEAVE]: 5, [LeaveType.SICK_LEAVE]: 3 },
    deductions: [{id: 'ded_uif_1', description: 'UIF', type: 'Deduction', amount: 177.12, recurring: true}] // Example UIF for lower salary
  },
];

export const MOCK_LEAVE_TYPES: { value: LeaveType, label: string }[] = Object.values(LeaveType).map(lt => ({ value: lt, label: lt }));

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr_1',
    employeeId: 'emp_1',
    leaveType: LeaveType.ANNUAL_LEAVE,
    startDate: '2024-08-15',
    endDate: '2024-08-20',
    numberOfDays: 4, 
    reason: 'Family vacation',
    status: LeaveRequestStatus.PENDING,
    requestedDate: '2024-07-20',
  },
  {
    id: 'lr_2',
    employeeId: 'emp_2',
    leaveType: LeaveType.SICK_LEAVE,
    startDate: '2024-07-25',
    endDate: '2024-07-26',
    numberOfDays: 2,
    reason: 'Flu',
    status: LeaveRequestStatus.APPROVED,
    requestedDate: '2024-07-25',
    approvedByEmployeeId: 'admin_user', 
    processedDate: '2024-07-25',
    comments: 'Get well soon!',
  },
  {
    id: 'lr_3',
    employeeId: 'emp_1',
    leaveType: LeaveType.FAMILY_RESPONSIBILITY_LEAVE,
    startDate: '2024-09-02',
    endDate: '2024-09-02',
    numberOfDays: 1,
    reason: 'Child sick',
    status: LeaveRequestStatus.REJECTED,
    requestedDate: '2024-08-01',
    approvedByEmployeeId: 'admin_user',
    processedDate: '2024-08-02',
    comments: 'Annual leave balance too low for this period, consider unpaid leave.',
  },
];

export const MOCK_REPORT_PERIODS: { value: ReportPeriod, label: string }[] = [
    { value: 'all_time', label: 'All Time' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range...' }, 
];

export const MOCK_PAYMENT_GATEWAYS = [
  { id: 'stripe_sim', name: 'Card Payment (Simulated Stripe)'},
  { id: 'paypal_sim', name: 'PayPal (Simulated)'},
  { id: 'ozow_sim', name: 'Ozow EFT (Simulated)'},
  { id: 'payfast_sim', name: 'PayFast (Simulated)'},
];

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  { id: 'coa_1000', accountNumber: '1000', name: 'Current Assets', type: AccountType.ASSET, currency: DEFAULT_CURRENCY, isSystemAccount: true },
  { id: 'coa_1010', accountNumber: '1010', name: 'Cash and Cash Equivalents', type: AccountType.ASSET, parentAccountId: 'coa_1000', currency: DEFAULT_CURRENCY },
  { id: 'coa_1011', accountNumber: '1011', name: 'FNB Business Cheque', type: AccountType.ASSET, parentAccountId: 'coa_1010', balance: 125670.50, currency: DEFAULT_CURRENCY, isSystemAccount: true, description: 'Linked to Bank Account ba_1' },
  { id: 'coa_1012', accountNumber: '1012', name: 'Office Petty Cash', type: AccountType.ASSET, parentAccountId: 'coa_1010', balance: 1250.00, currency: DEFAULT_CURRENCY, isSystemAccount: true, description: 'Linked to Bank Account ba_3' },
  { id: 'coa_1200', accountNumber: '1200', name: 'Accounts Receivable', type: AccountType.ASSET, parentAccountId: 'coa_1000', balance: 0, currency: DEFAULT_CURRENCY, isSystemAccount: true, description: 'Money owed by customers' },
  { id: 'coa_1400', accountNumber: '1400', name: 'Inventory', type: AccountType.ASSET, parentAccountId: 'coa_1000', balance: MOCK_INVENTORY_ITEMS.reduce((sum, item) => sum + (item.currentStock * item.purchaseCost),0), currency: DEFAULT_CURRENCY, isSystemAccount: true },
  
  { id: 'coa_1500', accountNumber: '1500', name: 'Non-Current Assets', type: AccountType.ASSET, currency: DEFAULT_CURRENCY, isSystemAccount: true },
  { id: 'coa_1510', accountNumber: '1510', name: 'Office Equipment', type: AccountType.ASSET, parentAccountId: 'coa_1500', balance: 0, currency: DEFAULT_CURRENCY },
  { id: 'coa_1511', accountNumber: '1511', name: 'Office Equipment - Cost', type: AccountType.ASSET, parentAccountId: 'coa_1510', balance: 0, currency: DEFAULT_CURRENCY },
  { id: 'coa_1519', accountNumber: '1519', name: 'Office Equipment - Accumulated Depreciation', type: AccountType.ASSET, parentAccountId: 'coa_1510', balance: 0, currency: DEFAULT_CURRENCY, description: 'Contra-asset account' },

  { id: 'coa_2000', accountNumber: '2000', name: 'Current Liabilities', type: AccountType.LIABILITY, currency: DEFAULT_CURRENCY, isSystemAccount: true },
  { id: 'coa_2100', accountNumber: '2100', name: 'Accounts Payable', type: AccountType.LIABILITY, parentAccountId: 'coa_2000', balance: 0, currency: DEFAULT_CURRENCY, isSystemAccount: true, description: 'Money owed to suppliers' },
  { id: 'coa_2200', accountNumber: '2200', name: 'Credit Cards Payable', type: AccountType.LIABILITY, parentAccountId: 'coa_2000', currency: DEFAULT_CURRENCY },
  { id: 'coa_2201', accountNumber: '2201', name: 'Standard Bank Credit Card', type: AccountType.LIABILITY, parentAccountId: 'coa_2200', balance: 18540.20, currency: DEFAULT_CURRENCY, isSystemAccount: true, description: 'Linked to Bank Account ba_2' },
  { id: 'coa_2300', accountNumber: '2300', name: 'VAT Payable', type: AccountType.LIABILITY, parentAccountId: 'coa_2000', balance: 0, currency: DEFAULT_CURRENCY, isSystemAccount: true, description: 'VAT collected minus VAT paid' },
  { id: 'coa_2400', accountNumber: '2400', name: 'Salaries and Wages Payable', type: AccountType.LIABILITY, parentAccountId: 'coa_2000', balance: 0, currency: DEFAULT_CURRENCY, isSystemAccount: true },

  { id: 'coa_3000', accountNumber: '3000', name: 'Equity', type: AccountType.EQUITY, currency: DEFAULT_CURRENCY, isSystemAccount: true },
  { id: 'coa_3100', accountNumber: '3100', name: "Owner's Capital", type: AccountType.EQUITY, parentAccountId: 'coa_3000', balance: 0, currency: DEFAULT_CURRENCY },
  { id: 'coa_3200', accountNumber: '3200', name: "Owner's Drawings", type: AccountType.EQUITY, parentAccountId: 'coa_3000', balance: 0, currency: DEFAULT_CURRENCY },
  { id: 'coa_3300', accountNumber: '3300', name: 'Retained Earnings', type: AccountType.EQUITY, parentAccountId: 'coa_3000', balance: 0, currency: DEFAULT_CURRENCY, isSystemAccount: true },

  { id: 'coa_4000', accountNumber: '4000', name: 'Operating Revenue', type: AccountType.INCOME, currency: DEFAULT_CURRENCY },
  { id: 'coa_4010', accountNumber: '4010', name: 'Sales - Services', type: AccountType.INCOME, parentAccountId: 'coa_4000', balance: 0, currency: DEFAULT_CURRENCY },
  { id: 'coa_4020', accountNumber: '4020', name: 'Sales - Goods', type: AccountType.INCOME, parentAccountId: 'coa_4000', balance: 0, currency: DEFAULT_CURRENCY },
  { id: 'coa_4500', accountNumber: '4500', name: 'Other Income', type: AccountType.INCOME, balance: 0, currency: DEFAULT_CURRENCY },

  { id: 'coa_5000', accountNumber: '5000', name: 'Cost of Goods Sold', type: AccountType.COST_OF_SALES, balance: 0, currency: DEFAULT_CURRENCY },
  { id: 'coa_5010', accountNumber: '5010', name: 'Purchases - Inventory', type: AccountType.COST_OF_SALES, parentAccountId: 'coa_5000', balance: 0, currency: DEFAULT_CURRENCY },
  
  { id: 'coa_6000', accountNumber: '6000', name: 'Operating Expenses', type: AccountType.EXPENSE, currency: DEFAULT_CURRENCY },
  { id: 'coa_6010', accountNumber: '6010', name: 'Office Supplies Expense', type: AccountType.EXPENSE, parentAccountId: 'coa_6000', balance: 0, currency: DEFAULT_CURRENCY, description: 'Corresponds to Expense Category ec_1' },
  { id: 'coa_6020', accountNumber: '6020', name: 'Rent & Utilities Expense', type: AccountType.EXPENSE, parentAccountId: 'coa_6000', balance: 0, currency: DEFAULT_CURRENCY, description: 'Corresponds to Expense Category ec_2' },
  { id: 'coa_6030', accountNumber: '6030', name: 'Software & Subscriptions Expense', type: AccountType.EXPENSE, parentAccountId: 'coa_6000', balance: 0, currency: DEFAULT_CURRENCY, description: 'Corresponds to Expense Category ec_3' },
  { id: 'coa_6100', accountNumber: '6100', name: 'Salaries and Wages Expense', type: AccountType.EXPENSE, parentAccountId: 'coa_6000', balance: 0, currency: DEFAULT_CURRENCY },
  { id: 'coa_6110', accountNumber: '6110', name: 'Bank Charges', type: AccountType.EXPENSE, parentAccountId: 'coa_6000', balance: 0, currency: DEFAULT_CURRENCY, description: 'Corresponds to Expense Category ec_10' },
  { id: 'coa_6120', accountNumber: '6120', name: 'Marketing Expense', type: AccountType.EXPENSE, parentAccountId: 'coa_6000', balance: 0, currency: DEFAULT_CURRENCY, description: 'Corresponds to Expense Category ec_6' },
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je_1',
    entryNumber: 'JE-2024-001',
    date: '2024-07-27',
    description: 'Record cash sale and VAT for INV-2024-002 (Beta Solutions)',
    lines: [
      { id: 'jel_1_1', accountId: 'coa_1011', debit: 9775.00, credit: 0, description: 'Cash received FNB' }, 
      { id: 'jel_1_2', accountId: 'coa_4010', debit: 0, credit: 8500.00, description: 'Sales Revenue - Consulting' },
      { id: 'jel_1_3', accountId: 'coa_2300', debit: 0, credit: 1275.00, description: 'VAT Payable (15% on 8500)' },
    ],
    status: JournalEntryStatus.POSTED,
    totalDebits: 9775.00,
    totalCredits: 9775.00,
    currency: DEFAULT_CURRENCY,
  },
  {
    id: 'je_2',
    entryNumber: 'JE-2024-002',
    date: '2024-07-26',
    description: 'Payment for office supplies (Bill SAOS-INV-7890)',
    lines: [
      { id: 'jel_2_1', accountId: 'coa_2100', debit: 948.75, credit: 0, description: 'Reduce Accounts Payable for SA Office Supplies' },
      { id: 'jel_2_2', accountId: 'coa_1011', debit: 0, credit: 948.75, description: 'Cash paid from FNB' },
    ],
    status: JournalEntryStatus.DRAFT,
    totalDebits: 948.75,
    totalCredits: 948.75,
    currency: DEFAULT_CURRENCY,
  },
  {
    id: 'je_3',
    entryNumber: 'JE-2024-003',
    date: '2024-07-25',
    description: 'Record software subscription expense (TechHub)',
    lines: [
      { id: 'jel_3_1', accountId: 'coa_6030', debit: 781.74, credit: 0, description: 'Software Expense (Net)' }, 
      { id: 'jel_3_2', accountId: 'coa_2300', debit: 117.26, credit: 0, description: 'Input VAT claimed' }, 
      { id: 'jel_3_3', accountId: 'coa_1011', debit: 0, credit: 899.00, description: 'Payment from FNB' },
    ],
    status: JournalEntryStatus.POSTED,
    totalDebits: 899.00,
    totalCredits: 899.00,
    currency: DEFAULT_CURRENCY,
  },
];