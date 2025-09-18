import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Combo, Product } from "@/types/global";
import { formatCurrency, getComplementOptions } from "@/utils/utils";
import { useState } from "react";

interface ComboModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (combo: {
        combo_id: number;
        name: string;
        price: number;
        complements: string;
        quantity: number;
        note: string;
        comboModifiers: string[];
    }) => void;
    combo: Combo;
}

function buildComboComplements(
    selectedModifiers: Record<number, string[]>,
    includedProducts: Product[],
): string {
    return includedProducts
        .map((product) => {
            const modifiers =
                product?.id !== undefined
                    ? selectedModifiers[product.id]
                    : undefined;
            if (!modifiers || modifiers.length === 0) return null;

            return `${product.name}: ${modifiers.join(", ")}`;
        })
        .filter(Boolean)
        .join(" | ");
}

export const ComboModal = ({
    open,
    onClose,
    onAdd,
    combo,
}: ComboModalProps) => {
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");

    const [selectedModifiers, setSelectedModifiers] = useState<{
        [productId: number]: string[];
    }>({});

    const [complements, setComplements] = useState<string[]>([]);

    const includedProducts = combo.products ?? [];

    const handleConfirm = () => {
        if (combo.id === undefined) {
            return;
        }

        const productComplements = buildComboComplements(
            selectedModifiers,
            includedProducts,
        );

        onAdd({
            combo_id: combo.id,
            name: combo.name,
            price: combo.price,
            quantity,
            complements: productComplements,
            note,
            comboModifiers: complements,
        });
        onClose();
        setQuantity(1);
        setNote("");
    };
    const options = combo.modifiers ?? [];

    const toggleComplement = (opt: { id: number; name: string }) => {
        setComplements((prev) =>
            prev.includes(opt.name)
                ? prev.filter((o) => o !== opt.name)
                : [...prev, opt.name],
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{combo.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Precio unitario: {formatCurrency(combo.price)}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-semibold">
                            Cantidad
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 mt-1 border rounded"
                            value={quantity}
                            min={1}
                            onChange={(e) =>
                                setQuantity(Number(e.target.value))
                            }
                        />
                    </div>

                    {options.length > 0 && (
                        <div>
                            <label className="text-sm font-semibold">
                                Cortesías
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {options.map((opt) => (
                                    <Button
                                        key={opt.id}
                                        variant={
                                            complements.includes(opt.name)
                                                ? "secondary"
                                                : "outline"
                                        }
                                        className={
                                            !complements.includes(opt.name)
                                                ? "bg-white text-gray-900 hover:bg-gray-100"
                                                : ""
                                        }
                                        onClick={() =>
                                            toggleComplement({
                                                id: opt.id!,
                                                name: opt.name,
                                            })
                                        }
                                        size="sm"
                                    >
                                        {opt.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {includedProducts.length > 0 && (
                        <div className="space-y-4">
                            <label className="text-sm font-semibold">
                                Personalizar productos:
                            </label>

                            {includedProducts.map((product) => (
                                <ComboModifiers
                                    key={product.id}
                                    product={product}
                                    selectedModifiers={selectedModifiers}
                                    setSelectedModifiers={setSelectedModifiers}
                                />
                            ))}
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-semibold">Notas</label>
                        <textarea
                            className="w-full p-2 mt-1 border rounded"
                            rows={2}
                            placeholder="Ej. Combo sin bebida, todo bien dorado..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <Button onClick={handleConfirm} className="w-full mt-2">
                        Agregar combo
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export const ComboModifiers = ({
    product,
    selectedModifiers,
    setSelectedModifiers,
}: {
    product: Product;
    selectedModifiers: { [productId: number]: string[] };
    setSelectedModifiers: React.Dispatch<
        React.SetStateAction<{ [productId: number]: string[] }>
    >;
}) => {
    const options = getComplementOptions(product?.category, product);
    return (
        <div className="space-y-4">
            <div key={product.id} className="p-3 border rounded">
                <p className="mb-2 font-semibold">{product.name}</p>
                <ComboModifier
                    productId={product.id!}
                    modifiers={options}
                    selectedModifiers={selectedModifiers}
                    setSelectedModifiers={setSelectedModifiers}
                />
            </div>
        </div>
    );
};

export const ComboModifier = ({
    productId,
    modifiers,
    selectedModifiers,
    setSelectedModifiers,
}: {
    productId: number;
    modifiers: string[];
    selectedModifiers: { [productId: number]: string[] };
    setSelectedModifiers: React.Dispatch<
        React.SetStateAction<{ [productId: number]: string[] }>
    >;
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {modifiers.map((modifier) => {
                const isSelected =
                    selectedModifiers[productId]?.includes(modifier) ?? false;

                return (
                    <Button
                        key={modifier}
                        type="button"
                        onClick={() => {
                            setSelectedModifiers((prev) => {
                                const current = prev[productId] || [];
                                const updated = isSelected
                                    ? current.filter((m) => m !== modifier)
                                    : [...current, modifier];

                                return {
                                    ...prev,
                                    [productId]: updated,
                                };
                            });
                        }}
                        variant={isSelected ? "secondary" : "outline"}
                        className={
                            !isSelected
                                ? "bg-white text-gray-900 hover:bg-gray-100"
                                : ""
                        }
                    >
                        {modifier}
                    </Button>
                );
            })}
        </div>
    );
};
