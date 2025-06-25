
import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import LeaveRequestList from './LeaveRequestList';
import LeaveRequestForm from './LeaveRequestForm';
import { Employee, LeaveRequest, EmployeeStatus, PayFrequency, LeaveRequestStatus, LeaveType } from '../../types';
import { MOCK_EMPLOYEES, MOCK_LEAVE_REQUESTS, DEFAULT_CURRENCY, MOCK_LEAVE_TYPES } from '../../constants';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { PlusIcon, DollarSignIcon } from '../../components/icons/LucideIcons'; // Added DollarSignIcon
import Card from '../../components/ui/Card';

const PayrollPage: React.FC = () => {
  const location = useLocation();
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [editingLeaveRequest, setEditingLeaveRequest] = useState<LeaveRequest | null>(null);

  const handleSaveEmployee = (employee: Employee) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === employee.id ? employee : emp));
    } else {
      setEmployees(prev => [...prev, { ...employee, id: `emp_${Date.now()}` }]);
    }
    setEditingEmployee(null);
    setIsEmployeeModalOpen(false);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee record? This may also affect associated leave requests and future payroll processing.')) {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    }
  };

  const handleSaveLeaveRequest = (leaveRequest: LeaveRequest) => {
    if (editingLeaveRequest) {
      setLeaveRequests(prev => prev.map(lr => lr.id === leaveRequest.id ? leaveRequest : lr));
    } else {
      setLeaveRequests(prev => [...prev, { ...leaveRequest, id: `lr_${Date.now()}`, requestedDate: new Date().toISOString().split('T')[0] }]);
    }
    setEditingLeaveRequest(null);
    setIsLeaveModalOpen(false);
  };

  const handleDeleteLeaveRequest = (leaveRequestId: string) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      setLeaveRequests(prev => prev.filter(lr => lr.id !== leaveRequestId));
    }
  };

  const handleApproveLeaveRequest = (leaveRequestId: string) => {
    setLeaveRequests(prev => prev.map(lr => 
      lr.id === leaveRequestId 
      ? { ...lr, status: LeaveRequestStatus.APPROVED, processedDate: new Date().toISOString().split('T')[0] } 
      : lr
    ));
  };
  
  const handleRejectLeaveRequest = (leaveRequestId: string) => {
     setLeaveRequests(prev => prev.map(lr => 
      lr.id === leaveRequestId 
      ? { ...lr, status: LeaveRequestStatus.REJECTED, processedDate: new Date().toISOString().split('T')[0] } 
      : lr
    ));
  };


  const getActiveTab = () => {
    if (location.pathname.includes('/payroll/leave')) return 'leave';
    if (location.pathname.includes('/payroll/payruns')) return 'payruns'; // New
    return 'employees';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Payroll & Workforce Management</h2>
        {getActiveTab() === 'employees' && (
          <Button onClick={() => { setEditingEmployee(null); setIsEmployeeModalOpen(true); }} leftIcon={<PlusIcon className="w-4 h-4"/>}>
            New Employee
          </Button>
        )}
        {getActiveTab() === 'leave' && (
          <Button onClick={() => { setEditingLeaveRequest(null); setIsLeaveModalOpen(true); }} leftIcon={<PlusIcon className="w-4 h-4"/>}>
            New Leave Request
          </Button>
        )}
         {getActiveTab() === 'payruns' && (
          <Button disabled leftIcon={<DollarSignIcon className="w-4 h-4"/>}>
            Start New Payrun (Future)
          </Button>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <NavLink
            to="employees"
            className={({ isActive }) =>
              `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                isActive || location.pathname === '/payroll' || location.pathname.startsWith('/payroll/employees')
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            Employees ({employees.length})
          </NavLink>
          <NavLink
            to="leave"
            className={({ isActive }) =>
              `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            Leave Management ({leaveRequests.filter(lr => lr.status === LeaveRequestStatus.PENDING).length} Pending)
          </NavLink>
          <NavLink
            to="payruns" // New tab
            className={({ isActive }) =>
              `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 cursor-not-allowed' // Disabled style
              }`
            }
            onClick={(e) => e.preventDefault()} // Prevent navigation for disabled tab
            aria-disabled="true"
            tabIndex={-1}
          >
            Payruns (Coming Soon)
          </NavLink>
        </nav>
      </div>

      <Routes>
        <Route index element={<Navigate to="employees" replace />} />
        <Route path="employees" element={<EmployeeList 
            employees={employees} 
            onEdit={(employee) => { setEditingEmployee(employee); setIsEmployeeModalOpen(true);}} 
            onDelete={handleDeleteEmployee} 
        />} />
        <Route path="leave" element={<LeaveRequestList 
            leaveRequests={leaveRequests} 
            employees={employees}
            onEdit={(lr) => { setEditingLeaveRequest(lr); setIsLeaveModalOpen(true); }} 
            onDelete={handleDeleteLeaveRequest}
            onApprove={handleApproveLeaveRequest}
            onReject={handleRejectLeaveRequest} 
        />} />
        <Route path="payruns" element={ 
            <Card title="Payruns - Coming Soon">
                <div className="text-center py-10">
                    <DollarSignIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Payrun processing functionality is under development.</p>
                    <p className="text-sm text-gray-400">This section will allow you to manage weekly/monthly payruns, calculate deductions, and generate payslips.</p>
                </div>
            </Card>
        } />
      </Routes>

      <Modal 
        isOpen={isEmployeeModalOpen} 
        onClose={() => { setIsEmployeeModalOpen(false); setEditingEmployee(null); }} 
        title={editingEmployee ? "Edit Employee Details" : "Add New Employee"} 
        size="xl"
      >
        <EmployeeForm 
          initialEmployee={editingEmployee} 
          onSave={handleSaveEmployee} 
          onCancel={() => { setIsEmployeeModalOpen(false); setEditingEmployee(null); }} 
        />
      </Modal>

      <Modal 
        isOpen={isLeaveModalOpen} 
        onClose={() => { setIsLeaveModalOpen(false); setEditingLeaveRequest(null); }} 
        title={editingLeaveRequest ? "Edit Leave Request" : "Submit New Leave Request"} 
        size="lg"
      >
        <LeaveRequestForm 
          initialLeaveRequest={editingLeaveRequest} 
          employees={employees}
          onSave={handleSaveLeaveRequest} 
          onCancel={() => { setIsLeaveModalOpen(false); setEditingLeaveRequest(null); }} 
        />
      </Modal>
    </div>
  );
};

export default PayrollPage;
