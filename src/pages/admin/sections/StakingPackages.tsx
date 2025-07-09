import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createAdminSettingApi, updateAdminSettingApi, deleteAdminSettingApi } from '@/store/admin';
import { StakingPackage } from '@/types/landing';
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

interface StakingPackagesProps {
  data: StakingPackage[];
}

interface StakingPackageForm {
  name: string;
  description: string;
  stake_amount: string;
  daily_yield_percentage: number;
  lock_period_days: number;
}

const StakingPackages: React.FC<StakingPackagesProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [openDialog, setOpenDialog] = useState(false);
  const [editPackage, setEditPackage] = useState<StakingPackage | null>(null);
  const [deletePackageId, setDeletePackageId] = useState<number | null>(null);

  const form = useForm<StakingPackageForm>({
    defaultValues: {
      name: '',
      description: '',
      stake_amount: '',
      daily_yield_percentage: 0,
      lock_period_days: 0,
    },
  });

  React.useEffect(() => {
    if (editPackage) {
      form.reset({
        name: editPackage.name,
        description: editPackage.description,
        stake_amount: editPackage.stake_amount,
        daily_yield_percentage: editPackage.daily_yield_percentage,
        lock_period_days: editPackage.lock_period_days,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        stake_amount: '',
        daily_yield_percentage: 0,
        lock_period_days: 0,
      });
    }
  }, [editPackage, form]);

  const handleSubmit = async (formData: StakingPackageForm) => {
    try {
      if (editPackage) {
        // Update existing package
        const updateData = {
          table_name: 'staking_packages' as const,
          data: {
            ...editPackage,
            ...formData,
          }
        };
        await dispatch(updateAdminSettingApi(updateData));
      } else {
        // Create new package
        const createData = {
          table_name: 'staking_packages' as const,
          data: formData
        };
        await dispatch(createAdminSettingApi(createData));
      }
      setOpenDialog(false);
      setEditPackage(null);
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handleDelete = async () => {
    if (deletePackageId) {
      try {
        const packageToDelete = data.find(pkg => pkg.id === deletePackageId);
        if (packageToDelete) {
          dispatch(deleteAdminSettingApi('staking_packages', deletePackageId));
        }
        setDeletePackageId(null);
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Staking Packages</span>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => { setEditPackage(null); setOpenDialog(true); }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editPackage ? 'Edit Package' : 'Add Package'}</DialogTitle>
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
                <FormField name="description" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} required /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="stake_amount" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stake Amount (EGD)</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" step="0.01" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="daily_yield_percentage" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Yield (%)</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" step="0.01" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="lock_period_days" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lock Period (days)</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" step="1" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
                    {editPackage ? 'Update' : 'Create'}
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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Stake Amount</TableHead>
              <TableHead>Daily Yield</TableHead>
              <TableHead>Lock Period</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell className="max-w-xs truncate">{pkg.description}</TableCell>
                <TableCell>{parseInt(pkg.stake_amount)} USDT</TableCell>
                <TableCell>{pkg.daily_yield_percentage}%</TableCell>
                <TableCell>{pkg.lock_period_days} days</TableCell>
                <TableCell>{formatDate(pkg.createdAt)}</TableCell>
                <TableCell>{formatDate(pkg.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditPackage(pkg); setOpenDialog(true); }}
                    >
                      <FaEdit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletePackageId(pkg.id)}
                        >
                          <FaTrash className="w-4 h-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Package</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{pkg.name}"? This action cannot be undone.
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

export default StakingPackages; 