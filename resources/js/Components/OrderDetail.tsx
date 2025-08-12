import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { CobrarOrdenModal } from '@/Pages/Caja/components/CobrarOrdenModal';
import { Order } from '@/types/global';
import {
    formatCurrency,
    formatDate,
    getTableNameOrDefault,
    PaymentMethodMapper,
} from '@/utils/utils';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface OrderDetailProps {
    order: Order;
}

const OrderDetail = ({ order }: OrderDetailProps) => {
    const user = usePage().props.auth.user;

    const payment = order?.payment;

    const [modalOpen, setModalOpen] = useState(false);

    const { data, setData, put, processing } = useForm({
        status: order.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/orders/${order.id}/status`);
    };

    const isAdmin = user.role === 'admin';

    const reloadPage = () => {
        router.reload();
    };

    const hasDiscount = (Number(payment?.discount_amount) || 0) > 0;

    const discountTypeLabel =
        payment?.discount_type === 'PERCENT'
            ? `${Number(payment?.discount_value ?? 0)}%`
            : payment?.discount_type === 'FIXED'
              ? `${formatCurrency(Number(payment?.discount_value ?? 0))}`
              : null;

    const originalBeforeDiscount = hasDiscount
        ? Number(payment?.amount) + Number(payment?.discount_amount)
        : Number(payment?.amount);

    return (
        <div className="mx-auto max-w-3xl space-y-6 p-6">
            <Head title={`Orden #${order.id}`} />
            {isAdmin && (
                <Button variant="ghost" className="mb-4" asChild>
                    <Link href={route('admin.orders.index')}>
                        <ChevronLeft />
                        Volver a la lista
                    </Link>
                </Button>
            )}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Orden #{order.id}</h1>
            </div>

            <div className="flex items-center justify-between">
                <Button asChild variant="secondary">
                    <a
                        href={`/orders/${order.id}/ticket`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Imprimir Ticket
                    </a>
                </Button>

                <Button
                    onClick={() => setModalOpen(true)}
                    disabled={order.status === 'pagado'}
                >
                    Cobrar
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>{getTableNameOrDefault(order)}</div>
                    <div>
                        <strong>Usuario:</strong> {order.user.name}
                    </div>
                    <div>
                        <strong>Total:</strong>{' '}
                        <span className="font-semibold text-green-700">
                            {formatCurrency(payment?.amount ?? order?.total)}
                        </span>
                    </div>
                    <div>
                        {hasDiscount && (
                            <div className="mt-1 space-y-0.5">
                                <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-600">
                                    <span className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 font-medium text-red-700 ring-1 ring-red-200">
                                        -
                                        {formatCurrency(
                                            Number(payment?.discount_amount),
                                        )}{' '}
                                        desc.
                                    </span>
                                    {discountTypeLabel && (
                                        <span className="text-gray-500">
                                            (
                                            {payment?.discount_type ===
                                            'PERCENT'
                                                ? 'Porcentaje'
                                                : 'Monto fijo'}
                                            : {discountTypeLabel})
                                        </span>
                                    )}
                                </div>

                                {/* Muestra el "antes" de aplicar el descuento de este pago */}
                                <p className="text-xs text-gray-500">
                                    Antes del descuento:{' '}
                                    {formatCurrency(originalBeforeDiscount)}
                                </p>

                                {payment?.discount_reason && (
                                    <p className="text-xs text-gray-500">
                                        Motivo: {payment.discount_reason}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <form
                        onSubmit={submit}
                        className="mt-4 flex items-center gap-4"
                    >
                        <Label>Estado:</Label>
                        <Select
                            value={data.status}
                            onValueChange={(val) => setData('status', val)}
                            disabled={!isAdmin}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Selecciona estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pendiente">
                                    En proceso
                                </SelectItem>

                                <SelectItem value="pagado">Pagado</SelectItem>
                            </SelectContent>
                        </Select>
                        {isAdmin && (
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Actualizando...'
                                    : 'Actualizar Estado'}
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Productos</CardTitle>
                </CardHeader>
                <CardContent>
                    {order.products.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No hay productos.
                        </p>
                    ) : (
                        <ul className="ml-5 list-disc text-sm">
                            {order.products.map((p) => (
                                <li key={p.id}>
                                    {p.name} × {p.pivot.quantity} ·{' '}
                                    {formatCurrency(p.pivot?.unit_price)}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Combos</CardTitle>
                </CardHeader>
                <CardContent>
                    {order.combos.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No hay combos.
                        </p>
                    ) : (
                        <ul className="ml-5 list-disc text-sm">
                            {order.combos.map((c) => (
                                <li key={c.id}>
                                    {c.name} × {c.pivot.quantity} ·{' '}
                                    {formatCurrency(c.pivot.unit_price)}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            {order.status === 'pagado' && order.payment && (
                <>
                    <Separator />

                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Pago</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p>
                                <span className="font-medium">Método:</span>{' '}
                                {PaymentMethodMapper[order.payment.method]}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Monto pagado:
                                </span>{' '}
                                {formatCurrency(order.payment.amount)}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Fecha de pago:
                                </span>{' '}
                                {formatDate(order.payment.created_at)}
                            </p>
                            {/* Agrega más campos si lo deseas, como ID de transacción */}
                        </CardContent>
                    </Card>
                </>
            )}

            <CobrarOrdenModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                orderId={order?.id}
                total={order?.total}
                onSuccess={reloadPage}
            />
        </div>
    );
};

export default OrderDetail;
