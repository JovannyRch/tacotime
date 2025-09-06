import { Button } from "@/Components/ui/button";
import CajeroLayout from "@/Layouts/CajaLayout";
import { Caja, Payment, PaymentMethod } from "@/types/global";
import { formatCurrency, PaymentMethodMapper } from "@/utils/utils";
import axios from "axios";
import { useEffect, useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Link, usePage } from "@inertiajs/react";
import { Eye } from "lucide-react";

export default function CajaActualPage() {
    const [caja, setCaja] = useState<Caja | null>(null);
    const [loading, setLoading] = useState(true);

    const { data } = usePage().props;

    const { id = null } = (data ?? {}) as { id?: number };

    useEffect(() => {
        if (id) {
            const ticketUrl = `/orders/${id}/ticket`;
            window.open(ticketUrl, "_blank");
        }
    }, [id]);

    useEffect(() => {
        loadCaja();
    }, []);

    const loadCaja = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/caja/cash-register/current");

            setCaja(res.data);
        } catch {
            setCaja(null);
        } finally {
            setLoading(false);
        }
    };

    const abrirCaja = async () => {
        await axios.post("/caja/cash-register/open");
        await loadCaja();
    };

    const cerrarCaja = async () => {
        try {
            const { data } = await axios.post("/caja/cash-register/close");

            window.open(
                route("caja.ticket", { id: data.session.id }),
                "_blank",
            );
            loadCaja();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <CajeroLayout pageName="Caja Actual">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-teal-700">
                    Caja actual
                </h1>

                {caja ? (
                    <div className="p-6 space-y-6 bg-white rounded-lg shadow-md">
                        <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2">
                            <div>
                                <p className="text-gray-400">Apertura</p>
                                <p className="font-medium text-black">
                                    {new Date(caja.created_at).toLocaleString()}
                                </p>
                            </div>
                            {caja.closed_at && (
                                <div>
                                    <p className="text-gray-400">Cierre</p>
                                    <p className="font-medium text-black">
                                        {new Date(
                                            caja.closed_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="mb-2 text-base font-semibold text-gray-800">
                                {caja.closed_at
                                    ? "Resumen del cierre"
                                    : "Totales hasta el momento"}
                            </p>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {/* Tarjeta: Efectivo */}
                                <div className="p-4 border-l-4 border-green-500 rounded bg-green-50">
                                    <p className="text-xs font-semibold text-green-600 uppercase">
                                        Efectivo
                                    </p>
                                    <p className="text-lg font-bold text-green-800">
                                        {formatCurrency(
                                            caja.closed_at
                                                ? caja.total_cash
                                                : caja.computed_totals.cash,
                                        )}
                                    </p>
                                </div>

                                {/* Tarjeta: Tarjeta */}
                                <div className="p-4 border-l-4 border-blue-500 rounded bg-blue-50">
                                    <p className="text-xs font-semibold text-blue-600 uppercase">
                                        Tarjeta
                                    </p>
                                    <p className="text-lg font-bold text-blue-800">
                                        {formatCurrency(
                                            caja.closed_at
                                                ? caja.total_card
                                                : caja.computed_totals.card,
                                        )}
                                    </p>
                                </div>

                                {/* Tarjeta: Transferencia */}
                                <div className="p-4 border-l-4 border-purple-500 rounded bg-purple-50">
                                    <p className="text-xs font-semibold text-purple-600 uppercase">
                                        Transferencia
                                    </p>
                                    <p className="text-lg font-bold text-purple-800">
                                        {formatCurrency(
                                            caja.closed_at
                                                ? caja.total_transfer
                                                : caja.computed_totals.transfer,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {!caja.closed_at && (
                            <div className="pt-4">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="mt-4">
                                            Cerrar caja
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                ¿Cerrar caja?
                                            </AlertDialogTitle>
                                            <p className="text-sm text-gray-500">
                                                Una vez cerrada la caja no
                                                podrás registrar más pagos en
                                                esta sesión.
                                            </p>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancelar
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={cerrarCaja}
                                            >
                                                Confirmar cierre
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
                ) : (
                    <Button onClick={abrirCaja}>Abrir caja</Button>
                )}

                {caja && caja?.payments?.length > 0 && (
                    <div className="mt-6">
                        <h2 className="mb-2 text-lg font-semibold text-gray-800">
                            Órdenes cobradas
                        </h2>

                        <div className="bg-white border border-gray-200 divide-y rounded">
                            {caja.payments.map((payment: Payment) => {
                                const hasDiscount =
                                    (Number(payment.discount_amount) || 0) > 0;

                                const discountTypeLabel =
                                    payment.discount_type === "PERCENT"
                                        ? `${Number(payment.discount_value ?? 0)}%`
                                        : payment.discount_type === "FIXED"
                                          ? `${formatCurrency(Number(payment.discount_value ?? 0))}`
                                          : null;

                                const originalBeforeDiscount = hasDiscount
                                    ? Number(payment.amount) +
                                      Number(payment.discount_amount)
                                    : Number(payment.amount);

                                return (
                                    <div
                                        key={payment.id}
                                        className="flex items-start justify-between px-4 py-3"
                                    >
                                        <div className="text-sm">
                                            <p className="font-medium text-gray-900">
                                                Orden #
                                                {payment.order?.id ?? "—"}
                                            </p>

                                            <p className="text-gray-500">
                                                {
                                                    PaymentMethodMapper[
                                                        payment.method as PaymentMethod
                                                    ]
                                                }
                                            </p>

                                            {/* Monto cobrado final */}
                                            <p className="mt-1 font-semibold text-gray-800 text-md">
                                                {formatCurrency(
                                                    Number(payment.amount),
                                                )}
                                            </p>

                                            {/* Si hubo descuento, mostramos el detalle */}
                                            {hasDiscount && (
                                                <div className="mt-1 space-y-0.5">
                                                    <div className="flex flex-wrap items-center text-xs text-gray-600 gap-x-2">
                                                        <span className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 font-medium text-red-700 ring-1 ring-red-200">
                                                            -
                                                            {formatCurrency(
                                                                Number(
                                                                    payment.discount_amount,
                                                                ),
                                                            )}{" "}
                                                            desc.
                                                        </span>
                                                        {discountTypeLabel && (
                                                            <span className="text-gray-500">
                                                                (
                                                                {payment.discount_type ===
                                                                "PERCENT"
                                                                    ? "Porcentaje"
                                                                    : "Monto fijo"}
                                                                :{" "}
                                                                {
                                                                    discountTypeLabel
                                                                }
                                                                )
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Muestra el "antes" de aplicar el descuento de este pago */}
                                                    <p className="text-xs text-gray-500">
                                                        Antes del descuento:{" "}
                                                        {formatCurrency(
                                                            originalBeforeDiscount,
                                                        )}
                                                    </p>

                                                    {payment.discount_reason && (
                                                        <p className="text-xs text-gray-500">
                                                            Motivo:{" "}
                                                            {
                                                                payment.discount_reason
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Si fue efectivo, mostrar recibido y cambio */}
                                            {payment.method === "cash" && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Recibido:{" "}
                                                    {formatCurrency(
                                                        Number(
                                                            payment.received_amount ??
                                                                0,
                                                        ),
                                                    )}{" "}
                                                    · Cambio:{" "}
                                                    {formatCurrency(
                                                        Number(
                                                            payment.change ?? 0,
                                                        ),
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    "caja.orders.show",
                                                    payment.order_id,
                                                )}
                                            >
                                                <Eye />
                                            </Link>
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </CajeroLayout>
    );
}
