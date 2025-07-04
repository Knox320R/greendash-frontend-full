import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { ordersApi, Order } from '@/store/orders';
import { usersApi, User } from '@/store/users';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from '@/components/ui/alert-dialog';

const OrderManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders.list) as Order[];
  const ordersLoading = useSelector((state: RootState) => state.orders.isLoading);
  const users = useSelector((state: RootState) => state.users.list) as User[];
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(ordersApi.get());
    if (users.length === 0) dispatch(usersApi.get());
  }, [dispatch, users.length]);

  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<number, User>);

  const handleOrderStatusChange = async (order: Order, newStatus: string) => {
    await dispatch(ordersApi.put({ ...order, status: newStatus }));
    dispatch(ordersApi.get());
  };

  const handleOrderDelete = async () => {
    if (deleteOrderId) {
      await dispatch(ordersApi.delete(deleteOrderId));
      setDeleteOrderId(null);
      dispatch(ordersApi.get());
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">All Orders</span>
      </div>
      {ordersLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Tokens Requested</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const user = userMap[order.user_id];
                return (
                  <TableRow key={order.id}>
                    <TableCell>{user ? `${user.name} (${user.email})` : <span className="italic text-gray-400">Unknown</span>}</TableCell>
                    <TableCell>{order.amount_paid}</TableCell>
                    <TableCell>{order.tokens_requested}</TableCell>
                    <TableCell>{order.payment_method}</TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.status !== 'pending' ? (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleOrderStatusChange(order, 'approved')}>Accept</Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleOrderStatusChange(order, 'rejected')}>Reject</Button>
                          </>
                        ) : null}
                        <AlertDialog>
                          {/* <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">Delete</Button>
                          </AlertDialogTrigger> */}
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Order</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure you want to delete this order? This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { setDeleteOrderId(order.id); handleOrderDelete(); }}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement; 