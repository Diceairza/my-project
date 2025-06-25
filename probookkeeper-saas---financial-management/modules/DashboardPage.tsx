
import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import { ChartDataPoint, Invoice, InvoiceStatus } from '../types';
import { LandmarkIcon, FileTextIcon, ReceiptIcon, AlertTriangleIcon } from '../components/icons/LucideIcons';
import Button from '../components/ui/Button';
import { DEFAULT_CURRENCY, MOCK_BANK_ACCOUNTS } from '../constants'; // MOCK_BANK_ACCOUNTS for dashboard simplicity for now

const sampleChartData: ChartDataPoint[] = [
  { name: 'Jan', value: 60000 }, 
  { name: 'Feb', value: 45000 }, 
  { name: 'Mar', value: 30000 }, 
  { name: 'Apr', value: 41700 }, 
  { name: 'May', value: 28350 }, 
  { name: 'Jun', value: 35850 }, 
];

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; helpText?: string }> = ({ title, value, icon, color, helpText }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        {helpText && <p className="text-xs text-gray-400 mt-0.5">{helpText}</p>}
      </div>
    </div>
  </Card>
);

interface DashboardPageProps {
  invoices: Invoice[]; // Invoices data now passed from App.tsx (fetched via service)
}

const DashboardPage: React.FC<DashboardPageProps> = ({ invoices }) => {
  const navigate = useNavigate();

  const dashboardStats = useMemo(() => {
    const openInvoices = invoices.filter(
      inv => inv.status === InvoiceStatus.SENT || inv.status === InvoiceStatus.PARTIALLY_PAID || inv.status === InvoiceStatus.OVERDUE
    );
    const totalOpenAmount = openInvoices.reduce((sum, inv) => {
        const paidAmount = inv.paymentRecords?.reduce((s, pr) => s + pr.amount, 0) || 0;
        return sum + (inv.totalAmount - paidAmount);
    },0);

    const overdueInvoices = invoices.filter(inv => inv.status === InvoiceStatus.OVERDUE);
    const totalOverdueAmount = overdueInvoices.reduce((sum, inv) => {
        const paidAmount = inv.paymentRecords?.reduce((s, pr) => s + pr.amount, 0) || 0;
        return sum + (inv.totalAmount - paidAmount);
    },0);
    
    // For this prototype, bank balance remains a placeholder or could be fetched by a bankingService.
    const totalBankBalance = MOCK_BANK_ACCOUNTS.reduce((sum, acc) => sum + acc.balance, 0);

    return {
      openInvoicesCount: openInvoices.length,
      totalOpenAmount,
      overdueInvoicesCount: overdueInvoices.length,
      totalOverdueAmount,
      totalBankBalance,
    };
  }, [invoices]);


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Welcome to your Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
            title="Open Invoices" 
            value={dashboardStats.openInvoicesCount} 
            icon={<FileTextIcon className="w-6 h-6 text-white"/>} 
            color="bg-blue-500" 
            helpText={`${DEFAULT_CURRENCY} ${dashboardStats.totalOpenAmount.toFixed(2)} receivable`}
        />
        <StatCard 
            title="Overdue Payments" 
            value={dashboardStats.overdueInvoicesCount} 
            icon={<AlertTriangleIcon className="w-6 h-6 text-white"/>} 
            color="bg-red-500" 
            helpText={`${DEFAULT_CURRENCY} ${dashboardStats.totalOverdueAmount.toFixed(2)} overdue`}
        />
        <StatCard 
            title="Total Bank Balance (Sim.)" 
            value={`${DEFAULT_CURRENCY} ${dashboardStats.totalBankBalance.toFixed(2)}`} 
            icon={<LandmarkIcon className="w-6 h-6 text-white"/>} 
            color="bg-emerald-500"
            helpText="Sum of simulated bank accounts"
        />
      </div>

      <Card title="Monthly Sales Overview (Sample Data)" className="shadow-md hover:shadow-lg transition-shadow">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={sampleChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                formatter={(value: number) => [`R ${value.toLocaleString()}`, "Sales"]} 
              />
              <Legend wrapperStyle={{ color: '#374151' }} />
              <Bar dataKey="value" fill="#3b82f6" name="Sales (R)" barSize={30} radius={[4, 4, 0, 0]} /> 
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Recent Invoice Activity" className="shadow-md hover:shadow-lg transition-shadow">
          {invoices.length > 0 ? invoices.slice(0, 3).map(inv => (
            <div key={inv.id} className="py-2 border-b border-gray-100 text-sm last:border-b-0">
                Invoice <Link to={`/invoicing/invoices`} className="font-semibold text-primary hover:underline">{inv.number}</Link> status: <span className="font-medium">{inv.status}</span> to {inv.customer.name}.
            </div>
          )) : <p className="text-gray-500">No recent invoice activity.</p>}
        </Card>
        <Card title="Quick Actions" className="shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/invoicing/invoices', { state: { openNewInvoiceModal: true }})}>Create New Invoice</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/expenses/bills', { state: { openNewBillModal: true }})}>Record Supplier Bill</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/expenses/general', { state: { openNewExpenseModal: true }})}>Record General Expense</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/reporting')}>View Reports</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
