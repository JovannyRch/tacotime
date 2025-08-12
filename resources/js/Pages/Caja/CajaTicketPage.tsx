import { Caja, Payment } from '@/types/global';
import { formatCurrency, getTableNameOrDefault } from '@/utils/utils';
import { useEffect } from 'react';

interface Props {
    session: Caja;
}

export default function CajaTicketPage({ session }: Props) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="mx-auto max-w-xs p-4 font-mono text-sm print:text-xs">
            <h1 className="mb-2 text-center text-lg font-bold">Taco Time 🌮</h1>
            <p>Caja ID: {session.id}</p>
            <p>Apertura: {new Date(session.opened_at).toLocaleString()}</p>
            <p>Cierre: {new Date(session.closed_at!).toLocaleString()}</p>
            <hr className="my-2" />

            <p className="mb-1 font-bold uppercase">Órdenes cobradas:</p>
            {session?.payments?.map((p: Payment) => {
                const amount = Number(p.amount || 0);
                const discount = Number(p.discount_amount || 0);
                const hasDiscount = discount > 0;
                const originalBeforeDiscount = hasDiscount
                    ? amount + discount
                    : amount;

                const discountTypeLabel =
                    p.discount_type === 'PERCENT'
                        ? `${Number(p.discount_value ?? 0)}%`
                        : p.discount_type === 'FIXED'
                          ? `${formatCurrency(Number(p.discount_value ?? 0))}`
                          : null;

                return (
                    <div className="mb-2 flex flex-col gap-2" key={p.id}>
                        <div className="flex justify-between font-semibold">
                            <span>
                                {`Orden #${p.order?.id ?? '—'} ${p?.order ? getTableNameOrDefault(p.order) : ''}`}
                            </span>
                            <span>{formatCurrency(amount)}</span>
                        </div>

                        {hasDiscount && (
                            <div className="flex items-start justify-between text-xs text-gray-600">
                                <div className="flex flex-wrap items-center gap-x-2">
                                    <span className="text-grey-700 ring-grey-200 inline-flex items-center rounded px-1.5 py-0.5 font-medium ring-1">
                                        -{formatCurrency(discount)} desc.
                                    </span>
                                    {discountTypeLabel && (
                                        <span>
                                            (
                                            {p.discount_type === 'PERCENT'
                                                ? 'Porcentaje'
                                                : 'Monto fijo'}
                                            : {discountTypeLabel})
                                        </span>
                                    )}
                                    {p.discount_reason && (
                                        <span>
                                            · Motivo: {p.discount_reason}
                                        </span>
                                    )}
                                </div>
                                <span className="ml-2">
                                    Antes:{' '}
                                    {formatCurrency(originalBeforeDiscount)}
                                </span>
                            </div>
                        )}

                        {p.method === 'cash' && (
                            <div className="text-xs text-gray-500">
                                Recibido:{' '}
                                {formatCurrency(Number(p.received_amount ?? 0))}{' '}
                                · Cambio:{' '}
                                {formatCurrency(Number(p.change ?? 0))}
                            </div>
                        )}

                        <div className="text-sm text-gray-700">
                            {p.order?.resume}
                        </div>
                        <div className="h-px w-full bg-gray-200" />
                    </div>
                );
            })}

            <hr className="my-2" />
            <div className="mt-2 flex justify-between font-bold">
                <span>Total ordenes: </span>
                <span>{session?.payments?.length ?? 0}</span>
            </div>
            <hr className="my-2" />

            <p className="font-semibold">Totales:</p>
            <ul className="ml-4 space-y-1">
                <li>Efectivo: {formatCurrency(session.total_cash)}</li>
                <li>Tarjeta: {formatCurrency(session.total_card)}</li>
                <li>Transferencia: {formatCurrency(session.total_transfer)}</li>
                <li>
                    <b>
                        Total caja:{' '}
                        {formatCurrency(
                            session.total_cash +
                                session.total_card +
                                session.total_transfer,
                        )}
                    </b>
                </li>
            </ul>

            <hr className="my-2" />
        </div>
    );
}
