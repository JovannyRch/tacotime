// Comanda.tsx
import { Order } from "@/types/global";
import { format } from "date-fns";
import {
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactNode,
    ReactPortal,
    useEffect,
} from "react";

export default function Comanda({
    order,
    getTableNameOrDefault,
    businessName = "Taco Time",
}: {
    order: Order;
    getTableNameOrDefault: (o: Order) => string;
    businessName?: string;
}) {
    const urlParams = new URLSearchParams(window.location.search);
    const items = [
        ...(order.products || []).slice(
            Number(urlParams.get("lastProductIndex") || 0),
        ),
        ...(order.combos || []).slice(
            Number(urlParams.get("lastComboIndex") || 0),
        ),
    ];

    const hora = order.created_at
        ? format(new Date(order.created_at), "HH:mm")
        : format(new Date(), "HH:mm");

    const place = order?.is_delivery
        ? "Para llevar"
        : (order.table?.name ?? getTableNameOrDefault(order));

    const renderProductsOfCombo = (orderItem: {
        id?: number;
        name?: string;
        pivot?: {
            quantity: number;
            unit_price: number;
            complements?: string;
            notes?: string;
        };
        products?: any;
    }) => {
        if (orderItem.products && orderItem.products.length > 0) {
            return (
                <div className="mt-1 ml-2">
                    {orderItem.products.map(
                        (p: {
                            id: Key | null | undefined;
                            pivot: {
                                quantity:
                                    | string
                                    | number
                                    | boolean
                                    | ReactElement<
                                          any,
                                          string | JSXElementConstructor<any>
                                      >
                                    | Iterable<ReactNode>
                                    | ReactPortal
                                    | null
                                    | undefined;
                                notes: any;
                            };
                            name:
                                | string
                                | number
                                | boolean
                                | ReactElement<
                                      any,
                                      string | JSXElementConstructor<any>
                                  >
                                | Iterable<ReactNode>
                                | ReactPortal
                                | null
                                | undefined;
                        }) => (
                            <div
                                key={p.id}
                                className="whitespace-pre-wrap text-[10px] leading-4"
                            >
                                - {p.pivot.quantity} x {p.name}{" "}
                                {p.pivot?.notes ? `(${p.pivot.notes})` : ""}
                            </div>
                        ),
                    )}
                </div>
            );
        }
        return null;
    };

    const renderComplements = (c?: string | string[]) => {
        if (!c || (Array.isArray(c) && c.length === 0)) return null;
        const text = Array.isArray(c) ? c.join(", ") : c;
        return (
            <div className="whitespace-pre-wrap text-[10px] leading-4">
                • {text}
            </div>
        );
    };

    const renderNotes = (n?: string | null) =>
        n ? (
            <div className="whitespace-pre-wrap text-[10px] leading-4">
                Notas: {n}
            </div>
        ) : null;

    useEffect(() => {
        if (urlParams.get("auto_print") === "1") {
            window.print();
            setTimeout(() => {
                window.close();
            }, 500);
        }
    }, []);

    return (
        <div className="w-[280px] max-w-full text-xs print:w-[280px]">
            {/* Encabezado */}
            <div className="mb-2 text-center">
                <h1 className="text-sm font-extrabold tracking-wide uppercase">
                    {businessName}
                </h1>
                <p className="text-[11px]">{place}</p>
                <p className="text-[11px]">
                    Orden #{order.id} · {hora}
                </p>
                {order?.user?.name && (
                    <p className="mb-1 text-[11px]">
                        Atiende: {order.user.name}
                    </p>
                )}
                <div className="my-1 border-t border-dashed" />
                <div className="mb-1 text-[11px] font-bold uppercase tracking-wide">
                    Comanda
                </div>
            </div>

            {/* Detalle */}
            {items.length > 0 && (
                <div>
                    {items.map((item) => (
                        <div key={item.id} className="mb-2">
                            <div className="flex items-start gap-2">
                                <div className="text-base font-extrabold min-w-8 tabular-nums">
                                    {Number(item.pivot.quantity)}×
                                </div>
                                <div className="flex-1">
                                    <div className="font-extrabold leading-5 uppercase">
                                        {item.name}
                                    </div>
                                    {renderProductsOfCombo(item)}
                                    {renderComplements(item.pivot.complements)}
                                    {renderNotes(item.pivot.notes)}
                                </div>
                            </div>
                            <div className="mt-2 border-b border-dashed" />
                        </div>
                    ))}
                </div>
            )}

            {/* Estilos de impresión */}
            <style>
                {`
        @media print {
          @page { margin: 6mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        `}
            </style>
        </div>
    );
}
