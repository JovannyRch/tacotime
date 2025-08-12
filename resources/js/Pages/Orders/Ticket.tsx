import { Order, PaymentMethod } from '@/types/global';
import { formatCurrency, getTableNameOrDefault } from '@/utils/utils';
import { useEffect } from 'react';

interface Props {
    order: Order;
}

export default function Ticket({ order }: Props) {
    const payment = order?.payment;
    useEffect(() => {
        window.print();
    }, []);

    const getPaymentMethod = (method: PaymentMethod) => {
        switch (method) {
            case 'cash':
                return 'Efectivo';
            case 'card':
                return 'Tarjeta';
            case 'transfer':
                return 'Transferencia';
            default:
                return 'Desconocido';
        }
    };

    const getChange = () => {
        if (payment?.method === 'cash' && payment.change !== null) {
            return (
                <>
                    <div className="flex justify-between">
                        <span>Recibido:</span>
                        <span>{formatCurrency(payment.received_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cambio:</span>
                        <span>{formatCurrency(payment.change)}</span>
                    </div>
                </>
            );
        }
        return null;
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
        <div className="bg-white">
            <div className="w-[58mm] bg-white p-2 font-mono text-xs leading-snug print:w-full">
                <div className="mb-2 text-center">
                    <h1 className="text-sm font-bold uppercase">Taco Time</h1>
                    <p className="text-xs">{getTableNameOrDefault(order)}</p>
                    <p className="text-xs">Orden #{order.id}</p>
                    <p className="mb-1 text-xs">Atiende: {order.user.name}</p>
                    <div className="my-1 border-t border-dashed" />
                </div>

                {(order.products.length > 0 || order.combos.length > 0) && (
                    <>
                        <div className="mb-1 font-semibold">Detalle:</div>
                        {[...order.products, ...order.combos].map((item) => (
                            <div key={item.id} className="mb-1">
                                <div className="font-bold">
                                    {item.pivot.quantity} × {item.name}
                                </div>
                                {/*   {item.pivot.complements && (
                                    <div className="text-xs">
                                        {item.pivot.complements}
                                    </div>
                                )}
 */}
                                {/*     {item.pivot.notes && (
                                    <div className="text-xs">
                                        Notas: {item.pivot.notes}
                                    </div>
                                )} */}
                                <div className="flex justify-between text-xs">
                                    <span>
                                        {formatCurrency(item.pivot.unit_price)}
                                    </span>
                                    <span>
                                        Subtotal:
                                        {formatCurrency(
                                            Number(item.pivot.quantity) *
                                                Number(item.pivot.unit_price),
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                <div className="my-2 border-t border-dashed" />

                <div className="mt-1 flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span>
                        {formatCurrency(
                            Number(payment?.amount ?? order?.total),
                        )}
                    </span>
                </div>
                {hasDiscount && (
                    <div className="mt-1 flex justify-between text-sm font-bold">
                        <span>Descuento</span>
                        <span>
                            {formatCurrency(
                                Number(payment?.discount_amount ?? 0),
                            )}
                        </span>
                    </div>
                )}
                <div className="my-2 border-t border-dashed" />

                {payment && (
                    <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Método de pago:</span>
                            <span>{getPaymentMethod(payment.method)}</span>
                        </div>
                        {getChange()}
                    </div>
                )}

                <div className="mt-2 text-center">
                    <p>¡Gracias por tu compra!</p>
                    <p>Taco Time 🌮</p>
                </div>
            </div>
        </div>
    );
}
