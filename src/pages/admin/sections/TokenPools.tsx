import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FaPlus, FaEdit, FaTrash, FaCoins } from 'react-icons/fa';
import { TokenPool } from '@/types/landing';
import { createAdminSettingApi, updateAdminSettingApi, deleteAdminSettingApi } from '@/store/admin';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { toast } from 'sonner';

interface TokenPoolsProps {
  data: TokenPool[];
}

const TokenPools: React.FC<TokenPoolsProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPool, setEditingPool] = useState<TokenPool | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      table_name: 'token_pools',
      data: {
        ...formData,
        ...(editingPool && { id: editingPool.id })
      },
    };

    try {
      if (editingPool) {
        await dispatch(updateAdminSettingApi(payload) as any);
        toast.success('Token pool updated successfully!');
      } else {
        await dispatch(createAdminSettingApi(payload) as any);
        toast.success('Token pool created successfully!');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save token pool');
    }
  };

  const handleEdit = (pool: TokenPool) => {
    setEditingPool(pool);
    setFormData({
      title: pool.title,
      description: pool.description,
      amount: pool.amount
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this token pool?')) {
      try {
        await dispatch(deleteAdminSettingApi('token_pools', id) as any);
        toast.success('Token pool deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete token pool');
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', amount: '' });
    setEditingPool(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Token Pools Management</h3>
          <p className="text-sm text-gray-600">Manage token pools for the platform</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} disabled className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
              <FaPlus className="w-4 h-4" />
              Add Token Pool
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingPool ? 'Edit Token Pool' : 'Create New Token Pool'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter pool title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter pool description"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  value={formData.amount ? parseFloat(formData.amount).toFixed(2) : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setFormData({ ...formData, amount: value });
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setFormData({ ...formData, amount: parseFloat(e.target.value).toFixed(2) });
                    }
                  }}
                  placeholder="Enter token amount"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  {editingPool ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaCoins className="w-5 h-5 text-green-600" />
            Token Pools ({data.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaCoins className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No token pools found</p>
              <p className="text-sm">Create your first token pool to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((pool) => (
                  <TableRow key={pool.id}>
                    <TableCell className="font-medium">{pool.title}</TableCell>
                    <TableCell>{pool.description}</TableCell>
                    <TableCell>{parseFloat(pool.amount).toFixed(2)}</TableCell>
                    <TableCell>{new Date(pool.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pool)}
                          className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          onClick={() => handleDelete(pool.id)}
                          className="border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
                        >
                          <FaTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenPools; 