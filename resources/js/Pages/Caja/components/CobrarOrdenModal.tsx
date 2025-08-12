import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { DiscountType, PaymentMethod } from "@/types/global";
import { formatCurrency } from "@/utils/utils";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    orderId: number;
    total: number;
    onSuccess: () => void;
}

interface ErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export const CobrarOrdenModal = ({
    open,
    onClose,
    orderId,
    total,
    onSuccess,
}: Props) => {
    const [method, setMethod] = useState<PaymentMethod>("cash");
    const [received, setReceived] = useState<string>("");
    const [change, setChange] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState<string>("");

    const ADMIN_PASSWORD = "TACOTIME5150descuento$$";

    const [discountType, setDiscountType] = useState<DiscountType>("");
    const [discountValue, setDiscountValue] = useState<string>(""); // % o $
    const [reason, setReason] = useState<string>("");

    const parsedDiscountValue = Number(discountValue || 0);

    const discountAmount = useMemo(() => {
        if (!discountType) return 0;
        if (discountType === "PERCENT") {
            const pct = Math.max(0, Math.min(parsedDiscountValue, 100)); // clamp 0..100
            return +((total * pct) / 100).toFixed(2);
        } else {
            // FIXED
            return +Math.min(parsedDiscountValue, total).toFixed(2);
        }
    }, [discountType, parsedDiscountValue, total]);

    const payable = useMemo(() => {
        return +Math.max(total - discountAmount, 0).toFixed(2);
    }, [total, discountAmount]);

    useEffect(() => {
        if (method === "cash") {
            const c = Number(received || 0) - payable;
            setChange(c > 0 ? +c.toFixed(2) : 0);
        } else {
            setChange(0);
            setReceived(payable.toString());
        }
    }, [received, method, payable]);

    const handleSubmit = async () => {
        setError(null);

        if (method === "cash" && Number(received) < payable) {
            setError("El monto recibido es menor al total a pagar");
            return;
        }

        if (discountType && parsedDiscountValue > 0) {
            if (password !== ADMIN_PASSWORD) {
                setError("Contraseña de administrador incorrecta");
                return;
            }
        }

        try {
            await axios.post(route("caja.payments.store"), {
                order_id: orderId,
                method,
                amount: payable,
                received_amount: method === "cash" ? received : null,
                discount_type: discountType || null,
                discount_value: discountType ? parsedDiscountValue : null,
                discount_amount: discountType ? discountAmount : 0,
                discount_reason: discountType ? reason || null : null,
            });

            onSuccess();
            onClose();
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            setError(
                error.response?.data?.message || "Error al procesar el pago",
            );
        }
    };

    useEffect(() => {
        if (open) {
            setMethod("cash");
            setReceived("");
            setPassword("");
            setError(null);
            setDiscountType("");
            setDiscountValue("");
            setReason("");
            setPassword("");
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cobrar orden #{orderId}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Total a pagar</Label>
                        <p className="text-lg font-bold">
                            {formatCurrency(payable)}
                        </p>
                    </div>

                    <div>
                        <Label>Método de pago</Label>
                        <div className="flex gap-2 mt-1">
                            {["cash", "card", "transfer"].map((opt) => (
                                <Button
                                    key={opt}
                                    variant={
                                        method === opt ? "default" : "secondary"
                                    }
                                    onClick={() =>
                                        setMethod(opt as PaymentMethod)
                                    }
                                >
                                    {opt === "cash"
                                        ? "Efectivo"
                                        : opt === "card"
                                          ? "Tarjeta"
                                          : opt === "transfer"
                                            ? "Transferencia"
                                            : ""}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Descuento */}
                    <div className="space-y-2">
                        <Label>Aplicar descuento</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <select
                                className="col-span-1 p-2 text-sm bg-white border rounded-md"
                                value={discountType}
                                onChange={(e) =>
                                    setDiscountType(
                                        e.target.value as DiscountType,
                                    )
                                }
                            >
                                <option value="">Sin descuento</option>
                                <option value="PERCENT">% Porcentaje</option>
                                <option value="FIXED">$ Monto fijo</option>
                            </select>

                            <Input
                                className="col-span-1 bg-white"
                                placeholder={
                                    discountType === "PERCENT"
                                        ? "0–100"
                                        : "0.00"
                                }
                                type="number"
                                min={0}
                                max={
                                    discountType === "PERCENT" ? 100 : undefined
                                }
                                step="0.01"
                                value={discountValue}
                                onChange={(e) =>
                                    setDiscountValue(e.target.value)
                                }
                                disabled={!discountType}
                            />

                            <Input
                                className="col-span-1 bg-white"
                                placeholder="Motivo (opcional)"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                disabled={!discountType}
                            />
                        </div>

                        {/* Autorización solo si hay descuento */}
                        {!!discountType && (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                    <Label>Contraseña administrador</Label>
                                    <Input
                                        className="bg-white"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="••••••••"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Requerida para aplicar descuento.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {method === "cash" && (
                        <div>
                            <Label>Monto recibido</Label>
                            <Input
                                type="number"
                                value={received}
                                onChange={(e) => setReceived(e.target.value)}
                                min={0}
                                className="bg-white"
                            />
                            <p className="text-sm text-muted-foreground">
                                Cambio: {formatCurrency(change)}
                            </p>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button className="w-full" onClick={handleSubmit}>
                        Confirmar pago
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
