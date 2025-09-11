import { Button } from "@/Components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/Components/ui/sheet";
import {
    CategoryWithProducts,
    Combo,
    EditableOrderProduct,
    ITable,
    Product,
} from "@/types/global";
import { formatCurrency } from "@/utils/utils";
import { router } from "@inertiajs/react";
import { Pen, Trash } from "lucide-react";
import { useState } from "react";
import { ComboModal } from "./ComboModal";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";

interface OrderItem {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    complements: string[];
    note: string;
}

type OrderCombo = {
    combo_id: number;
    name: string;
    price: number;
    quantity: number;
    items?: {
        product_id: number;
        name: string;
        complements: string[];
        note: string;
    }[];
    note?: string;
    complements?: string;
};

interface Props {
    table: ITable;
    categories: CategoryWithProducts[];
    combos: Combo[];
    isDelivery?: boolean;
}

const combosCategory = {
    id: 0,
    name: "COMBOS",
    products: [] as Product[],
};

export const CreateOrder = ({
    table,
    categories = [combosCategory],
    combos,
    isDelivery = false,
}: Props) => {
    const [activeCategory, setActiveCategory] = useState<CategoryWithProducts>(
        categories[0],
    );
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [openSheet, setOpenSheet] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
    const [orderCombos, setOrderCombos] = useState<OrderCombo[]>([]);

    const handleAddCombo = (comboData: OrderCombo) => {
        setOrderCombos((prev) => [...prev, comboData]);
    };

    const [selectedProduct, setSelectedProduct] =
        useState<EditableOrderProduct | null>(null);

    const handleAdd = ({
        product,
        quantity,
        complements,
        note,
    }: {
        product: Product;
        quantity: number;
        complements: string[];
        note: string;
    }) => {
        const newItem = {
            product_id: product.id ?? 0,
            name: product.name ?? "",
            price: product.price ?? 0,
            quantity,
            complements,
            note,
        };

        setOrderItems((prev) => {
            if (editIndex !== null) {
                const copy = [...prev];
                copy[editIndex] = newItem;
                setEditIndex(null);
                return copy;
            }
            return [...prev, newItem];
        });
    };

    const handleDeleteItem = (index: number) => {
        setOrderItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDeleteCombo = (index: number) => {
        setOrderCombos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCreateOrder = () => {
        if (orderItems.length === 0 && orderCombos.length === 0) {
            alert("Por favor, agrega al menos un producto a la orden.");
            return;
        }
        setOpenSheet(false);
        const data = {
            table_id: table?.id ?? null,
            products: orderItems.map((item) => ({
                id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                complements:
                    item.complements.length > 0
                        ? item.complements.join(", ")
                        : null,
                notes: item.note || null,
            })),
            combos: orderCombos.map((combo) => ({
                id: combo.combo_id,
                quantity: combo.quantity,
                price: combo.price,
                notes: combo.note || null,
                complements: combo.complements || null,
            })),
            is_delivery: isDelivery,
        };
        router.visit("/orders", {
            method: "post",
            data,
        });
    };

    const handleEditItem = (index: number) => {
        setOpenSheet(false);
        const item = orderItems[index];
        const products = activeCategory?.products ?? [];
        const product = products.find((p) => p.id === item.product_id);
        if (product) {
            setSelectedProduct({
                ...product,
                _editData: {
                    quantity: item.quantity,
                    complements: item.complements,
                    note: item.note,
                },
            });
            setEditIndex(index);
        }
    };

    return (
        <>
            <div className="p-3 pb-20">
                <div className="flex justify-start mb-4">
                    <Button
                        variant="secondary"
                        onClick={() => window.history.back()}
                    >
                        ← Regresar
                    </Button>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-lg font-bold">
                        {isDelivery
                            ? "Servicio a domicilio"
                            : "Mesa " + (table?.name ?? "")}
                    </h1>
                    <Button
                        onClick={() => setOpenSheet(true)}
                        disabled={
                            orderItems.length === 0 && orderCombos.length === 0
                        }
                    >
                        🧾 Ver orden
                    </Button>
                </div>

                <div className="flex gap-2 mb-4 overflow-x-auto">
                    {[
                        ...(Array.isArray(categories) ? categories : []),
                        combosCategory,
                    ]?.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={
                                cat.id === activeCategory.id
                                    ? "default"
                                    : "secondary"
                            }
                            onClick={() => setActiveCategory(cat)}
                            className="whitespace-nowrap"
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {activeCategory.id !== 0 &&
                        activeCategory?.products?.map((p) => (
                            <ProductCard
                                key={p.id}
                                name={p.name ?? ""}
                                price={p.price ?? 0}
                                onClick={() => setSelectedProduct(p)}
                                showAdd
                            />
                        ))}

                    {activeCategory.id === 0 &&
                        combos.map((combo) => (
                            <ProductCard
                                key={combo.id}
                                name={combo.name}
                                price={combo.price}
                                onClick={() => setSelectedCombo(combo)}
                            />
                        ))}
                </div>

                <ProductModal
                    open={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAdd={handleAdd}
                    product={{
                        ...selectedProduct,
                        category: activeCategory,
                    }}
                />

                {selectedCombo && (
                    <ComboModal
                        open={!!selectedCombo}
                        onClose={() => setSelectedCombo(null)}
                        onAdd={handleAddCombo}
                        combo={selectedCombo}
                    />
                )}

                {/* Sheet para ver resumen */}
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Resumen de orden</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4 space-y-3 max-h-[75vh] overflow-y-auto">
                            {orderItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start justify-between p-2 py-2 bg-white border-b rounded-sm"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            <small className="text-gray-400">
                                                #{index + 1}
                                            </small>
                                            {" - "}
                                            {item.quantity} x {item.name}
                                        </p>
                                        {item.complements?.length > 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                {item.complements.join(", ")}
                                            </p>
                                        )}
                                        {item.note && (
                                            <p className="text-sm italic text-muted-foreground">
                                                "{item.note}"
                                            </p>
                                        )}
                                        <p className="mt-1 text-sm font-bold">
                                            {formatCurrency(
                                                item.price * item.quantity,
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-1 ml-3">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() =>
                                                handleEditItem(index)
                                            }
                                        >
                                            <Pen />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() =>
                                                handleDeleteItem(index)
                                            }
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {orderCombos.map((combo, i) => (
                                <div
                                    key={`combo-${i}`}
                                    className="flex gap-2 p-2 mt-3 bg-white border-t"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            {combo.quantity} x {combo.name} -
                                            COMBO
                                        </p>
                                        {combo.note && (
                                            <p className="text-sm italic text-muted-foreground">
                                                "{combo.note}"
                                            </p>
                                        )}
                                        {combo.complements && (
                                            <p className="text-sm italic text-muted-foreground">
                                                "{combo.complements}"
                                            </p>
                                        )}
                                        <p className="mt-1 text-sm font-bold">
                                            {formatCurrency(
                                                combo.quantity * combo.price,
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDeleteCombo(i)}
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Button
                                className="w-full"
                                onClick={handleCreateOrder}
                            >
                                🧾 Enviar a cocina
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};
