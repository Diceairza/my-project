import { Invoice, Bill, InvoiceStatus, BillStatus, AgedDocument } from '../../types';

export const calculateDaysOverdue = (dueDate: string, currentDate: Date = new Date()): number => {
  const due = new Date(dueDate);
  // Set time to 0 to compare dates only, ignoring time differences within the same day.
  due.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  if (currentDate <= due) {
    return 0; // Not overdue or due today
  }
  const diffTime = Math.abs(currentDate.getTime() - due.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getAgingBucket = (daysOverdue: number): string => {
  if (daysOverdue <= 0) return 'Current';
  if (daysOverdue <= 30) return '1-30 Days';
  if (daysOverdue <= 60) return '31-60 Days';
  if (daysOverdue <= 90) return '61-90 Days';
  return '90+ Days';
};

export const generateAgedReceivables = (invoices: Invoice[], currentDate: Date = new Date()): AgedDocument[] => {
  return invoices
    .filter(inv => inv.status !== InvoiceStatus.PAID && inv.status !== InvoiceStatus.DRAFT && inv.status !== InvoiceStatus.VOID)
    .map(inv => {
      const daysOverdue = calculateDaysOverdue(inv.dueDate, new Date(currentDate)); // ensure new Date object for currentDate
      // Simplified: amountDue is totalAmount. In reality, it would be totalAmount - paidAmount.
      const amountDue = inv.totalAmount - (inv.paymentRecords?.reduce((sum, pr) => sum + pr.amount, 0) || 0);
      return {
        id: inv.id,
        documentNumber: inv.number,
        customerOrSupplierName: inv.customer.name,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        totalAmount: inv.totalAmount,
        amountDue: amountDue,
        daysOverdue: daysOverdue,
        currency: inv.currency,
        status: inv.status,
      };
    })
    .sort((a,b) => b.daysOverdue - a.daysOverdue); // Sort by most overdue first
};

export const generateAgedPayables = (bills: Bill[], currentDate: Date = new Date()): AgedDocument[] => {
  return bills
    .filter(bill => bill.status !== BillStatus.PAID && bill.status !== BillStatus.DRAFT && bill.status !== BillStatus.VOID)
    .map(bill => {
      const daysOverdue = calculateDaysOverdue(bill.dueDate, new Date(currentDate)); // ensure new Date object for currentDate
      // Simplified: amountDue is totalAmount. In reality, it would be totalAmount - paidAmount.
      const amountDue = bill.totalAmount - (bill.paidAmount || 0);
      return {
        id: bill.id,
        documentNumber: bill.billNumber,
        customerOrSupplierName: bill.supplierId, // Placeholder, would need to resolve to supplier name
        issueDate: bill.billDate,
        dueDate: bill.dueDate,
        totalAmount: bill.totalAmount,
        amountDue: amountDue,
        daysOverdue: daysOverdue,
        currency: bill.currency,
        status: bill.status,
      };
    })
    .sort((a,b) => b.daysOverdue - a.daysOverdue);
};
