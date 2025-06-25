
import React, { useState, useEffect } from 'react';
import { Employee, EmployeeStatus, PayFrequency, AllowanceDeductionItem } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { DEFAULT_CURRENCY } from '../../constants';
import { ShieldAlertIcon, PlusIcon, Trash2Icon } from '../../components/icons/LucideIcons';

interface EmployeeFormProps {
  initialEmployee?: Employee | null;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

const FormSection: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="pt-4 mt-4 border-t">
    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);

const newAllowanceDeduction = (type: 'Allowance' | 'Deduction'): AllowanceDeductionItem => ({
    id: `${type.toLowerCase()}_${Date.now()}`,
    description: '',
    type,
    amount: 0,
    recurring: true,
});


const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialEmployee, onSave, onCancel }) => {
  const [employee, setEmployee] = useState<Partial<Employee>>(
    initialEmployee || {
      employeeId: `EMP-${Date.now().toString().slice(-6)}`,
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      startDate: new Date().toISOString().split('T')[0],
      payRate: 0,
      payFrequency: PayFrequency.MONTHLY,
      currency: DEFAULT_CURRENCY,
      status: EmployeeStatus.ACTIVE,
      address: { street: '', suburb: '', city: '', postalCode: '', country: 'South Africa' },
      allowances: [],
      deductions: [],
    }
  );

  useEffect(() => {
    if (initialEmployee) {
      setEmployee({
          ...initialEmployee,
          allowances: initialEmployee.allowances || [],
          deductions: initialEmployee.deductions || [],
      });
    } else {
      setEmployee({
        employeeId: `EMP-${Date.now().toString().slice(-6)}`,
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        startDate: new Date().toISOString().split('T')[0],
        payRate: 0,
        payFrequency: PayFrequency.MONTHLY,
        currency: DEFAULT_CURRENCY,
        status: EmployeeStatus.ACTIVE,
        address: { street: '', suburb: '', city: '', postalCode: '', country: 'South Africa' },
        allowances: [],
        deductions: [],
      });
    }
  }, [initialEmployee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['payRate'];
    
    if (name.startsWith('address.')) {
        const addressField = name.split('.')[1];
        setEmployee(prev => ({
            ...prev,
            address: {
                ...(prev.address || { street: '', suburb: '', city: '', postalCode: '', country: 'South Africa' }),
                [addressField]: value
            }
        }));
    } else {
        setEmployee(prev => ({
        ...prev,
        [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
        }));
    }
  };

  const handleAllowanceDeductionChange = (
    index: number,
    field: keyof AllowanceDeductionItem,
    value: string | number | boolean,
    type: 'allowances' | 'deductions'
  ) => {
    setEmployee(prev => {
        const items = [...(prev[type] || [])];
        const itemToUpdate = { ...items[index] };
        (itemToUpdate[field] as any) = field === 'amount' ? parseFloat(value as string) : (field === 'recurring' ? value as boolean : value);
        items[index] = itemToUpdate;
        return { ...prev, [type]: items };
    });
  };

  const addAllowanceDeduction = (type: 'allowances' | 'deductions') => {
    setEmployee(prev => ({
        ...prev,
        [type]: [...(prev[type] || []), newAllowanceDeduction(type === 'allowances' ? 'Allowance' : 'Deduction')]
    }));
  };

  const removeAllowanceDeduction = (index: number, type: 'allowances' | 'deductions') => {
     setEmployee(prev => ({
        ...prev,
        [type]: (prev[type] || []).filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee.firstName || !employee.lastName || !employee.email || !employee.jobTitle || !employee.startDate || !employee.employeeId) {
        alert("Please fill in all required fields: Employee ID, First Name, Last Name, Email, Job Title, Start Date.");
        return;
    }
    onSave(employee as Employee);
  };

  const employeeStatusOptions = Object.values(EmployeeStatus).map(s => ({ value: s, label: s }));
  const payFrequencyOptions = Object.values(PayFrequency).map(pf => ({ value: pf, label: pf }));
  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
  ];
   const employmentTypeOptions = [
    { value: '', label: 'Select Type' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Intern', label: 'Intern' },
  ];
  const bankAccountTypeOptions = [
    { value: '', label: 'Select Account Type' },
    { value: 'Cheque', label: 'Cheque Account' },
    { value: 'Savings', label: 'Savings Account' },
    { value: 'Transmission', label: 'Transmission Account' },
  ];


  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
      <FormSection title="Personal Information">
        <Input label="First Name*" name="firstName" value={employee.firstName || ''} onChange={handleChange} required />
        <Input label="Last Name*" name="lastName" value={employee.lastName || ''} onChange={handleChange} required />
        <Input label="Date of Birth" name="dateOfBirth" type="date" value={employee.dateOfBirth || ''} onChange={handleChange} />
        <Input label="ID Number (SA)" name="idNumber" value={employee.idNumber || ''} onChange={handleChange} placeholder="e.g. 8501011234080" />
        <Select label="Gender" name="gender" value={employee.gender || ''} onChange={handleChange} options={genderOptions} />
      </FormSection>

      <FormSection title="Contact Information">
        <Input label="Email Address*" name="email" type="email" value={employee.email || ''} onChange={handleChange} required />
        <Input label="Phone Number" name="phoneNumber" value={employee.phoneNumber || ''} onChange={handleChange} placeholder="e.g. 0721234567" />
        <Input label="Street Address" name="address.street" value={employee.address?.street || ''} onChange={handleChange} />
        <Input label="Suburb" name="address.suburb" value={employee.address?.suburb || ''} onChange={handleChange} />
        <Input label="City" name="address.city" value={employee.address?.city || ''} onChange={handleChange} />
        <Input label="Postal Code" name="address.postalCode" value={employee.address?.postalCode || ''} onChange={handleChange} />
        <Input label="Country" name="address.country" value={employee.address?.country || 'South Africa'} onChange={handleChange} />
      </FormSection>
      
      <FormSection title="Emergency Contact" icon={<ShieldAlertIcon className="w-5 h-5 text-orange-500" />}>
        <Input label="Full Name" name="emergencyContactName" value={employee.emergencyContactName || ''} onChange={handleChange} />
        <Input label="Phone Number" name="emergencyContactPhone" value={employee.emergencyContactPhone || ''} onChange={handleChange} />
        <Input label="Relationship" name="emergencyContactRelationship" value={employee.emergencyContactRelationship || ''} onChange={handleChange} />
      </FormSection>

      <FormSection title="Banking Details (SA)">
        <Input label="Bank Name" name="bankName" value={employee.bankName || ''} onChange={handleChange} placeholder="e.g. FNB, Standard Bank"/>
        <Select label="Account Type" name="bankAccountType" value={employee.bankAccountType || ''} onChange={handleChange} options={bankAccountTypeOptions} />
        <Input label="Account Number" name="bankAccountNumber" value={employee.bankAccountNumber || ''} onChange={handleChange} />
        <Input label="Branch Code" name="bankBranchCode" value={employee.bankBranchCode || ''} onChange={handleChange} placeholder="e.g. 250655" />
      </FormSection>
      
      <FormSection title="Tax Information (SA)">
         <Input label="SARS Tax Number" name="sarsTaxNumber" value={employee.sarsTaxNumber || ''} onChange={handleChange} placeholder="e.g. 1234567890" />
         <Input label="Tax Office / SARS Branch" name="taxOffice" value={employee.taxOffice || ''} onChange={handleChange} placeholder="e.g. Johannesburg Central" />
      </FormSection>

      <FormSection title="Employment Details">
        <Input label="Employee ID*" name="employeeId" value={employee.employeeId || ''} onChange={handleChange} required />
        <Input label="Job Title*" name="jobTitle" value={employee.jobTitle || ''} onChange={handleChange} required />
        <Input label="Department" name="department" value={employee.department || ''} onChange={handleChange} />
        <Select label="Employment Type" name="employmentType" value={employee.employmentType || ''} onChange={handleChange} options={employmentTypeOptions} />
        <Input label="Start Date*" name="startDate" type="date" value={employee.startDate || ''} onChange={handleChange} required />
        <Input label="End Date (Optional)" name="endDate" type="date" value={employee.endDate || ''} onChange={handleChange} />
        <Select label="Status*" name="status" value={employee.status || EmployeeStatus.ACTIVE} onChange={handleChange} options={employeeStatusOptions} required />
        <Input label="Reports To (Emp. ID)" name="reportsToEmployeeId" value={employee.reportsToEmployeeId || ''} onChange={handleChange} />
      </FormSection>

       <FormSection title="Compensation">
        <Input label={`Pay Rate (${employee.currency || DEFAULT_CURRENCY})*`} name="payRate" type="number" value={employee.payRate || 0} onChange={handleChange} step="0.01" min="0" required />
        <Select label="Pay Frequency*" name="payFrequency" value={employee.payFrequency || PayFrequency.MONTHLY} onChange={handleChange} options={payFrequencyOptions} required />
        <Input label="Currency" name="currency" value={employee.currency || DEFAULT_CURRENCY} readOnly className="bg-gray-100" />
      </FormSection>

      {/* Allowances Section */}
      <div className="pt-4 mt-4 border-t">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold text-gray-700">Allowances</h3>
            <Button type="button" size="sm" variant="outline" onClick={() => addAllowanceDeduction('allowances')} leftIcon={<PlusIcon className="w-4 h-4"/>}>Add Allowance</Button>
        </div>
        {(employee.allowances || []).map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center mb-2 p-2 border rounded-md">
                <Input wrapperClassName="col-span-5 mb-0" placeholder="Description" value={item.description} onChange={(e) => handleAllowanceDeductionChange(index, 'description', e.target.value, 'allowances')} />
                <Input wrapperClassName="col-span-3 mb-0" type="number" placeholder="Amount" value={item.amount} onChange={(e) => handleAllowanceDeductionChange(index, 'amount', e.target.value, 'allowances')} />
                <div className="col-span-3 flex items-center">
                     <input type="checkbox" id={`allowance_recurring_${index}`} checked={item.recurring} onChange={(e) => handleAllowanceDeductionChange(index, 'recurring', e.target.checked, 'allowances')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/>
                     <label htmlFor={`allowance_recurring_${index}`} className="ml-2 text-xs text-gray-600">Recurring</label>
                </div>
                <Button type="button" variant="danger" size="sm" onClick={() => removeAllowanceDeduction(index, 'allowances')} className="col-span-1 px-2"><Trash2Icon className="w-4 h-4"/></Button>
            </div>
        ))}
         {(employee.allowances || []).length === 0 && <p className="text-xs text-gray-500">No allowances added.</p>}
      </div>

      {/* Deductions Section */}
      <div className="pt-4 mt-4 border-t">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold text-gray-700">Deductions</h3>
            <Button type="button" size="sm" variant="outline" onClick={() => addAllowanceDeduction('deductions')} leftIcon={<PlusIcon className="w-4 h-4"/>}>Add Deduction</Button>
        </div>
        {(employee.deductions || []).map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center mb-2 p-2 border rounded-md">
                <Input wrapperClassName="col-span-5 mb-0" placeholder="Description" value={item.description} onChange={(e) => handleAllowanceDeductionChange(index, 'description', e.target.value, 'deductions')} />
                <Input wrapperClassName="col-span-3 mb-0" type="number" placeholder="Amount" value={item.amount} onChange={(e) => handleAllowanceDeductionChange(index, 'amount', e.target.value, 'deductions')} />
                 <div className="col-span-3 flex items-center">
                     <input type="checkbox" id={`deduction_recurring_${index}`} checked={item.recurring} onChange={(e) => handleAllowanceDeductionChange(index, 'recurring', e.target.checked, 'deductions')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/>
                     <label htmlFor={`deduction_recurring_${index}`} className="ml-2 text-xs text-gray-600">Recurring</label>
                </div>
                <Button type="button" variant="danger" size="sm" onClick={() => removeAllowanceDeduction(index, 'deductions')} className="col-span-1 px-2"><Trash2Icon className="w-4 h-4"/></Button>
            </div>
        ))}
        {(employee.deductions || []).length === 0 && <p className="text-xs text-gray-500">No deductions added.</p>}
      </div>


      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={employee.notes || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialEmployee ? 'Save Changes' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
