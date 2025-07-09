import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createAdminSettingApi, updateAdminSettingApi, deleteAdminSettingApi } from '@/store/admin';
import { CommissionPlan } from '@/types/landing';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';

interface CommissionPlansProps {
  data: CommissionPlan[];
}

interface CommissionPlanForm {
  level: number;
  commission_percent: number;
}

const CommissionPlans: React.FC<CommissionPlansProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [openDialog, setOpenDialog] = useState(false);
  const [editPlan, setEditPlan] = useState<CommissionPlan | null>(null);
  const [deletePlanId, setDeletePlanId] = useState<number | null>(null);

  const form = useForm<CommissionPlanForm>({
    defaultValues: {
      level: 1,
      commission_percent: 0,
    },
  });

  React.useEffect(() => {
    if (editPlan) {
      form.reset({
        level: editPlan.level,
        commission_percent: editPlan.commission_percent,
      });
    } else {
      form.reset({
        level: 1,
        commission_percent: 0,
      });
    }
  }, [editPlan, form]);

  const handleSubmit = async (formData: CommissionPlanForm) => {
    try {
      if (editPlan) {
        // Update existing plan
        const updateData = {
          table_name: 'commission_plans' as const,
          data: {
            ...editPlan,
            ...formData,
            updatedAt: new Date().toISOString(),
          }
        };
        await dispatch(updateAdminSettingApi(updateData));
      } else {
        // Create new plan
        const createData = {
          table_name: 'commission_plans' as const,
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
          await dispatch(deleteAdminSettingApi('commission_plans', deletePlanId));
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
        <span className="text-lg font-semibold">Commission Plans</span>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => { setEditPlan(null); setOpenDialog(true); }} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Commission Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editPlan ? 'Edit Commission Plan' : 'Add Commission Plan'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField name="level" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl><Input {...field} required type="number" min="1" step="1" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="commission_percent" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Percentage (%)</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" max="100" step="0.01" /></FormControl>
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
              <TableHead>Level</TableHead>
              <TableHead>Commission Percentage</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">Level {plan.level}</TableCell>
                <TableCell>{plan.commission_percent}%</TableCell>
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
                          onClick={() => setDeletePlanId(plan.id)}
                        >
                          <FaTrash className="w-4 h-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Commission Plan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete Level {plan.level}? This action cannot be undone.
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

export default CommissionPlans; 