import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { stakingPackagesApi, StakingPackage, StakingPackageInput } from '@/store/stakingPackages';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const StakingPackages: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stakingPackages = useSelector((state: RootState) => state.stakingPackages.list) as StakingPackage[];
  const stakingPackagesLoading = useSelector((state: RootState) => state.stakingPackages.isLoading);
  const [openStakingDialog, setOpenStakingDialog] = useState(false);
  const [editStaking, setEditStaking] = useState<StakingPackage | null>(null);
  const [deleteStakingId, setDeleteStakingId] = useState<number | null>(null);
  const stakingForm = useForm<StakingPackageInput>({
    defaultValues: {
      name: '',
      price: 0,
      total_amount: 0,
      remained: 0,
      affiliate_bonus: 0,
      min_amount: 0,
      max_amount: 0,
      daily_return_rate: 0,
      lock_period_days: 0,
    },
  });

  useEffect(() => {
    dispatch(stakingPackagesApi.get());
  }, [dispatch]);

  useEffect(() => {
    if (editStaking) {
      stakingForm.reset({
        name: editStaking.name,
        price: editStaking.price,
        total_amount: editStaking.total_amount,
        remained: editStaking.remained,
        affiliate_bonus: editStaking.affiliate_bonus,
        min_amount: editStaking.min_amount,
        max_amount: editStaking.max_amount,
        daily_return_rate: editStaking.daily_return_rate,
        lock_period_days: editStaking.lock_period_days,
      });
    } else {
      stakingForm.reset({
        name: '',
        price: 0,
        total_amount: 0,
        remained: 0,
        affiliate_bonus: 0,
        min_amount: 0,
        max_amount: 0,
        daily_return_rate: 0,
        lock_period_days: 0,
      });
    }
  }, [editStaking, stakingForm]);

  const handleStakingSubmit = async (data: StakingPackageInput) => {
    if (editStaking) {
      await dispatch(stakingPackagesApi.put({ ...editStaking, ...data }));
    } else {
      await dispatch(stakingPackagesApi.post(data));
    }
    setOpenStakingDialog(false);
    setEditStaking(null);
    dispatch(stakingPackagesApi.get());
  };

  const handleStakingDelete = async () => {
    if (deleteStakingId) {
      await dispatch(stakingPackagesApi.delete(deleteStakingId));
      setDeleteStakingId(null);
      dispatch(stakingPackagesApi.get());
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">All Staking Packages</span>
        <Dialog open={openStakingDialog} onOpenChange={setOpenStakingDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditStaking(null); setOpenStakingDialog(true); }} className="bg-green-600 hover:bg-green-700 text-white">+ Add Package</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editStaking ? 'Edit Staking Package' : 'Add Staking Package'}</DialogTitle>
            </DialogHeader>
            <Form {...stakingForm}>
              <form onSubmit={stakingForm.handleSubmit(handleStakingSubmit)} className="space-y-4">
                <FormField name="name" control={stakingForm.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input {...field} required /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="min_amount" control={stakingForm.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Amount</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" step="0.00000001" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="max_amount" control={stakingForm.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Amount</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" step="0.00000001" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="daily_return_rate" control={stakingForm.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Return Rate (%)</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" step="0.0001" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="lock_period_days" control={stakingForm.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lock Period (days)</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" step="1" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="price" control={stakingForm.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl><Input {...field} type="number" min="0" step="0.00000001" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="total_amount" control={stakingForm.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl><Input {...field} type="number" min="0" step="0.00000001" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="remained" control={stakingForm.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remaining Amount</FormLabel>
                    <FormControl><Input {...field} type="number" min="0" step="0.00000001" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="affiliate_bonus" control={stakingForm.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affiliate Bonus</FormLabel>
                    <FormControl><Input {...field} type="number" min="0" step="0.00000001" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">{editStaking ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {stakingPackagesLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Max</TableHead>
                <TableHead>Daily %</TableHead>
                <TableHead>Lock (days)</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Remain</TableHead>
                <TableHead>Affiliate Bonus</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stakingPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.name}</TableCell>
                  <TableCell>{pkg.min_amount}</TableCell>
                  <TableCell>{pkg.max_amount}</TableCell>
                  <TableCell>{pkg.daily_return_rate}</TableCell>
                  <TableCell>{pkg.lock_period_days}</TableCell>
                  <TableCell>{pkg.price}</TableCell>
                  <TableCell>{pkg.total_amount}</TableCell>
                  <TableCell>{pkg.remained}</TableCell>
                  <TableCell>{pkg.affiliate_bonus}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditStaking(pkg); setOpenStakingDialog(true); }}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Staking Package</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete this staking package? This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { setDeleteStakingId(pkg.id); handleStakingDelete(); }}>Delete</AlertDialogAction>
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
      )}
    </div>
  );
};

export default StakingPackages; 