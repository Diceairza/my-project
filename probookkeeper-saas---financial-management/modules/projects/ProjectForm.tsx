import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, Customer } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { DEFAULT_CURRENCY } from '../../constants';

interface ProjectFormProps {
  initialProject?: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
  customers: Customer[]; // To populate customer dropdown
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialProject, onSave, onCancel, customers }) => {
  const [project, setProject] = useState<Partial<Project>>(
    initialProject || {
      name: '',
      description: '',
      customerId: undefined,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      budget: 0,
      status: ProjectStatus.PLANNING,
      currency: DEFAULT_CURRENCY,
    }
  );

  useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
    } else {
      setProject({
        name: '',
        description: '',
        customerId: customers.length > 0 ? customers[0].id : undefined,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        budget: 0,
        status: ProjectStatus.PLANNING,
        currency: DEFAULT_CURRENCY,
      });
    }
  }, [initialProject, customers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.name || !project.status) {
      alert("Please fill in Project Name and Status.");
      return;
    }
    onSave(project as Project);
  };

  const customerOptions = customers.map(c => ({ value: c.id, label: c.name }));
  customerOptions.unshift({ value: '', label: 'None / Internal Project' });

  const statusOptions = Object.values(ProjectStatus).map(s => ({
    value: s,
    label: s,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
      <Input
        label="Project Name*"
        name="name"
        value={project.name || ''}
        onChange={handleChange}
        required
        placeholder="e.g., New Website Launch Q4"
      />
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={project.description || ''}
          onChange={handleChange}
          placeholder="Brief overview of the project scope and objectives"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Customer (Optional)"
          name="customerId"
          value={project.customerId || ''}
          onChange={handleChange}
          options={customerOptions}
        />
        <Select
          label="Status*"
          name="status"
          value={project.status || ProjectStatus.PLANNING}
          onChange={handleChange}
          options={statusOptions}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Start Date" name="startDate" type="date" value={project.startDate || ''} onChange={handleChange} />
        <Input label="End Date (Optional)" name="endDate" type="date" value={project.endDate || ''} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={`Budget (${project.currency || DEFAULT_CURRENCY})`}
          name="budget"
          type="number"
          value={project.budget === undefined ? '' : project.budget} // Handle initial undefined for placeholder
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="e.g., 50000.00"
        />
         <Input
            label="Currency"
            name="currency"
            value={project.currency || DEFAULT_CURRENCY}
            readOnly
            className="bg-gray-100"
        />
      </div>


      <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialProject ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
