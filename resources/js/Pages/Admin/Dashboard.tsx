import TableViewWrapper from '@/Components/TableViewWrapper';
import { Button } from '@/Components/ui/button';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatCurrency, formatDate, OrderStatusMapper } from '@/utils/utils';

import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
interface TopProduct {
    name: string;
    total_sold: number;
}

interface RecentOrder {
    id: number;
    table?: { name: string };
    total: string;
    status: string;
    created_at: string;
}

interface Props {
    summary: {
        total_sales: string;
        orders_count: number;
        total_cash: string;
        total_card: string;
        total_transfer: string;
        active_session: {
            id: number;
            opened_at: string;
            user: { name: string };
        } | null;
    };
    topProducts: TopProduct[];
    recentOrders: RecentOrder[];
    tables: TableStatus[];
}

interface TableStatus {
    id: number;
    name: string;
    orders: { status: string }[];
    tables: TableStatus[];
}

export default function Dashboard({
    summary,
    topProducts,
    recentOrders,
    tables,
}: Props) {
    return (
        <AdminLayout pageName="Dashboard">
            <TableViewWrapper title="Panel de Administración">
                <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-6">
                    <Card
                        title="Ventas del día"
                        value={formatCurrency(summary.total_sales)}
                    />
                    <Card title="Órdenes" value={summary.orders_count} />
                    <Card
                        title="Efectivo"
                        value={formatCurrency(summary.total_cash)}
                    />
                    <Card
                        title="Tarjeta"
                        value={formatCurrency(summary.total_card)}
                    />
                    <Card
                        title="Transferencia"
                        value={formatCurrency(summary.total_transfer)}
                    />
                    <Card
                        title="Sesión activa"
                        value={
                            summary.active_session
                                ? `#${summary.active_session.id} - ${summary.active_session.user.name}`
                                : 'Ninguna'
                        }
                    />
                </div>

                {recentOrders.length > 0 && (
                    <div className="p-4">
                        <h2 className="mb-2 text-lg font-semibold">
                            🕒 Órdenes recientes
                        </h2>
                        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 text-left">
                                    <tr>
                                        <th className="px-4 py-2">Orden</th>
                                        <th className="px-4 py-2">Mesa</th>
                                        <th className="px-4 py-2">Total</th>
                                        <th className="px-4 py-2">Estado</th>
                                        <th className="px-4 py-2">Hora</th>
                                        <th className="px-4 py-2">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-t">
                                            <td className="px-4 py-2 font-medium">
                                                #{order.id}
                                            </td>
                                            <td className="px-4 py-2">
                                                {order.table?.name || '—'}
                                            </td>
                                            <td className="px-4 py-2">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="px-4 py-2 capitalize">
                                                {OrderStatusMapper[
                                                    order.status
                                                ] || order.status}
                                            </td>
                                            <td className="px-4 py-2">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-4 py-2">
                                                <Button variant="ghost" asChild>
                                                    <Link
                                                        href={route(
                                                            'admin.orders.show',
                                                            order.id,
                                                        )}
                                                        className="text-sm text-blue-600 hover:underline"
                                                    >
                                                        <ChevronRight />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="p-4">
                    <h2 className="mb-2 text-lg font-semibold">
                        🍽️ Estado de las mesas
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {tables.map((table: TableStatus) => {
                            const latestOrder = table.orders[0];
                            const status = latestOrder?.status || 'disponible';
                            let bg = 'bg-green-100 text-green-800';
                            if (status === 'pendiente')
                                bg = 'bg-yellow-100 text-yellow-800';
                            else if (status === 'en_proceso')
                                bg = 'bg-blue-100 text-blue-800';
                            else if (status === 'pagado')
                                bg = 'bg-gray-100 text-gray-700';

                            return (
                                <div
                                    key={table.id}
                                    className={`rounded-lg p-4 text-center shadow-sm ${bg}`}
                                >
                                    <p className="font-semibold">
                                        {table.name}
                                    </p>
                                    <p className="text-xs capitalize">
                                        {status}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="p-4">
                    <h2 className="mb-2 text-lg font-semibold">
                        🥇 Productos más vendidos (hoy)
                    </h2>
                    <div className="h-72 w-full rounded-lg border bg-white p-4 shadow-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total_sold" fill="#900603" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </TableViewWrapper>
        </AdminLayout>
    );
}

function Card({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h2 className="text-lg font-bold">{value}</h2>
        </div>
    );
}
