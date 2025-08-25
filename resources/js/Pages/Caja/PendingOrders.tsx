import { Button } from "@/Components/ui/button";
import CajeroLayout from "@/Layouts/CajaLayout";
import { PageProps } from "@/types";
import { Order } from "@/types/global";
import { formatCurrency, getTableNameOrDefault } from "@/utils/utils";
import { router } from "@inertiajs/react";
import { DollarSign, Eye, List, Printer, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { CobrarOrdenModal } from "./components/CobrarOrdenModal";
import { echo } from "@/echo";

interface Props extends PageProps {
    orders: Order[];
}

export default function OrdenesPendientesPage({ orders }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const cobrarOrden = (order: Order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const reloadPage = () => {
        router.reload();
    };

    useEffect(() => {
        const channel = echo.channel("orders"); // o echo.private('cashier')

        const handler = (payload: any) => {
            console.log("Nueva orden", payload);
        };

        channel.listen("order.created", handler);

        return () => {
            channel.stopListening(".order.created", handler);
            echo.leaveChannel("orders");
        };
    }, []);

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
                            className="flex items-center justify-between p-4 bg-white rounded shadow"
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
                                        onClick={() => cobrarOrden(order)}
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
                                    >
                                        <a
                                            href={route(
                                                "orders.comanda",
                                                order.id,
                                            )}
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
