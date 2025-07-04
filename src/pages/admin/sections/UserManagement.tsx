import React, { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';

const UserManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<{ success: boolean; data: User[] }>('/admin/users');
        if (response.success) {
          setUsers(response.data);
        }
      } catch (error) {
        // handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const form = useForm<{ name: string; email: string; password: string; avatar: string; wallet_address: string; referral_code: string; is_admin: boolean }>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      avatar: '',
      wallet_address: '',
      referral_code: '',
      is_admin: false,
    },
  });
  useEffect(() => {
    if (editUser) {
      form.reset({
        name: editUser.first_name + ' ' + editUser.last_name,
        email: editUser.email,
        password: '',
        avatar: editUser.profile_image || '',
        wallet_address: editUser.wallet_address || '',
        referral_code: editUser.referral_code || '',
        is_admin: editUser.is_admin,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        password: '',
        avatar: '',
        wallet_address: '',
        referral_code: '',
        is_admin: false,
      });
    }
  }, [editUser, form]);

  const handleSubmit = async (data: { name: string; email: string; password: string; avatar: string; wallet_address: string; referral_code: string; is_admin: boolean }) => {
    try {
      if (editUser) {
        await api.post(`/admin/users/${editUser.id}/update`, { ...data });
      } else {
        await api.post('/admin/users/create', { ...data });
      }
      setOpenDialog(false);
      setEditUser(null);
      // Refresh users
      const response = await api.get<{ success: boolean; data: User[] }>('/admin/users');
      if (response.success) setUsers(response.data);
    } catch (error) {
      // handle error
    }
  };

  const handleDelete = async () => {
    if (deleteUserId) {
      try {
        await api.post(`/admin/users/${deleteUserId}/delete`);
        setDeleteUserId(null);
        // Refresh users
        const response = await api.get<{ success: boolean; data: User[] }>('/admin/users');
        if (response.success) setUsers(response.data);
      } catch (error) {
        // handle error
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">All Users</span>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditUser(null); setOpenDialog(true); }} className="bg-green-600 hover:bg-green-700 text-white">+ Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input {...field} required /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input {...field} required type="email" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="password" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password {editUser ? <span className="text-xs text-gray-400">(leave blank to keep unchanged)</span> : null}</FormLabel>
                    <FormControl><Input {...field} type="password" autoComplete="new-password" placeholder={editUser ? '••••••••' : ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="avatar" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="wallet_address" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="referral_code" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referral Code</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="is_admin" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin</FormLabel>
                    <FormControl>
                      <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">{editUser ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Referral</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      {user.profile_image ? <AvatarImage src={user.profile_image} alt={user.first_name} /> : <AvatarFallback>{user.first_name[0]}</AvatarFallback>}
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.is_admin ? 'Admin' : 'User'}</TableCell>
                  <TableCell>{user.wallet_address || <span className="italic text-gray-400">-</span>}</TableCell>
                  <TableCell>{user.referral_code || <span className="italic text-gray-400">-</span>}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditUser(user); setOpenDialog(true); }}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" onClick={() => setDeleteUserId(user.id)}>Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete this user? This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UserManagement; 