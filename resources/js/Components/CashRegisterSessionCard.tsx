import { Card, CardContent } from '@/Components/ui/card';
import { CashRegisterSession, Payment } from '@/types/global';
import { formatCurrency } from '@/utils/utils';
import { Link } from '@inertiajs/react';

import { format, parseISO } from 'date-fns';
interface Props {
    session: CashRegisterSession;
}

const PaymentMapper = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
};

export function CashRegisterSessionCard({ session }: Props) {
    const {
        user,
        opened_at,
        closed_at,
        total_cash,
        total_card,
        total_transfer,
        payments,
    } = session;

    return (
        <Card className="shadow-md">
            <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Sesión #{session.id}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Cajero: {user?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Email: {user?.email}
                        </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                        <p>Inicio: {format(parseISO(opened_at), 'HH:mm:ss')}</p>
                        <p>
                            Cierre:{' '}
                            {closed_at
                                ? format(parseISO(closed_at), 'HH:mm:ss')
                                : '-'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="rounded-md bg-green-100 p-2 text-center">
                        <p className="text-xs text-green-800">Efectivo</p>
                        <p className="font-semibold text-green-900">
                            {formatCurrency(total_cash)}
                        </p>
                    </div>
                    <div className="rounded-md bg-blue-100 p-2 text-center">
                        <p className="text-xs text-blue-800">Tarjeta</p>
                        <p className="font-semibold text-blue-900">
                            {formatCurrency(total_card)}
                        </p>
                    </div>
                    <div className="rounded-md bg-yellow-100 p-2 text-center">
                        <p className="text-xs text-yellow-800">Transferencia</p>
                        <p className="font-semibold text-yellow-900">
                            {formatCurrency(total_transfer)}
                        </p>
                    </div>
                </div>

                <div>
                    <h3 className="mb-2 text-sm font-semibold">
                        Pagos realizados:
                    </h3>
                    <ul className="space-y-2 text-sm">
                        {payments?.map((payment: Payment) => (
                            <li
                                key={payment.id}
                                className="space-y-1 rounded border p-3 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">
                                        Orden #{payment?.order?.id} —{' '}
                                        {PaymentMapper[payment.method]}
                                    </p>
                                    <Link
                                        href={route(
                                            'admin.orders.show',
                                            payment?.order?.id,
                                        )} // Asegúrate de tener esta ruta
                                        className="text-xs font-semibold text-primary hover:underline"
                                    >
                                        Ver detalle
                                    </Link>
                                </div>
                                <p className="text-muted-foreground">
                                    Total: {formatCurrency(payment.amount)} |
                                    Recibido:{' '}
                                    {formatCurrency(payment.received_amount)} |
                                    Cambio: {formatCurrency(payment.change)}
                                </p>
                                <p className="text-xs italic text-gray-500">
                                    {payment?.order?.resume} —{' '}
                                    {payment?.order?.table?.name}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
