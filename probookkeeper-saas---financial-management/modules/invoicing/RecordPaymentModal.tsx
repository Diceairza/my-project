
import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Invoice, PaymentRecord, PaymentMethod } from '../../types';
import { DEFAULT_CURRENCY } from '../../constants';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onRecordPayment: (payment: Omit<PaymentRecord, 'id'>) => void;
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ isOpen, onClose, invoice, onRecordPayment }) => {
  const amountDue = invoice.totalAmount - (invoice.paymentRecords?.reduce((sum, pr) => sum + pr.amount, 0) || 0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentAmount, setPaymentAmount] = useState<number>(amountDue > 0 ? amountDue : 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentMethodDetails, setPaymentMethodDetails] = useState('');

  const handleSubmit = () => {
    if (paymentAmount <= 0) {
        alert("Payment amount must be greater than zero.");
        return;
    }
    if (paymentAmount > amountDue + 0.001) { // Add small tolerance for floating point
        if (!window.confirm(`The payment amount (R ${paymentAmount.toFixed(2)}) is greater than the amount due (R ${amountDue.toFixed(2)}). Do you want to record this overpayment?`)) {
            return;
        }
    }

    onRecordPayment({
      date: paymentDate,
      amount: paymentAmount,
      method: paymentMethod,
      reference: paymentReference,
      paymentMethodType: 'Manual',
      paymentMethodDetails: paymentMethodDetails,
    });
    onClose();
  };

  const paymentMethodOptions = Object.values(PaymentMethod).map(method => ({
    value: method,
    label: method,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Payment for Invoice ${invoice.number}`}>
      <div className="space-y-4">
        <p className="text-sm">Invoice Total: <span className="font-semibold">{invoice.currency} {invoice.totalAmount.toFixed(2)}</span></p>
        <p className="text-sm">Amount Due: <span className="font-semibold text-red-600">{invoice.currency} {amountDue.toFixed(2)}</span></p>
        
        <Input
          label="Payment Date"
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          required
        />
        <Input
          label="Payment Amount"
          type="number"
          value={paymentAmount.toString()} // Control as string for input, then parse
          onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
          min="0.01"
          step="0.01"
          required
        />
        <Select
          label="Payment Method"
          options={paymentMethodOptions}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          required
        />
        {paymentMethod === PaymentMethod.CHEQUE && (
             <Input
                label="Cheque Number"
                value={paymentMethodDetails}
                onChange={(e) => setPaymentMethodDetails(e.target.value)}
                placeholder="Enter cheque number"
            />
        )}
         {paymentMethod === PaymentMethod.OTHER && (
             <Input
                label="Payment Method Details"
                value={paymentMethodDetails}
                onChange={(e) => setPaymentMethodDetails(e.target.value)}
                placeholder="Specify other payment method"
            />
        )}
        <Input
          label="Reference (Optional)"
          value={paymentReference}
          onChange={(e) => setPaymentReference(e.target.value)}
          placeholder="e.g., Bank transaction ID, Cheque #"
        />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Record Payment</Button>
      </div>
    </Modal>
  );
};

export default RecordPaymentModal;
