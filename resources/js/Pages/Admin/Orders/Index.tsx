import TableViewWrapper from '@/Components/TableViewWrapper';
import Table from '@/Components/ui/table-wrapper';
import AdminLayout from '@/Layouts/AdminLayout';
import { Order, OrderStatus, PaginatedResponse } from '@/types/global';
import { formatCurrency, formatDate, OrderStatusMapper } from '@/utils/utils';
import { router } from '@inertiajs/react';

type Props = {
    meta: PaginatedResponse<Order>;
};

const statusStyles: Record<OrderStatus, string> = {
    pagado: 'bg-emerald-100 text-emerald-700',
    pendiente: 'bg-amber-100 text-amber-800',
    cancelado: 'bg-rose-100 text-rose-700',
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const cls = statusStyles[status] ?? 'bg-muted text-foreground';
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-center text-xs font-medium ${cls}`}
        >
            {['pagado', 'pendiente'].includes(status) && (
                <span
                    className={[
                        'h-1.5 w-1.5 rounded-full',
                        status === 'pendiente'
                            ? 'bg-amber-600'
                            : 'bg-emerald-600',
                    ].join(' ')}
                />
            )}
            {OrderStatusMapper?.[status] ?? status}
        </span>
    );
};

const ServiceCell = ({ order }: { order: Order }) => {
    const isDelivery = !!order.is_delivery;
    return (
        <div className="inline-flex items-center gap-2">
            <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    isDelivery
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-700'
                }`}
            >
                {isDelivery ? 'Domicilio' : (order.table?.name ?? 'Sin mesa')}
            </span>
        </div>
    );
};

const MetaCell = ({ order }: { order: Order }) => (
    <div className="flex flex-col">
        <div className="flex items-center gap-2">
            <span className="font-medium">#{order.id}</span>
            <span className="text-xs text-muted-foreground">
                {formatDate(order.created_at!)}
            </span>
        </div>
        <div className="text-sm text-muted-foreground">
            {order.user?.name ?? '—'}
        </div>
    </div>
);

const TotalCell = ({ order }: { order: Order }) => (
    <div className="text-right font-semibold tabular-nums">
        {formatCurrency(order.total)}
    </div>
);

import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const RowActions = ({ order }: { order: Order }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
                onClick={() =>
                    router.visit(route('admin.orders.show', order.id))
                }
            >
                Ver detalle
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => {
                    const url = route('orders.comanda', order.id);

                    window.open(url, '_blank');
                }}
            >
                Imprimir comanda
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => {
                    const url = route('orders.ticket', order.id);
                    window.open(url, '_blank');
                }}
            >
                Imprimir ticket
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

export default function OrderIndex({ meta }: Props) {
    return (
        <AdminLayout pageName="Órdenes">
            <TableViewWrapper title="Órdenes">
                <Table
                    columns={[
                        {
                            key: 'meta',
                            title: 'Orden',
                            render: (o: Order) => <MetaCell order={o} />,
                        },
                        {
                            key: 'service',
                            title: 'Servicio',
                            render: (o: Order) => <ServiceCell order={o} />,
                        },
                        {
                            key: 'status',
                            title: 'Estado',
                            render: (o: Order) => (
                                <StatusBadge status={o.status as OrderStatus} />
                            ),
                        },
                        {
                            key: 'total',
                            title: 'Total',
                            align: 'right', // si tu <Table> lo soporta
                            render: (o: Order) => <TotalCell order={o} />,
                        },
                        {
                            key: 'actions',
                            title: '',
                            render: (o: Order) => (
                                <div className="flex justify-end">
                                    <RowActions order={o} />
                                </div>
                            ),
                        },
                    ]}
                    dataSource={meta.data}
                    pagination={meta}
                />
            </TableViewWrapper>
        </AdminLayout>
    );
}
