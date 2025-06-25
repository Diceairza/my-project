import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { CreditCardIcon, UserCircleIcon, CalendarIcon, LockIcon, PaypalIcon } from '../../components/icons/LucideIcons';

interface MockPaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  gatewayName: string;
  invoiceAmount: number;
  currency: string;
  onPaymentSuccess: (gatewayName: string, transactionId: string) => void;
}

const MockPaymentGatewayModal: React.FC<MockPaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  gatewayName,
  invoiceAmount,
  currency,
  onPaymentSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = () => {
    setError('');
    // Basic validation simulation
    if (gatewayName.toLowerCase().includes('card')) {
        if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
        setError('Please fill in all card details.');
        return;
        }
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            setError('Invalid card number format (must be 16 digits).');
            return;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            setError('Invalid expiry date format (MM/YY).');
            return;
        }
        if (!/^\d{3,4}$/.test(cvv)) {
            setError('Invalid CVV format (3 or 4 digits).');
            return;
        }
    }


    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate success
      const simulatedTransactionId = `sim_txn_${Date.now()}`;
      onPaymentSuccess(gatewayName, simulatedTransactionId);
    }, 2000); // Simulate 2 second delay
  };

  const isCardPayment = gatewayName.toLowerCase().includes('card');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pay with ${gatewayName}`}
      size="md"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePayment} isLoading={isProcessing} disabled={isProcessing}>
            Pay {currency} {invoiceAmount.toFixed(2)}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          You are about to pay <span className="font-semibold">{currency} {invoiceAmount.toFixed(2)}</span> using {gatewayName}.
        </p>
        
        {isCardPayment && (
            <>
                <Input
                    label="Cardholder Name"
                    name="cardHolderName"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    placeholder="John Doe"
                    // Consider adding an icon prop to Input component if desired
                    // leftIcon={<UserCircleIcon className="w-4 h-4 text-gray-400" />}
                />
                <Input
                    label="Card Number"
                    name="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    // leftIcon={<CreditCardIcon className="w-4 h-4 text-gray-400" />}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Expiry Date (MM/YY)"
                        name="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        // leftIcon={<CalendarIcon className="w-4 h-4 text-gray-400" />}
                    />
                    <Input
                        label="CVV"
                        name="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        // leftIcon={<LockIcon className="w-4 h-4 text-gray-400" />}
                    />
                </div>
            </>
        )}
        {!isCardPayment && gatewayName.toLowerCase().includes('paypal') && (
            <div className="text-center p-4 border rounded-md bg-blue-50">
                <PaypalIcon className="w-16 h-16 mx-auto text-blue-600 mb-2"/>
                <p className="text-gray-700">You will be redirected to PayPal to complete your payment.</p>
                <p className="text-xs text-gray-500 mt-2">(This is a simulation. Clicking 'Pay' will mark the invoice as paid.)</p>
            </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        
        <p className="text-xs text-gray-500 text-center pt-2">
          This is a simulated payment gateway. No real transaction will occur.
        </p>
      </div>
    </Modal>
  );
};

export default MockPaymentGatewayModal;