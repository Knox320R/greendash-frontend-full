import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createAdminSettingApi, updateAdminSettingApi, deleteAdminSettingApi } from '@/store/admin';
import { AdminSetting } from '@/types/landing';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';

interface AdminSettingsProps {
  data: AdminSetting[];
}

interface AdminSettingForm {
  title: string;
  description: string;
  value: string;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [openDialog, setOpenDialog] = useState(false);
  const [editSetting, setEditSetting] = useState<AdminSetting | null>(null);
  const [deleteSettingId, setDeleteSettingId] = useState<number | null>(null);

  const form = useForm<AdminSettingForm>({
    defaultValues: {
      title: '',
      description: '',
      value: '',
    },
  });

  React.useEffect(() => {
    if (editSetting) {
      form.reset({
        title: editSetting.title,
        description: editSetting.description,
        value: editSetting.value,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        value: '',
      });
    }
  }, [editSetting, form]);

  const handleSubmit = async (formData: AdminSettingForm) => {
    try {
      if (editSetting) {
        // Update existing setting
        const updateData = {
          field_name: 'admin_settings' as const,
          data: {
            ...editSetting,
            ...formData,
            updatedAt: new Date().toISOString(),
          }
        };
        await dispatch(updateAdminSettingApi(updateData));
      } else {
        // Create new setting
        const newSetting: AdminSetting = {
          id: Date.now(), // Will be replaced by backend
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const createData = {
          field_name: 'admin_settings' as const,
          data: newSetting
        };
        await dispatch(createAdminSettingApi(createData));
      }
      setOpenDialog(false);
      setEditSetting(null);
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleDelete = async () => {
    if (deleteSettingId) {
      try {
        const settingToDelete = data.find(setting => setting.id === deleteSettingId);
        if (settingToDelete) {
          const deleteData = {
            field_name: 'admin_settings' as const,
            data: settingToDelete
          };
          await dispatch(deleteAdminSettingApi(deleteData));
        }
        setDeleteSettingId(null);
      } catch (error) {
        console.error('Error deleting setting:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Admin Settings</span>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => { setEditSetting(null); setOpenDialog(true); }} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editSetting ? 'Edit Setting' : 'Add Setting'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField name="title" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} required /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="description" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} required /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="value" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl><Input {...field} required /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
                    {editSetting ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((setting) => (
              <TableRow key={setting.id}>
                <TableCell className="font-medium">{setting.title}</TableCell>
                <TableCell className="max-w-xs truncate">{setting.description}</TableCell>
                <TableCell className="max-w-xs truncate">{setting.value}</TableCell>
                <TableCell>{formatDate(setting.createdAt)}</TableCell>
                <TableCell>{formatDate(setting.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditSetting(setting); setOpenDialog(true); }}
                    >
                      <FaEdit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteSettingId(setting.id)}
                        >
                          <FaTrash className="w-4 h-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Setting</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{setting.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminSettings; 