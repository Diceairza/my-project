import React from 'react';
import { Project, ProjectStatus } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { EditIcon, Trash2Icon, UserCircleIcon, CalendarIcon, DollarSignIcon, TrendingUpIcon, TrendingDownIcon, InfoIcon } from '../../components/icons/LucideIcons'; // Added/Corrected icons

interface ProjectCardProps {
  project: Project & { actualRevenue?: number; actualCosts?: number; profitability?: number };
  customerName?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.ACTIVE: return 'bg-emerald-100 text-emerald-700';
    case ProjectStatus.PLANNING: return 'bg-blue-100 text-blue-700';
    case ProjectStatus.ON_HOLD: return 'bg-yellow-100 text-yellow-700';
    case ProjectStatus.COMPLETED: return 'bg-gray-100 text-gray-700 border border-gray-300';
    case ProjectStatus.CANCELLED: return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, customerName, onEdit, onDelete }) => {
  const { name, description, status, budget = 0, currency, actualRevenue = 0, actualCosts = 0, profitability = 0 } = project;
  
  const budgetUtilization = budget > 0 ? (actualCosts / budget) * 100 : 0;
  const progressColor = budgetUtilization > 100 ? 'bg-red-500' : budgetUtilization > 75 ? 'bg-yellow-500' : 'bg-emerald-500';

  return (
    <Card 
        title={name} 
        className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
        actions={
            <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Edit Project"><EditIcon className="w-4 h-4 text-blue-600"/></Button>
                <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Delete Project"><Trash2Icon className="w-4 h-4 text-red-500"/></Button>
            </div>
        }
    >
      <div className="flex-grow space-y-3">
        <div className="flex justify-between items-center">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                {status}
            </span>
            {customerName && (
                <div className="flex items-center text-sm text-gray-500">
                    <UserCircleIcon className="w-4 h-4 mr-1 text-gray-400"/> {customerName}
                </div>
            )}
        </div>

        {description && <p className="text-sm text-gray-600 line-clamp-2">{description}</p>}
        
        {(project.startDate || project.endDate) && (
            <div className="flex items-center text-xs text-gray-500">
                <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400"/>
                {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
            </div>
        )}

        <div className="space-y-2 pt-2 border-t mt-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Budget:</span>
                <span className="font-semibold text-gray-800">{currency} {budget.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Actual Revenue:</span>
                <span className="font-semibold text-emerald-600">{currency} {actualRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Actual Costs:</span>
                <span className="font-semibold text-red-600">{currency} {actualCosts.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
             <div className="flex justify-between text-sm font-bold">
                <span className={profitability >= 0 ? 'text-emerald-700' : 'text-red-700'}>Profit / (Loss):</span>
                <span className={profitability >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                    {profitability >= 0 ? <TrendingUpIcon className="inline w-4 h-4 mr-1"/> : <TrendingDownIcon className="inline w-4 h-4 mr-1"/>}
                    {currency} {profitability.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </span>
            </div>
        </div>
        
        {budget > 0 && (
             <div className="pt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Cost vs Budget</span>
                    <span>{budgetUtilization.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className={`${progressColor} h-2.5 rounded-full`} 
                        style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                        title={`Costs: ${actualCosts.toFixed(2)}, Budget: ${budget.toFixed(2)}`}
                    ></div>
                </div>
                 {budgetUtilization > 100 && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                        <InfoIcon className="w-3 h-3 mr-1"/> Budget exceeded by {currency} {(actualCosts - budget).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </p>
                )}
            </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectCard;
