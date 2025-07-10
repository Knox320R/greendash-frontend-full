import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createAdminSettingApi, updateAdminSettingApi, deleteAdminSettingApi } from '@/store/admin';
import { RankPlan } from '@/types/landing';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';

interface RankPlansProps {
  data: RankPlan[];
}

interface RankPlanForm {
  rank: string;
  bonus_amount: string;
  volume: string;
  equivalent: string;
}

const RankPlans: React.FC<RankPlansProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [openDialog, setOpenDialog] = useState(false);
  const [editPlan, setEditPlan] = useState<RankPlan | null>(null);
  const [deletePlanId, setDeletePlanId] = useState<number | null>(null);

  const form = useForm<RankPlanForm>({
    defaultValues: {
      rank: '',
      bonus_amount: '',
      volume: '',
      equivalent: '',
    },
  });

  React.useEffect(() => {
    if (editPlan) {
      form.reset({
        rank: editPlan.rank,
        bonus_amount: editPlan.bonus_amount,
        volume: editPlan.volume,
        equivalent: editPlan.equivalent || '',
      });
    } else {
      form.reset({
        rank: '',
        bonus_amount: '',
        volume: '',
        equivalent: '',
      });
    }
  }, [editPlan, form]);

  const handleSubmit = async (formData: RankPlanForm) => {
    try {
      if (editPlan) {
        // Update existing plan
        const updateData = {
          table_name: 'rank_plans' as const,
          data: {
            ...editPlan,
            ...formData,
            equivalent: formData.equivalent || null,
            updatedAt: new Date().toISOString(),
          }
        };
        await dispatch(updateAdminSettingApi(updateData));
      } else {
        // Create new plan
        const createData = {
          table_name: 'rank_plans' as const,
          data: formData
        };
        await dispatch(createAdminSettingApi(createData));
      }
      setOpenDialog(false);
      setEditPlan(null);
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleDelete = async () => {
    if (deletePlanId) {
      try {
        const planToDelete = data.find(plan => plan.id === deletePlanId);
        if (planToDelete) {
          await dispatch(deleteAdminSettingApi('rank_plans', deletePlanId));
        }
        setDeletePlanId(null);
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Rank Plans</span>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => { setEditPlan(null); setOpenDialog(true); }} 
              disabled
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Rank Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editPlan ? 'Edit Rank Plan' : 'Add Rank Plan'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField name="rank" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rank</FormLabel>
                    <FormControl><Input {...field} required /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="bonus_amount" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus Amount (USDT)</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" step="0.01" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="volume" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume (USDT)</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" step="0.01" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="equivalent" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equivalent (Optional)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
                    {editPlan ? 'Update' : 'Create'}
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
              <TableHead>Rank</TableHead>
              <TableHead>Bonus Amount</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Equivalent</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.rank}</TableCell>
                <TableCell>{plan.bonus_amount} USDT</TableCell>
                <TableCell>{plan.volume} USDT</TableCell>
                <TableCell>{plan.equivalent || '-'}</TableCell>
                <TableCell>{formatDate(plan.createdAt)}</TableCell>
                <TableCell>{formatDate(plan.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditPlan(plan); setOpenDialog(true); }}
                    >
                      <FaEdit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          onClick={() => setDeletePlanId(plan.id)}
                        >
                          <FaTrash className="w-4 h-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Rank Plan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{plan.rank}"? This action cannot be undone.
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

export default RankPlans; 