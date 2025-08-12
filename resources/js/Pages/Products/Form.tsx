import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Category, Product } from '@/types/global';
import { FormEventHandler } from 'react';

interface Props {
    onSubmit: FormEventHandler;
    processing: boolean;
    errors: Record<string, string>;
    setData: (key: string, value: unknown) => void;
    data?: Product;
    categories: Category[];
}

export default function ProductForm({
    data = {},
    setData,
    onSubmit,
    processing,
    errors,
    categories,
}: Props) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-1">
                <Label htmlFor="name">Nombre</Label>
                <Input
                    id="name"
                    value={data.name ?? ''}
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
                    value={data.price ?? ''}
                    onChange={(e) =>
                        setData('price', parseFloat(e.target.value))
                    }
                    className="bg-white"
                />
                {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                )}
            </div>

            {/* Categoría */}
            <div className="space-y-1">
                <Label htmlFor="category">Categoría</Label>
                <Select
                    value={String(data.category_id ?? data.category?.id ?? '')}
                    onValueChange={(value) =>
                        setData('category_id', parseInt(value))
                    }
                >
                    <SelectTrigger id="category" className="bg-white">
                        <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category_id && (
                    <p className="text-sm text-red-500">{errors.category_id}</p>
                )}
            </div>

            {/* Descripción */}
            <div className="space-y-1">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                    id="description"
                    value={data.description ?? ''}
                    onChange={(e) => setData('description', e.target.value)}
                    className="bg-white"
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                )}
            </div>

            {/* Disponible */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="available"
                    checked={data.is_available ?? false}
                    onCheckedChange={(checked) =>
                        setData('is_available', Boolean(checked))
                    }
                    className="bg-white"
                />
                <Label htmlFor="available">Disponible</Label>
            </div>

            {/* Submit */}
            <div className="pt-2">
                <Button type="submit" className="w-full" disabled={processing}>
                    Guardar
                </Button>
            </div>
        </form>
    );
}
