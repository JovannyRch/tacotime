import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { AssignableOption, AssignableType, Modifier } from '@/types/global';
import { useForm } from '@inertiajs/react';

interface Props {
    modifier: Modifier;
    products: AssignableOption[];
    categories: AssignableOption[];
    combos: AssignableOption[];
    onSuccess?: () => void;
}

export default function ModifierAssignForm({
    modifier,
    products,
    categories,
    combos,
    onSuccess,
}: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        assignable_type: AssignableType;
        assignable_id: number | '';
    }>({
        assignable_type: 'product',
        assignable_id: '',
    });

    const optionsMap: Record<AssignableType, AssignableOption[]> = {
        product: products,
        category: categories,
        combo: combos,
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.modifiers.assign', modifier.id), {
            onSuccess,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Tipo de asignación</Label>
                <Select
                    value={data.assignable_type}
                    onValueChange={(value: AssignableType) => {
                        setData('assignable_type', value);
                        setData('assignable_id', '');
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="product">Producto</SelectItem>
                        <SelectItem value="category">Categoría</SelectItem>
                        {/*  <SelectItem value="combo">Combo</SelectItem> */}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Elemento</Label>
                <Select
                    value={data.assignable_id?.toString()}
                    onValueChange={(value) =>
                        setData('assignable_id', parseInt(value))
                    }
                    disabled={!optionsMap[data.assignable_type].length}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un elemento" />
                    </SelectTrigger>
                    <SelectContent>
                        {optionsMap[data.assignable_type].map((item) => (
                            <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                            >
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.assignable_id && (
                    <p className="text-sm text-red-500">
                        {errors.assignable_id}
                    </p>
                )}
            </div>

            <Button type="submit" disabled={processing || !data.assignable_id}>
                Asignar complemento
            </Button>
        </form>
    );
}
