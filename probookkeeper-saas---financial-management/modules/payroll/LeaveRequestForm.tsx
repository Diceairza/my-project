
import React, { useState, useEffect, useCallback } from 'react';
import { LeaveRequest, LeaveType, LeaveRequestStatus, Employee } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { MOCK_LEAVE_TYPES } from '../../constants';

interface LeaveRequestFormProps {
  initialLeaveRequest?: LeaveRequest | null;
  employees: Employee[]; 
  onSave: (leaveRequest: LeaveRequest) => void;
  onCancel: () => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ initialLeaveRequest, employees, onSave, onCancel }) => {
  const [leaveRequest, setLeaveRequest] = useState<Partial<LeaveRequest>>(
    initialLeaveRequest || {
      employeeId: employees.length > 0 ? employees[0].id : '',
      leaveType: LeaveType.ANNUAL_LEAVE,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: LeaveRequestStatus.PENDING,
    }
  );

  const selectedEmployee = employees.find(e => e.id === leaveRequest.employeeId);

  const calculateNumberOfDays = useCallback(() => {
    if (leaveRequest.startDate && leaveRequest.endDate) {
      const start = new Date(leaveRequest.startDate);
      const end = new Date(leaveRequest.endDate);
      if (end >= start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
        setLeaveRequest(prev => ({ ...prev, numberOfDays: diffDays }));
      } else {
        setLeaveRequest(prev => ({ ...prev, numberOfDays: 0 }));
      }
    }
  }, [leaveRequest.startDate, leaveRequest.endDate]);

  useEffect(() => {
    if (initialLeaveRequest) {
      setLeaveRequest(initialLeaveRequest);
    } else {
      setLeaveRequest({
        employeeId: employees.length > 0 ? employees[0].id : '',
        leaveType: LeaveType.ANNUAL_LEAVE,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        status: LeaveRequestStatus.PENDING,
      });
    }
  }, [initialLeaveRequest, employees]);

  useEffect(() => {
    calculateNumberOfDays();
  }, [calculateNumberOfDays]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLeaveRequest(prev => ({
      ...prev,
      [name]: name === 'numberOfDays' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveRequest.employeeId || !leaveRequest.leaveType || !leaveRequest.startDate || !leaveRequest.endDate || (leaveRequest.numberOfDays !== undefined && leaveRequest.numberOfDays <= 0) ) {
        alert("Please fill all required fields (Employee, Leave Type, Start/End Dates) and ensure dates are valid.");
        return;
    }
    // Simple validation for leave balance (mock)
    if (selectedEmployee?.leaveBalance && leaveRequest.leaveType && leaveRequest.numberOfDays) {
        const balance = selectedEmployee.leaveBalance[leaveRequest.leaveType as LeaveType];
        if (balance !== undefined && leaveRequest.numberOfDays > balance) {
            if(!window.confirm(`Warning: Requested days (${leaveRequest.numberOfDays}) exceed available ${leaveRequest.leaveType} balance (${balance} days). Proceed anyway?`)){
                return;
            }
        }
    }
    onSave(leaveRequest as LeaveRequest);
  };

  const employeeOptions = employees.map(emp => ({ value: emp.id, label: `${emp.firstName} ${emp.lastName} (ID: ${emp.employeeId})` }));
  const leaveTypeOptions = MOCK_LEAVE_TYPES; 
  const statusOptions = Object.values(LeaveRequestStatus).map(s => ({ value: s, label: s }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Employee*"
        name="employeeId"
        value={leaveRequest.employeeId || ''}
        onChange={handleChange}
        options={employeeOptions}
        required
      />
      {selectedEmployee && leaveRequest.leaveType && selectedEmployee.leaveBalance && selectedEmployee.leaveBalance[leaveRequest.leaveType as LeaveType] !== undefined && (
        <p className="text-xs text-gray-500 -mt-2 mb-2">
            Available <span className="font-semibold">{leaveRequest.leaveType}</span> balance: <span className="font-semibold">{selectedEmployee.leaveBalance[leaveRequest.leaveType as LeaveType]} days</span>.
        </p>
      )}
      <Select
        label="Leave Type*"
        name="leaveType"
        value={leaveRequest.leaveType || LeaveType.ANNUAL_LEAVE}
        onChange={handleChange}
        options={leaveTypeOptions}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Start Date*" name="startDate" type="date" value={leaveRequest.startDate || ''} onChange={handleChange} required />
        <Input label="End Date*" name="endDate" type="date" value={leaveRequest.endDate || ''} onChange={handleChange} required />
      </div>
      <Input 
        label="Number of Days (auto-calculated)" 
        name="numberOfDays" 
        type="number" 
        value={leaveRequest.numberOfDays || ''} 
        onChange={handleChange} 
        readOnly 
        className="bg-gray-100"
      />
       <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason for Leave (Optional)</label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={leaveRequest.reason || ''}
          onChange={handleChange}
        />
      </div>
       <Select
        label="Status*" 
        name="status"
        value={leaveRequest.status || LeaveRequestStatus.PENDING}
        onChange={handleChange}
        options={statusOptions}
        required
      />
       <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">Admin Comments (Optional)</label>
        <textarea
          id="comments"
          name="comments"
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={leaveRequest.comments || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialLeaveRequest ? 'Save Changes' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
};

export default LeaveRequestForm;
