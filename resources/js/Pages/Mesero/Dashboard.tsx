import { usePusherChannel } from "@/hooks/usePusherChannel";
import MeseroLayout from "@/Layouts/MeseroLayout";
import { cn } from "@/lib/utils";
import { PageProps } from "@/types";
import { ITable } from "@/types/global";
import { Head, Link } from "@inertiajs/react";
import { CircleCheck, CircleX } from "lucide-react";
import { useEffect, useState } from "react";

interface Props extends PageProps {
    tables: ITable[];
}

interface TicketId {
    id: number;
}

export default function MesasPage({ tables: initialTables }: Props) {
    const [tables, setTables] = useState<ITable[]>([]);

    usePusherChannel("tables", {
        "update.table": (payload: ITable) => {
            setTables((prevTables) =>
                prevTables.map((table) =>
                    table.id === payload.id ? { ...table, ...payload } : table,
                ),
            );
        },
    });

    useEffect(() => {
        setTables(initialTables);
    }, [initialTables]);

    return (
        <MeseroLayout pageName="Mesas">
            <Head title="Mesas" />

            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold text-center">
                    Selecciona una mesa
                </h1>

                <div className="grid grid-cols-2 gap-4">
                    {tables.map((table) => {
                        const isAvailable = table.status === "disponible";

                        return (
                            <Link
                                key={table.id}
                                href={route("mesero.orders.create", {
                                    table_id: table.id,
                                })}
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
                                    {isAvailable
                                        ? "Lista para ordenar"
                                        : "En uso"}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </MeseroLayout>
    );
}
