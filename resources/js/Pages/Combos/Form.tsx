import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { ComboFormData, ComboProductPivot, Product } from '@/types/global';
import { FormEvent } from 'react';

interface Props {
    products: Product[];
    onSubmit: (e: FormEvent) => void;
    processing: boolean;
    errors: Record<string, string>;
    setData: (key: string, value: unknown) => void;
    data: ComboFormData;
}

export default function ComboForm({
    products,
    onSubmit,
    processing,
    errors,
    setData,
    data,
}: Props) {
    const updateProductQty = (id: number, quantity: number | string) => {
        const updated = data.products.map((p: ComboProductPivot) =>
            p.id === id ? { id: p.id, quantity } : p,
        );
        setData('products', updated);
    };

    const toggleProduct = (id: number) => {
        const exists = data.products.find(
            (p: ComboProductPivot) => p?.id === id,
        );
        if (exists) {
            setData(
                'products',
                data.products.filter((p: ComboProductPivot) => p.id !== id),
            );
        } else {
            setData('products', [...data.products, { id, quantity: 1 }]);
        }
    };

    const isSelected = (id: number) =>
        data.products.some((p: ComboProductPivot) => p.id === id);

    const getQuantity = (id: number) =>
        data.products?.find((p: ComboProductPivot) => p?.id === id)?.quantity ||
        1;

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Nombre */}
            <div className="space-y-1">
                <Label htmlFor="name">Nombre</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="bg-white"
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
            </div>

            {/* Precio */}
            <div className="space-y-1">
                <Label htmlFor="price">Precio</Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={data.price}
                    onChange={(e) =>
                        setData('price', parseFloat(e.target.value))
                    }
                    className="bg-white"
                />
                {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                )}
            </div>

            {/* Descripción */}
            <div className="space-y-1">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="bg-white"
                />
            </div>

            {/* Productos del combo */}
            <div>
                <h2 className="text-md mb-2 font-semibold">
                    Productos del combo
                </h2>
                <div className="max-h-60 space-y-3 overflow-y-auto">
                    {products.map((p) => {
                        const selected = isSelected(p.id!);
                        return (
                            <div
                                key={p.id}
                                className="flex items-center gap-2 rounded bg-muted/30 p-2"
                            >
                                <Checkbox
                                    checked={selected}
                                    onCheckedChange={() => toggleProduct(p.id!)}
                                    id={`product-${p.id}`}
                                    className="bg-white"
                                />
                                <Label
                                    htmlFor={`product-${p.id}`}
                                    className="flex-1"
                                >
                                    {p.name}
                                </Label>
                                {selected && (
                                    <Input
                                        type="number"
                                        min={1}
                                        value={getQuantity(p.id!)}
                                        onChange={(e) =>
                                            updateProductQty(
                                                p.id!,
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="w-20 bg-white"
                                    />
                                )}
                            </div>
                        );
                    })}
                    {errors.products && (
                        <p className="text-sm text-red-500">
                            {errors.products}
                        </p>
                    )}
                </div>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={processing} className="w-full">
                Guardar Combo
            </Button>
        </form>
    );
}
