import { Button } from "@/components/ui/button";
import { DialogTrigger, Dialog } from "@/components/ui/dialog";
import { TableRow, TableCell } from "@/components/ui/table";

import { Search, ArrowRight, X } from "lucide-react";
import { OrderDetails } from "./order-details";
import { OrderStatus } from "@/components/order-status";

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cache, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/api/cancel-order";
import type { GetOrdersResponse } from "@/api/get-orders";
import { approveOrder } from "@/api/approve-order";
import { deliverOrder } from "@/api/deliver-order";
import { dispatchOrder } from "@/api/dispatch-order";

export interface OrderTableRowProps {
    order: {
        orderId: string;
        createdAt: string;
        status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
        customerName: string;
        total: number;
    }
}

export function OrderTableRow({ order }: OrderTableRowProps) {
    const queryClient = useQueryClient()
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
        const ordersListCached = queryClient.getQueriesData<GetOrdersResponse>({
            queryKey: ['orders'],
        })

        ordersListCached.forEach(([cacheKey, cacheData]) => {
            if (!cacheData) {
                return
            }

            queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
                ...cacheData,
                orders: cacheData.orders.map(order => {
                    if (order.orderId === orderId) {
                        return { ...order, status }
                    }

                    return order
                })
            })
        })
    }

    const { mutateAsync: cancelOrderFn, isPending: isCancelingOrder } = useMutation({
        mutationFn: cancelOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'canceled')
        }
    })

        const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } = useMutation({
        mutationFn: approveOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'processing')
        }
    })

        const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } = useMutation({
        mutationFn: deliverOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'delivering')
        }
    })

        const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } = useMutation({
        mutationFn: dispatchOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'delivered')
        }
    })

    return (
        <TableRow>
            <TableCell>
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogTrigger asChild>
                        <Button variant='outline' size='xs'>
                            <Search className="h-3 w-3" />
                            <span className="sr-only">Detalhes do Pedido</span>
                        </Button>
                    </DialogTrigger>
                    <OrderDetails open={isDetailsOpen} orderId={order.orderId} />
                </Dialog>
            </TableCell>
            <TableCell className="font-mono text-xs font-medium">{order.orderId}</TableCell>
            <TableCell className="text-muted-foreground">{formatDistanceToNow(order.createdAt, {
                locale: ptBR,
                addSuffix: true
            })}</TableCell>
            <TableCell>
                <OrderStatus status={order.status} />
            </TableCell>
            <TableCell className="font-medium">{order.customerName}</TableCell>
            <TableCell className="font-medium">{(order.total / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}</TableCell>
            <TableCell>
                {order.status === 'pending' && (
                    <Button 
                            onClick={()=>{
                            approveOrderFn({orderId: order.orderId})}}
                            disabled={isApprovingOrder}
                            variant='outline'
                            size='xs'>
                            <ArrowRight className="mr-2 h-3 w-3" />
                            Aprovar
                    </Button>
                )}

                {order.status === 'processing' && (
                    <Button 
                            onClick={()=>{
                            dispatchOrderFn({orderId: order.orderId})}}
                            disabled={isDispatchingOrder}
                            variant='outline'
                            size='xs'>
                            <ArrowRight className="mr-2 h-3 w-3" />
                            Em Entrega
                    </Button>
                )}

                {order.status === 'delivering' && (
                    <Button 
                            onClick={()=>{
                            deliverOrderFn({orderId: order.orderId})}}
                            disabled={isDeliveringOrder}
                            variant='outline'
                            size='xs'>
                            <ArrowRight className="mr-2 h-3 w-3" />
                            Entregue
                    </Button>
                )}
            </TableCell>
            <TableCell>
                <Button
                    disabled={!['pending', 'processing'].includes(order.status) || isCancelingOrder}
                    onClick={() => cancelOrderFn({ orderId: order.orderId })}
                    variant='ghost'
                    size='xs'>
                    <X className="mr-2 h-3 w-3" />
                    Cancelar
                </Button>
            </TableCell>
        </TableRow>
    )
}