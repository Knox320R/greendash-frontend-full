import React, { useState } from 'react';
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
  percent: number;
}

const TotalTokens: React.FC<TotalTokensProps> = ({ data }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editToken, setEditToken] = useState<TotalToken | null>(null);
  const [deleteTokenId, setDeleteTokenId] = useState<number | null>(null);
  const [tokens, setTokens] = useState<TotalToken[]>(data);

  const form = useForm<TotalTokenForm>({
    defaultValues: {
      title: '',
      description: '',
      percent: 0,
    },
  });

  React.useEffect(() => {
    if (editToken) {
      form.reset({
        title: editToken.title,
        description: editToken.description,
        percent: editToken.percent,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        percent: 0,
      });
    }
  }, [editToken, form]);

  const handleSubmit = async (formData: TotalTokenForm) => {
    try {
      if (editToken) {
        // Mock update operation
        const updatedTokens = tokens.map(token =>
          token.id === editToken.id
            ? { ...token, ...formData, updatedAt: new Date().toISOString() }
            : token
        );
        setTokens(updatedTokens);
      } else {
        // Mock create operation
        const newToken: TotalToken = {
          id: Date.now(), // Mock ID
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTokens([...tokens, newToken]);
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
        // Mock delete operation
        const filteredTokens = tokens.filter(token => token.id !== deleteTokenId);
        setTokens(filteredTokens);
        setDeleteTokenId(null);
      } catch (error) {
        console.error('Error deleting token:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Total Token Allocations</span>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button 
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
                <FormField name="percent" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage (%)</FormLabel>
                    <FormControl><Input {...field} required type="number" min="0" max="100" step="0.01" /></FormControl>
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
              <TableHead>Percentage</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell className="font-medium">{token.title}</TableCell>
                <TableCell className="max-w-xs truncate">{token.description}</TableCell>
                <TableCell>{token.percent}%</TableCell>
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