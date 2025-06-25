
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal'; // For delete confirmation
import { Invoice, InvoiceStatus, PaymentRecord } from '../../types';
import { EditIcon, Trash2Icon, LinkIcon as PayLinkIcon, DollarSignIcon, AlertTriangleIcon, FileTextIcon, MailIcon } from '../../components/icons/LucideIcons'; 
import { calculateDaysOverdue } from '../reporting/reportUtils'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface InvoiceListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onRecordPayment: (invoice: Invoice) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onEdit, onDelete, onRecordPayment }) => {
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const openConfirmDeleteModal = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      onDelete(invoiceToDelete.id);
    }
    setIsConfirmDeleteModalOpen(false);
    setInvoiceToDelete(null);
  };
  
  const getStatusBadge = (status: InvoiceStatus) => {
    let bgColor = '';
    let textColor = '';
    switch (status) {
      case InvoiceStatus.PAID:
        bgColor = 'bg-emerald-100';
        textColor = 'text-emerald-700';
        break;
      case InvoiceStatus.SENT:
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        break;
      case InvoiceStatus.OVERDUE:
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        break;
      case InvoiceStatus.PARTIALLY_PAID:
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
        break;
      case InvoiceStatus.DRAFT:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
        break;
      default:
        bgColor = 'bg-orange-100'; 
        textColor = 'text-orange-700';
    }
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{status}</span>;
  };

  const getPaymentType = (invoice: Invoice): string => {
    if (invoice.status !== InvoiceStatus.PAID && invoice.status !== InvoiceStatus.PARTIALLY_PAID) return 'N/A';
    if (!invoice.paymentRecords || invoice.paymentRecords.length === 0) return 'Manual (Unspecified)';
    
    const onlinePayment = invoice.paymentRecords.find(pr => pr.paymentMethodType === 'Online');
    if (onlinePayment && invoice.status === InvoiceStatus.PAID) return `Online (${onlinePayment.gateway || 'Unknown'})`;
    
    const paymentTypes = new Set(invoice.paymentRecords.map(pr => pr.paymentMethodType || 'Manual'));
    if (paymentTypes.size > 1) return 'Mixed';
    if (paymentTypes.has('Online')) return `Online (${invoice.paymentRecords.find(pr=>pr.paymentMethodType === 'Online')?.gateway || 'Unknown'})`;
    if (paymentTypes.has('Manual')) return `Manual (${invoice.paymentRecords.find(pr=>pr.paymentMethodType === 'Manual')?.method || 'Unknown'})`;
    
    return 'Manual (Other)';
  };

  const getAmountDue = (invoice: Invoice): number => {
    const totalPaid = invoice.paymentRecords?.reduce((sum, pr) => sum + pr.amount, 0) || 0;
    return invoice.totalAmount - totalPaid;
  }

  const handleGenerateSinglePdf = async (invoice: Invoice) => {
    const element = document.getElementById(`invoice-pdf-content-${invoice.id}`);
    if (!element) {
        alert("Could not find content to generate PDF. This is a simplified PDF generation for visible content.");
        // Fallback or more robust solution would render the invoice to an off-screen div.
        // For now, we'll try to generate a very basic text PDF if the element isn't found.
        const pdf = new jsPDF();
        pdf.text(`Invoice: ${invoice.number}`, 10, 10);
        pdf.text(`Customer: ${invoice.customer.name}`, 10, 20);
        pdf.text(`Total: ${invoice.currency} ${invoice.totalAmount.toFixed(2)}`, 10, 30);
        pdf.text(`Status: ${invoice.status}`, 10, 40);
        pdf.save(`Invoice-${invoice.number}.pdf`);
        return;
    }

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    pdf.save(`Invoice-${invoice.number}.pdf`);
  };
  
  const handleEmailSingleInvoice = (invoice: Invoice) => {
    if (!invoice.customer?.email) {
        alert("Customer email is not set for this invoice.");
        return;
    }
    const subject = `Invoice ${invoice.number} from ProBookkeeper SaaS`;
    const body = `Dear ${invoice.customer.name},\n\nPlease find attached your invoice ${invoice.number} for ${invoice.currency} ${invoice.totalAmount?.toFixed(2)}.\n\nDue Date: ${invoice.dueDate}\n\nThank you for your business!\n\n(This is a simulated email. In a real app, a PDF would be attached and sent via an email server.)`;
    const mailtoLink = `mailto:${invoice.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };
  
  const columns = [
    { Header: 'Number', accessor: 'number' as keyof Invoice, className: 'font-medium' },
    { Header: 'Customer', accessor: (row: Invoice) => row.customer.name },
    { Header: 'Issue Date', accessor: 'issueDate' as keyof Invoice, Cell: (date:string) => new Date(date).toLocaleDateString()},
    { Header: 'Due Date', accessor: 'dueDate' as keyof Invoice, Cell: (date:string) => new Date(date).toLocaleDateString() },
    { 
      Header: 'Days Overdue', 
      accessor: (row: Invoice) => {
        if (row.status === InvoiceStatus.PAID || row.status === InvoiceStatus.DRAFT || row.status === InvoiceStatus.VOID) return 'N/A';
        const days = calculateDaysOverdue(row.dueDate);
        return days > 0 ? days : 'Current';
      },
      Cell: (days: string | number) => <span className={typeof days === 'number' && days > 0 ? 'text-red-600 font-semibold' : ''}>{days}</span>
    },
    { Header: 'Total', accessor: (row: Invoice) => `${row.currency} ${row.totalAmount.toFixed(2)}` },
    { Header: 'Amount Due', accessor: (row: Invoice) => `${row.currency} ${getAmountDue(row).toFixed(2)}`, className: "font-semibold"},
    { Header: 'Status', accessor: 'status' as keyof Invoice, Cell: (status: InvoiceStatus) => getStatusBadge(status) },
    { Header: 'Payment Type', accessor: (row: Invoice) => getPaymentType(row) },
    {
      Header: 'Actions',
      accessor: 'id' as keyof Invoice,
      Cell: (_: any, row: Invoice) => (
        <div className="flex space-x-1 items-center">
           {/* Hidden div for PDF generation content */}
          <div id={`invoice-pdf-content-${row.id}`} style={{ position: 'absolute', left: '-9999px', width: '210mm', padding: '20px', background: 'white', fontFamily: 'sans-serif' }}>
            <h2>Invoice: {row.number}</h2>
            <p>Customer: {row.customer.name}</p>
            <p>Issue Date: {row.issueDate}</p>
            <p>Due Date: {row.dueDate}</p>
            <p>Status: {row.status}</p>
            <h3>Items:</h3>
            <ul>{row.items.map(item => <li key={item.id}>{item.description} - Qty: {item.quantity}, Price: {item.unitPrice}, Total: {item.total}</li>)}</ul>
            <p>Subtotal: {row.subtotal}</p>
            <p>Tax ({row.taxRate}%): {row.taxAmount}</p>
            <p><strong>Total: {row.currency} {row.totalAmount.toFixed(2)}</strong></p>
          </div>

          {(row.status === InvoiceStatus.SENT || row.status === InvoiceStatus.OVERDUE || row.status === InvoiceStatus.PARTIALLY_PAID) && (
            <>
            <Button variant="ghost" size="sm" onClick={() => onRecordPayment(row)} title="Record Manual Payment" aria-label="Record Payment">
              <DollarSignIcon className="w-4 h-4 text-green-600 hover:text-green-800" />
            </Button>
            <Link to={`/pay/${row.id}`} title="Open Payment Link">
              <Button variant="ghost" size="sm" aria-label="Pay Invoice Online">
                <PayLinkIcon className="w-4 h-4 text-emerald-600 hover:text-emerald-800" />
              </Button>
            </Link>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleGenerateSinglePdf(row)} title="Download PDF" aria-label="Download PDF">
             <FileTextIcon className="w-4 h-4 text-gray-600 hover:text-gray-800" />
          </Button>
           <Button variant="ghost" size="sm" onClick={() => handleEmailSingleInvoice(row)} title="Email Invoice (Sim.)" aria-label="Email Invoice">
             <MailIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)} aria-label="Edit"><EditIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" /></Button>
          <Button variant="ghost" size="sm" onClick={() => openConfirmDeleteModal(row)} aria-label="Delete"><Trash2Icon className="w-4 h-4 text-red-600 hover:text-red-800" /></Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table<Invoice> columns={columns} data={invoices} />
      {invoiceToDelete && (
        <Modal
            isOpen={isConfirmDeleteModalOpen}
            onClose={() => setIsConfirmDeleteModalOpen(false)}
            title="Confirm Delete Invoice"
            size="sm"
            footer={
                <>
                    <Button variant="outline" onClick={() => setIsConfirmDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete Invoice</Button>
                </>
            }
        >
            <div className="text-center">
                <AlertTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-700">Are you sure you want to delete invoice <span className="font-semibold">{invoiceToDelete.number}</span>?</p>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
        </Modal>
      )}
    </>
  );
};

export default InvoiceList;
