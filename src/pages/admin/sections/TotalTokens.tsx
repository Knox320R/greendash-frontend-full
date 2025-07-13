import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createAdminSettingApi, updateAdminSettingApi, deleteAdminSettingApi } from '@/store/admin';
import { TotalToken } from '@/types/landing';
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

interface TotalTokensProps {
  data: TotalToken[];
}

interface TotalTokenForm {
  title: string;
  description: string;
  amount: string;
  price: number | null;
}

const TotalTokens: React.FC<TotalTokensProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [openDialog, setOpenDialog] = useState(false);
  const [editToken, setEditToken] = useState<TotalToken | null>(null);
  const [deleteTokenId, setDeleteTokenId] = useState<number | null>(null);

  // Calculate total supply for percentage calculation
  const totalSupply = data.reduce((sum, token) => sum + parseFloat(token.amount), 0);

  // Helper function to calculate percentage
  const calculatePercentage = (amount: string) => {
    const numAmount = parseFloat(amount);
    return totalSupply > 0 ? (numAmount / totalSupply) * 100 : 0;
  };

  // Helper function to get color based on percentage
  const getPercentageColor = (percentage: number, opacity: number = 1) => {
    if (percentage >= 50) return `rgba(34, 197, 94, ${opacity})`; // Green for high percentage
    if (percentage >= 25) return `rgba(59, 130, 246, ${opacity})`; // Blue for medium percentage
    if (percentage >= 10) return `rgba(245, 158, 11, ${opacity})`; // Yellow for low-medium percentage
    return `rgba(239, 68, 68, ${opacity})`; // Red for very low percentage
  };

  const form = useForm<TotalTokenForm>({
    defaultValues: {
      title: '',
      description: '',
      amount: '',
      price: null,
    },
  });

  React.useEffect(() => {
    if (editToken) {
      form.reset({
        title: editToken.title,
        description: editToken.description,
        amount: editToken.amount,
        price: editToken.price,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        amount: '',
        price: null,
      });
    }
  }, [editToken, form]);

  const handleSubmit = async (formData: TotalTokenForm) => {
    try {
      if (editToken) {
        // Update existing token
        const updateData = {
          table_name: 'total_tokens' as const,
          data: {
            ...editToken,
            ...formData,
            updatedAt: new Date().toISOString(),
          }
        };
        await dispatch(updateAdminSettingApi(updateData));
      } else {
        // Create new token
        const createData = {
          table_name: 'total_tokens' as const,
          data: formData
        };
        await dispatch(createAdminSettingApi(createData));
      }
      setOpenDialog(false);
      setEditToken(null);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const handleDelete = async () => {
    if (deleteTokenId) {
      try {
        const tokenToDelete = data.find(token => token.id === deleteTokenId);
        if (tokenToDelete) {
          const deleteData = {
            table_name: 'total_tokens' as const,
            data: tokenToDelete
          };
          await dispatch(deleteAdminSettingApi('total_tokens', deleteTokenId));
        }
        setDeleteTokenId(null);
      } catch (error) {
        console.error('Error deleting token:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-lg font-semibold">Total Token Allocations</span>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>Total Supply: {totalSupply.toLocaleString()}</span>
            <span>Total Percentage: {data.reduce((sum, token) => sum + calculatePercentage(token.amount), 0).toFixed(2)}%</span>
          </div>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              disabled
              onClick={() => { setEditToken(null); setOpenDialog(true); }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Token Allocation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editToken ? 'Edit Token Allocation' : 'Add Token Allocation'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField name="title" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} disabled /></FormControl>
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
                <FormField name="amount" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        placeholder="Enter token amount"
                        value={field.value ? parseFloat(field.value).toFixed(2) : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          field.onChange(value);
                        }}
                        onBlur={(e) => {
                          if (e.target.value) {
                            field.onChange(parseFloat(e.target.value).toFixed(2));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="price" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter token price"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
                    {editToken ? 'Update' : 'Create'}
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
              <TableHead>Amount</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((token) => (
              <TableRow key={token.id}>
                <TableCell className="font-medium">{token.title}</TableCell>
                <TableCell className="max-w-xs truncate">{token.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {parseFloat(token.amount).toFixed(2)}
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(calculatePercentage(token.amount), 100)}%`,
                          background: `linear-gradient(90deg, ${getPercentageColor(calculatePercentage(token.amount))} 0%, ${getPercentageColor(calculatePercentage(token.amount), 0.8)} 100%)`
                        }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{token.price ? `$${token.price.toFixed(2)}` : 'N/A'}</TableCell>
                <TableCell>{formatDate(token.createdAt)}</TableCell>
                <TableCell>{formatDate(token.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditToken(token); setOpenDialog(true); }}
                    >
                      <FaEdit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          onClick={() => setDeleteTokenId(token.id)}
                        >
                          <FaTrash className="w-4 h-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Token Allocation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{token.title}"? This action cannot be undone.
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

export default TotalTokens; 