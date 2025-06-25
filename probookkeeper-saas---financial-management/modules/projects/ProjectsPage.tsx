
import React, { useState, useMemo } from 'react';
import { Project, ProjectStatus, Customer } from '../../types';
import { MOCK_PROJECTS, MOCK_CUSTOMERS, DEFAULT_CURRENCY, MOCK_INVOICES, MOCK_BILLS, MOCK_EXPENSES } from '../../constants';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import { PlusIcon, EditIcon, Trash2Icon, ClipboardListIcon, ChevronDownIcon, ChevronUpIcon } from '../../components/icons/LucideIcons'; // Use direct import
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';

type ProjectSortKey = 'name' | 'startDate' | 'budget' | 'status' | 'profitability';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<ProjectSortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // These would typically come from a central store or be passed as props if used by other modules
  const allInvoices = MOCK_INVOICES; 
  const allBills = MOCK_BILLS;
  const allExpenses = MOCK_EXPENSES;

  const projectsWithCalculatedFinancials = useMemo(() => {
    return projects.map(project => {
      let actualRevenue = 0;
      allInvoices.forEach(invoice => {
        if (invoice.projectId === project.id && (invoice.status === 'Paid' || invoice.status === 'Partially Paid' || invoice.status === 'Sent')) { // Consider sent as potential revenue
          actualRevenue += invoice.subtotal; 
        }
      });

      let actualCosts = 0;
      allBills.forEach(bill => {
        if (bill.projectId === project.id && (bill.status === 'Paid' || bill.status === 'Awaiting Payment' || bill.status === 'Partially Paid')) {
          actualCosts += bill.subtotal; 
        }
      });
      allExpenses.forEach(expense => {
        if (expense.projectId === project.id && (expense.status === 'Approved' || expense.status === 'Reimbursed')) {
          actualCosts += expense.taxAmount ? expense.amount - expense.taxAmount : expense.amount; 
        }
      });
      
      const profitability = actualRevenue - actualCosts;

      return {
        ...project,
        actualRevenue,
        actualCosts,
        profitability,
      };
    });
  }, [projects, allInvoices, allBills, allExpenses]);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projectsWithCalculatedFinancials]; // Create a new array for sorting
    if (filterStatus !== 'all') {
        result = result.filter(p => p.status === filterStatus);
    }
    result.sort((a, b) => {
        let valA: any = a[sortKey];
        let valB: any = b[sortKey];

        if (sortKey === 'startDate' && a.startDate && b.startDate) {
            valA = new Date(a.startDate).getTime();
            valB = new Date(b.startDate).getTime();
        } else if (sortKey === 'budget' || sortKey === 'profitability') {
            valA = Number(valA) || 0;
            valB = Number(valB) || 0;
        } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = (valB as string)?.toLowerCase() || '';
        }
        
        if (valA === undefined || valA === null) valA = sortOrder === 'asc' ? Infinity : -Infinity;
        if (valB === undefined || valB === null) valB = sortOrder === 'asc' ? Infinity : -Infinity;


        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    return result;
  }, [projectsWithCalculatedFinancials, filterStatus, sortKey, sortOrder]);


  const handleAddNewProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (projectToSave: Project) => {
    if (editingProject) {
      setProjects(prevProjects => prevProjects.map(p => p.id === projectToSave.id ? projectToSave : p));
    } else {
      setProjects(prevProjects => [...prevProjects, { ...projectToSave, id: `proj_${Date.now()}` }]);
    }
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
    }
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }

  const statusFilterOptions = [{value: 'all', label: 'All Statuses'}, ...Object.values(ProjectStatus).map(s => ({value: s, label: s}))];
  const sortKeyOptions = [
      {value: 'name', label: 'Name'},
      {value: 'startDate', label: 'Start Date'},
      {value: 'budget', label: 'Budget'},
      {value: 'status', label: 'Status'},
      {value: 'profitability', label: 'Profitability'},
  ];


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Job & Project Tracking</h2>
        <Button onClick={handleAddNewProject} leftIcon={<PlusIcon className="w-4 h-4" />}>
          New Project
        </Button>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <Select
            label="Filter by Status"
            options={statusFilterOptions}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'all')}
            wrapperClassName="mb-0 flex-grow sm:flex-grow-0 sm:w-48"
        />
        <div className="flex items-end gap-2 flex-grow sm:flex-grow-0 sm:w-64">
             <Select
                label="Sort by"
                options={sortKeyOptions}
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as ProjectSortKey)}
                wrapperClassName="mb-0 flex-1"
            />
            <Button variant="outline" size="md" onClick={toggleSortOrder} className="px-3" aria-label={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
                {sortOrder === 'asc' ? <ChevronUpIcon className="w-5 h-5"/> : <ChevronDownIcon className="w-5 h-5"/>}
            </Button>
        </div>
      </div>


      {filteredAndSortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              customerName={MOCK_CUSTOMERS.find(c => c.id === project.customerId)?.name}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
            <ClipboardListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No projects found.</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or add a new project.</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <ProjectForm
          initialProject={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          customers={MOCK_CUSTOMERS}
        />
      </Modal>
    </div>
  );
};

export default ProjectsPage;
