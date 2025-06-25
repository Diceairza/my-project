
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Invoice, InvoiceStatus, PaymentRecord } from '../../types';
import { DEFAULT_CURRENCY, MOCK_PAYMENT_GATEWAYS } from '../../constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MockPaymentGatewayModal from './MockPaymentGatewayModal';
import { CreditCardIcon, PaypalIcon, CheckCircle2Icon } from '../../components/icons/LucideIcons';

interface PublicInvoicePaymentPageProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

const PublicInvoicePaymentPage: React.FC<PublicInvoicePaymentPageProps> = ({ invoices, setInvoices }) => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<{id: string, name: string} | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const foundInvoice = invoices.find(inv => inv.id === invoiceId);
    if (foundInvoice) {
      setCurrentInvoice(foundInvoice);
      if(foundInvoice.status === InvoiceStatus.PAID) {
        setPaymentSuccess(true); // If already paid, show success
      }
    } else {
      setCurrentInvoice(null); // Or redirect to a not found page
    }
  }, [invoiceId, invoices]);

  const handleOpenPaymentModal = (gateway: {id: string, name: string}) => {
    setSelectedGateway(gateway);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (gatewayName: string, transactionId: string) => {
    if (currentInvoice) {
      const updatedInvoice: Invoice = {
        ...currentInvoice,
        status: InvoiceStatus.PAID,
        paymentRecords: [
          ...(currentInvoice.paymentRecords || []),
          {
            id: `pr_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount: currentInvoice.totalAmount,
            method: gatewayName,
            gateway: gatewayName,
            gatewayTransactionId: transactionId,
            paymentMethodType: 'Online',
          },
        ],
      };
      setInvoices(prevInvoices => prevInvoices.map(inv => (inv.id === currentInvoice.id ? updatedInvoice : inv)));
      setPaymentSuccess(true);
      setIsPaymentModalOpen(false);
    }
  };

  if (!currentInvoice && !paymentSuccess) { // Check paymentSuccess too, to avoid flicker if invoice becomes null after payment
    return (
      <Card title="Invoice Not Found">
        <p>The invoice you are looking for could not be found or is no longer available for payment.</p>
        <Button onClick={() => navigate('/invoicing')} className="mt-4">Go to Invoicing</Button>
      </Card>
    );
  }
  
  const amountDue = currentInvoice ? currentInvoice.totalAmount - (currentInvoice.paymentRecords?.reduce((sum, pr) => sum + pr.amount, 0) || 0) : 0;


  if (paymentSuccess || (currentInvoice && currentInvoice.status === InvoiceStatus.PAID && amountDue <= 0)) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card title="Payment Successful!" className="bg-emerald-50 border-emerald-500">
           <div className="text-center py-8">
            <CheckCircle2Icon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-emerald-700 mb-2">Thank You!</h2>
            <p className="text-gray-600">
              Your payment for invoice <span className="font-semibold">{currentInvoice?.number}</span> has been processed successfully.
            </p>
            <p className="text-gray-600 mt-1">
              Amount Paid: <span className="font-semibold">{currentInvoice?.currency} {currentInvoice?.totalAmount.toFixed(2)}</span>
            </p>
            <Button onClick={() => navigate('/invoicing')} className="mt-6">Back to Safety (Dashboard)</Button>
          </div>
        </Card>
      </div>
    );
  }
  
  // If invoice exists but amountDue is <=0 and not yet marked as 'paymentSuccess' (e.g. from previous manual payment)
  if (currentInvoice && amountDue <=0 && currentInvoice.status !== InvoiceStatus.DRAFT && currentInvoice.status !== InvoiceStatus.VOID) {
     return (
      <div className="max-w-2xl mx-auto">
        <Card title="Invoice Already Paid" className="bg-blue-50 border-blue-500">
           <div className="text-center py-8">
            <CheckCircle2Icon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">Invoice Settled</h2>
            <p className="text-gray-600">
              Invoice <span className="font-semibold">{currentInvoice?.number}</span> has already been paid in full.
            </p>
            <Button onClick={() => navigate('/invoicing')} className="mt-6">Return to Invoicing</Button>
          </div>
        </Card>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto">
      {currentInvoice && (
        <Card title={`Pay Invoice: ${currentInvoice.number}`} >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Billed to:</p>
              <p className="font-semibold text-gray-800">{currentInvoice.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Issue Date:</p>
              <p className="font-semibold text-gray-800">{new Date(currentInvoice.issueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Date:</p>
              <p className="font-semibold text-gray-800">{new Date(currentInvoice.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="py-4 border-t border-b">
              <p className="text-lg text-gray-500">Amount Due:</p>
              <p className="text-3xl font-bold text-primary">
                {currentInvoice.currency} {amountDue.toFixed(2)}
              </p>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-700 pt-4">Select Payment Method:</h3>
            <div className="space-y-3">
              {MOCK_PAYMENT_GATEWAYS.map(gateway => (
                 <Button 
                    key={gateway.id}
                    onClick={() => handleOpenPaymentModal(gateway)} 
                    variant="secondary" 
                    className="w-full justify-start py-3"
                    leftIcon={gateway.id.includes('paypal') ? <PaypalIcon className="w-5 h-5 mr-2" /> : <CreditCardIcon className="w-5 h-5 mr-2" />}
                >
                    Pay with {gateway.name}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {selectedGateway && currentInvoice && isPaymentModalOpen && (
        <MockPaymentGatewayModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          gatewayName={selectedGateway.name}
          invoiceAmount={amountDue}
          currency={currentInvoice.currency}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PublicInvoicePaymentPage;