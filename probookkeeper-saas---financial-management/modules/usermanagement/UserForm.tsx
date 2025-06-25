
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

interface UserFormProps {
  initialUser?: User | null;
  onSave: (user: User) => void; // User object now includes password if it's a new user
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialUser, onSave, onCancel }) => {
  const [user, setUser] = useState<Partial<User>>(
    initialUser || {
      fullName: '',
      username: '',
      email: '',
      role: 'Staff',
      isActive: true,
      password: '', 
    }
  );
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (initialUser) {
      setUser({ ...initialUser, password: '' }); 
      setConfirmPassword('');
    } else {
      setUser({
        fullName: '',
        username: '',
        email: '',
        role: 'Staff',
        isActive: true,
        password: '',
      });
      setConfirmPassword('');
    }
    setPasswordError('');
  }, [initialUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setUser(prev => ({ ...prev, [name]: checked }));
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!user.fullName || !user.username || !user.role) {
      alert('Please fill in Full Name, Username, and Role.');
      return;
    }

    let finalPassword = initialUser ? initialUser.password : user.password; // Keep existing password for edits unless changed

    if (!initialUser) { // New user: password is required
      if (!user.password || user.password.length < 6) {
        setPasswordError('Password must be at least 6 characters long.');
        return;
      }
      if (user.password !== confirmPassword) {
        setPasswordError('Passwords do not match.');
        return;
      }
      finalPassword = user.password;
    } else {
      // Editing existing user: If password field has content, it means they want to change it
      if (user.password && user.password.length > 0) {
        if (user.password.length < 6) {
           setPasswordError('New password must be at least 6 characters long.');
           return;
        }
        if (user.password !== confirmPassword) {
           setPasswordError('New passwords do not match.');
           return;
        }
        finalPassword = user.password; // Update password
      }
      // If user.password is empty during edit, finalPassword remains initialUser.password (or undefined if it was).
      // The service layer should handle how to update (or not update) password on backend.
    }


    const userToSave: User = {
        id: initialUser?.id || '', 
        fullName: user.fullName!,
        username: user.username!,
        email: user.email,
        role: user.role!,
        isActive: user.isActive === undefined ? true : user.isActive,
        password: finalPassword, // This will be undefined or the new password for edits, or the new password for creations
    };
    
    onSave(userToSave);
  };

  const roleOptions: { value: User['role'], label: string }[] = [
    { value: 'Admin', label: 'Administrator' },
    { value: 'Bookkeeper', label: 'Bookkeeper' },
    { value: 'Payroll Manager', label: 'Payroll Manager' },
    { value: 'Sales', label: 'Sales Staff' },
    { value: 'Staff', label: 'General Staff' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <Input label="Full Name*" name="fullName" value={user.fullName || ''} onChange={handleChange} required />
      <Input label="Username*" name="username" value={user.username || ''} onChange={handleChange} required />
      <Input label="Email (Optional)" name="email" type="email" value={user.email || ''} onChange={handleChange} />
      
      <Select label="Role*" name="role" value={user.role || 'Staff'} onChange={handleChange} options={roleOptions} required />

      
      <Input 
        label={initialUser ? "New Password (leave blank to keep current)" : "Password*"}
        name="password" 
        type="password" 
        value={user.password || ''} 
        onChange={handleChange} 
        required={!initialUser} 
        error={passwordError && (passwordError.includes('6 characters') || passwordError.includes('required')) ? passwordError : undefined}
        autoComplete="new-password"
      />
      {(initialUser || user.password) && ( // Show confirm password if it's a new user or if password field has input for existing user
          <Input 
            label={initialUser ? "Confirm New Password" : "Confirm Password*"}
            name="confirmPassword" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required={!initialUser || !!user.password}
            error={passwordError && passwordError.includes('match') ? passwordError : undefined}
            autoComplete="new-password"
          />
      )}


      <div className="flex items-center">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={user.isActive === undefined ? true : user.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          User is Active
        </label>
      </div>

      {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialUser ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
