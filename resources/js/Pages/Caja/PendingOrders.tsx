import { Button } from "@/Components/ui/button";
import CajeroLayout from "@/Layouts/CajaLayout";
import { PageProps } from "@/types";
import { Order } from "@/types/global";
import { formatCurrency, getTableNameOrDefault } from "@/utils/utils";
import { router } from "@inertiajs/react";
import { DollarSign, Eye, List, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { CobrarOrdenModal } from "./components/CobrarOrdenModal";
import { useRecentHighlights } from "@/hooks/useRecentHighlights";
import { useOrderCreated } from "@/hooks/useOrderCreated";

interface Props extends PageProps {
    orders: Order[];
}

export default function OrdenesPendientesPage({
    orders: initialOrders,
}: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [orders, setOrders] = useState<Order[]>([]);

    const { isRecent, markRecent } = useRecentHighlights(6000);

    const cobrarOrden = (order: Order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const reloadPage = () => {
        router.reload();
    };

    useOrderCreated({
        handleNewOrder: (newOrder) => {
            setOrders((prev) =>
                prev.some((o) => o.id === newOrder.id)
                    ? prev.map((o) => (o.id === newOrder.id ? newOrder : o))
                    : [newOrder, ...prev],
            );
            markRecent(newOrder.id);
        },
    });

    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-teal-700">
                Órdenes pendientes
            </h1>

            {orders.length === 0 ? (
                <p>No hay órdenes pendientes por cobrar.</p>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className={`flex items-center justify-between p-4 rounded shadow ${isRecent(order.id) ? "bg-yellow-50 ring-2 ring-yellow-300 shadow-yellow-200 scale-[1.01]" : "bg-white "}`}
                        >
                            <div>
                                <p className="font-semibold">
                                    Orden #{order.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {getTableNameOrDefault(order)}
                                </p>
                                <p className="text-sm font-bold">
                                    Total: {formatCurrency(order.total)}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button onClick={() => cobrarOrden(order)}>
                                    <DollarSign />
                                </Button>
                                <div className="flex gap-1">
                                    <Button
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "caja.orders.show",
                                                    order.id,
                                                ),
                                            )
                                        }
                                        variant="secondary"
                                        size="icon"
                                    >
                                        <Eye />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        asChild
                                        size="icon"
                                    >
                                        <a
                                            href={route(
                                                "orders.ticket",
                                                order.id,
                                            )}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <Printer />
                                        </a>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        asChild
                                        size="icon"
                                        id={`comanda-button-${order.id}`}
                                    >
                                        <a
                                            href={
                                                route(
                                                    "orders.comanda",
                                                    order.id,
                                                ) + "?auto_print=1"
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <List />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedOrder && (
                <CobrarOrdenModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    orderId={selectedOrder?.id}
                    total={selectedOrder?.total}
                    onSuccess={reloadPage}
                />
            )}
        </div>
    );
}

OrdenesPendientesPage.layout = (page: React.ReactNode) => (
    <CajeroLayout pageName="Órdenes Pendientes">{page}</CajeroLayout>
);
