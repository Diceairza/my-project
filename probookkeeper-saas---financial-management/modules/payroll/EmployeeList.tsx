import React from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { Employee, EmployeeStatus } from '../../types';
import { EditIcon, Trash2Icon } from '../../components/icons/LucideIcons';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEdit, onDelete }) => {
  const getStatusBadge = (status: EmployeeStatus) => {
    let bgColor = '';
    let textColor = '';
    switch (status) {
      case EmployeeStatus.ACTIVE:
        bgColor = 'bg-emerald-100';
        textColor = 'text-emerald-700';
        break;
      case EmployeeStatus.ON_LEAVE:
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
        break;
      case EmployeeStatus.PROBATION:
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        break;
      case EmployeeStatus.TERMINATED:
      case EmployeeStatus.RESIGNED:
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
    }
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{status}</span>;
  };

  const columns = [
    { Header: 'Emp. ID', accessor: 'employeeId' as keyof Employee },
    { Header: 'Name', accessor: (row: Employee) => `${row.firstName} ${row.lastName}`, className: 'font-medium' },
    { Header: 'Job Title', accessor: 'jobTitle' as keyof Employee },
    { Header: 'Email', accessor: 'email' as keyof Employee },
    { Header: 'Phone', accessor: 'phoneNumber' as keyof Employee, Cell: (phone?: string) => phone || 'N/A' },
    { Header: 'Status', accessor: 'status' as keyof Employee, Cell: (status: EmployeeStatus) => getStatusBadge(status) },
    {
      Header: 'Actions',
      accessor: 'id' as keyof Employee,
      Cell: (_: any, row: Employee) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)} aria-label="Edit Employee">
            <EditIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row.id)} aria-label="Delete Employee">
            <Trash2Icon className="w-4 h-4 text-red-600 hover:text-red-800" />
          </Button>
        </div>
      ),
    },
  ];

  return <Table<Employee> columns={columns} data={employees} />;
};

export default EmployeeList;
