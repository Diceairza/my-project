import React from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { LeaveRequest, LeaveRequestStatus, Employee, LeaveType } from '../../types';
import { EditIcon, Trash2Icon, CheckIcon, BanIcon } from '../../components/icons/LucideIcons';

interface LeaveRequestListProps {
  leaveRequests: LeaveRequest[];
  employees: Employee[]; // To display employee names
  onEdit: (leaveRequest: LeaveRequest) => void;
  onDelete: (leaveRequestId: string) => void;
  onApprove: (leaveRequestId: string) => void;
  onReject: (leaveRequestId: string) => void;
}

const LeaveRequestList: React.FC<LeaveRequestListProps> = ({ 
  leaveRequests, 
  employees, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject 
}) => {
  const getEmployeeName = (employeeId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown Employee';
  };

  const getStatusBadge = (status: LeaveRequestStatus) => {
    let bgColor = '';
    let textColor = '';
    switch (status) {
      case LeaveRequestStatus.APPROVED:
      case LeaveRequestStatus.TAKEN:
        bgColor = 'bg-emerald-100';
        textColor = 'text-emerald-700';
        break;
      case LeaveRequestStatus.PENDING:
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
        break;
      case LeaveRequestStatus.REJECTED:
      case LeaveRequestStatus.CANCELLED_BY_ADMIN:
      case LeaveRequestStatus.CANCELLED_BY_EMPLOYEE:
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
    { Header: 'Employee', accessor: (row: LeaveRequest) => getEmployeeName(row.employeeId), className: 'font-medium' },
    { Header: 'Leave Type', accessor: 'leaveType' as keyof LeaveRequest },
    { Header: 'Start Date', accessor: 'startDate' as keyof LeaveRequest, Cell: (date:string) => new Date(date).toLocaleDateString() },
    { Header: 'End Date', accessor: 'endDate' as keyof LeaveRequest, Cell: (date:string) => new Date(date).toLocaleDateString() },
    { Header: 'Days', accessor: (row: LeaveRequest) => row.numberOfDays || 'N/A' },
    { Header: 'Reason', accessor: 'reason' as keyof LeaveRequest, Cell: (reason?: string) => reason || 'N/A' },
    { Header: 'Status', accessor: 'status' as keyof LeaveRequest, Cell: (status: LeaveRequestStatus) => getStatusBadge(status) },
    { Header: 'Requested', accessor: 'requestedDate' as keyof LeaveRequest, Cell: (date:string) => new Date(date).toLocaleDateString() },
    {
      Header: 'Actions',
      accessor: 'id' as keyof LeaveRequest,
      Cell: (_: any, row: LeaveRequest) => (
        <div className="flex space-x-1 items-center">
          {row.status === LeaveRequestStatus.PENDING && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onApprove(row.id)} title="Approve Request" aria-label="Approve">
                <CheckIcon className="w-4 h-4 text-emerald-600 hover:text-emerald-800" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onReject(row.id)} title="Reject Request" aria-label="Reject">
                <BanIcon className="w-4 h-4 text-orange-600 hover:text-orange-800" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)} aria-label="Edit Request">
            <EditIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row.id)} aria-label="Delete Request">
            <Trash2Icon className="w-4 h-4 text-red-600 hover:text-red-800" />
          </Button>
        </div>
      ),
    },
  ];

  return <Table<LeaveRequest> columns={columns} data={leaveRequests} />;
};

export default LeaveRequestList;
