import CajeroLayout from "@/Layouts/CajaLayout";
import { ITable, Order } from "@/types/global";

import { cn } from "@/lib/utils";
import { PageProps } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { CircleCheck, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { usePusherChannel } from "@/hooks/usePusherChannel";
import { CobrarOrdenModal } from "./components/CobrarOrdenModal";
import { Button } from "@/Components/ui/button";
import { DollarSign, Eye, List, Printer } from "lucide-react";

interface Props {
    tables: ITable[];
}

export default function CajeroMesas({ tables: initialTables }: Props) {
    const [tables, setTables] = useState<ITable[]>([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    usePusherChannel("tables", {
        "update.table": (payload: ITable) => {
            router.reload();
        },
    });

    const cobrarOrden = (order: Order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    useEffect(() => {
        setTables(initialTables);
    }, [initialTables]);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-teal-700">Mesas</h1>

            <div className="grid grid-cols-2 gap-4">
                {tables.map((table) => {
                    const isAvailable = table.status === "disponible";

                    return (
                        <div
                            key={table.id}
                            className={cn(
                                "flex flex-col items-center justify-center rounded-2xl border border-transparent p-4 shadow-md transition-all duration-200",
                                isAvailable
                                    ? "bg-green-50 text-green-800 hover:border-green-400"
                                    : "bg-red-50 text-red-800 hover:border-red-400",
                            )}
                        >
                            <div className="mb-2">
                                {isAvailable ? (
                                    <CircleCheck className="w-6 h-6 text-green-600" />
                                ) : (
                                    <CircleX className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                            <p className="text-lg font-semibold">
                                {table.name}
                            </p>
                            <p className="text-sm">
                                {isAvailable ? "Lista para ordenar" : "En uso"}
                            </p>

                            {table?.currentOrder && (
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() =>
                                            cobrarOrden(table?.currentOrder!)
                                        }
                                    >
                                        <DollarSign />
                                    </Button>
                                    <div className="flex gap-1">
                                        <Button
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        "caja.orders.show",
                                                        table?.currentOrder?.id,
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
                                                    table?.currentOrder.id,
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
                                            id={`comanda-button-${table?.currentOrder.id}`}
                                        >
                                            <a
                                                href={
                                                    route(
                                                        "orders.comanda",
                                                        table?.currentOrder.id,
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
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedOrder && (
                <CobrarOrdenModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    orderId={selectedOrder?.id}
                    total={selectedOrder?.total}
                    onSuccess={() => router.reload()}
                />
            )}
        </div>
    );
}

CajeroMesas.layout = (page: React.ReactNode) => (
    <CajeroLayout pageName="Mesas">{page}</CajeroLayout>
);
