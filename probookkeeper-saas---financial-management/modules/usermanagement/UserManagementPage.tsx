
import React, { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import { User } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import UserForm from './UserForm'; 
import { PlusIcon, EditIcon, Trash2Icon, CheckCircle2Icon, CircleOffIcon, KeyIcon, AlertTriangleIcon } from '../../components/icons/LucideIcons';
import { userService } from '../../services/userService';

interface UserManagementPageProps {
  users: User[]; // Passed from App.tsx, reflects the "global" user list
  setUsers: React.Dispatch<React.SetStateAction<User[]>>; // To update App.tsx state
  currentUser: User; 
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ users: initialUsers, setUsers, currentUser }) => {
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    // Initialize displayUsers with the prop, but future fetches will update this local state.
    // This assumes initialUsers from App.tsx is already fetched.
    // If this page should fetch its own data independently:
    /*
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await userService.getUsers();
        setDisplayUsers(fetchedUsers);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load users.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
    */
    setDisplayUsers(initialUsers); // Use users from App.tsx for now
  }, [initialUsers]);

  const refreshUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await userService.getUsers(); // userService fetches from its local (simulated) store
      setUsers(fetchedUsers); // Update App.tsx state
      setDisplayUsers(fetchedUsers); // Update local display state
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to refresh users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenUserModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setEditingUser(null);
    setIsUserModalOpen(false);
  };

  const handleSaveUser = async (userData: User) => {
    setIsLoading(true);
    try {
      if (editingUser) {
        // For updates, don't send password if it's not changed.
        // The UserForm now handles password fields only for new users.
        // If password change for existing users is desired, UserForm needs adjustment.
        const { password, id, ...otherUserDataFields } = userData; // Destructure to remove/handle password and id
        const dataToUpdate: Partial<Omit<User, 'id' | 'password'>> = otherUserDataFields;
        await userService.updateUser(editingUser.id, dataToUpdate);
      } else {
        await userService.createUser(userData); // userData from UserForm will include password for new user
      }
      await refreshUsers(); // Refresh the list in App.tsx and locally
      handleCloseUserModal();
    } catch (err: any) {
      alert(`Error saving user: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmDeleteModal = (user: User) => {
    if (user.id === currentUser.id) {
      alert("You cannot delete your own account.");
      return;
    }
    setUserToDelete(user);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsLoading(true);
    try {
      await userService.deleteUser(userToDelete.id);
      await refreshUsers();
    } catch (err: any) {
      alert(`Error deleting user: ${err.message}`);
    } finally {
      setIsLoading(false);
      setIsConfirmDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };
  
  const handleForcePasswordReset = async (userId: string) => {
      if(window.confirm("Are you sure you want to force a password reset for this user? They will receive a temporary password.")) {
          setIsLoading(true);
          try {
              const result = await userService.forcePasswordReset(userId);
              if(result.success){
                  alert(`Password reset initiated. Temporary password (simulation): ${result.newTemporaryPassword}`);
                  // In a real app, user would be notified via email.
              } else {
                  alert("Failed to reset password.");
              }
          } catch (err: any) {
              alert(`Error resetting password: ${err.message}`);
          } finally {
              setIsLoading(false);
          }
      }
  };


  const getStatusBadge = (isActive?: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
        <CheckCircle2Icon className="w-3 h-3 mr-1" /> Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <CircleOffIcon className="w-3 h-3 mr-1" /> Inactive
      </span>
    );
  };

  const columns = [
    { Header: 'Full Name', accessor: 'fullName' as keyof User, className: 'font-medium' },
    { Header: 'Username', accessor: 'username' as keyof User },
    { Header: 'Role', accessor: 'role' as keyof User },
    { Header: 'Email', accessor: (row: User) => row.email || 'N/A' },
    { Header: 'Last Login', accessor: (row:User) => row.lastLogin ? new Date(row.lastLogin).toLocaleString() : 'Never', },
    { Header: 'Status', accessor: 'isActive' as keyof User, Cell: (isActive?: boolean) => getStatusBadge(isActive) },
    {
      Header: 'Actions',
      accessor: 'id' as keyof User,
      Cell: (_: any, row: User) => (
        <div className="flex space-x-1 items-center">
          <Button variant="ghost" size="sm" onClick={() => handleOpenUserModal(row)} aria-label="Edit User" title="Edit User">
            <EditIcon className="w-4 h-4 text-blue-600 hover:text-blue-800" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleForcePasswordReset(row.id)} 
            aria-label="Force Password Reset"
            title="Force Password Reset"
            disabled={row.id === currentUser.id}
          >
            <KeyIcon className={`w-4 h-4 ${row.id === currentUser.id ? 'text-gray-400' : 'text-orange-500 hover:text-orange-700'}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => openConfirmDeleteModal(row)} 
            aria-label="Delete User"
            disabled={row.id === currentUser.id}
            title={row.id === currentUser.id ? "Cannot delete self" : "Delete User"}
          >
            <Trash2Icon className={`w-4 h-4 ${row.id === currentUser.id ? 'text-gray-400' : 'text-red-600 hover:text-red-800'}`} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
        <Button onClick={() => handleOpenUserModal(null)} leftIcon={<PlusIcon className="w-4 h-4" />} disabled={isLoading}>
          Add New User
        </Button>
      </div>

      {error && (
        <Card title="Error" className="bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
          <Button onClick={refreshUsers} className="mt-2">Try Again</Button>
        </Card>
      )}

      {isLoading && !error && <p>Loading users...</p>}

      {!isLoading && !error && (
        <Card title={`All Users (${displayUsers.length})`}>
          <Table<User> columns={columns} data={displayUsers} />
        </Card>
      )}

      <Modal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="lg"
      >
        <UserForm
          initialUser={editingUser}
          onSave={handleSaveUser}
          onCancel={handleCloseUserModal}
        />
      </Modal>

      {userToDelete && (
        <Modal
            isOpen={isConfirmDeleteModalOpen}
            onClose={() => setIsConfirmDeleteModalOpen(false)}
            title="Confirm Deletion"
            size="sm"
            footer={
                <>
                    <Button variant="outline" onClick={() => setIsConfirmDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteUser} isLoading={isLoading}>Delete User</Button>
                </>
            }
        >
            <div className="text-center">
                <AlertTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-700">Are you sure you want to delete the user <span className="font-semibold">{userToDelete.fullName}</span>?</p>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagementPage;
