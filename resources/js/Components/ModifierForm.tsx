import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Modifier } from '@/types/global';
import { useForm } from '@inertiajs/react';

interface Props {
    modifier?: Modifier; // Si se pasa, es edición
    onSuccess?: () => void; // Callback tras éxito
}

export default function ModifierForm({ modifier, onSuccess }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: modifier?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (modifier) {
            put(route('admin.modifiers.update', modifier.id), {
                onSuccess,
                preserveState: false,
            });
        } else {
            post(route('admin.modifiers.store'), {
                onSuccess,
                preserveState: false,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Nombre del complemento</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    disabled={processing}
                    className="bg-white"
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
            </div>

            <Button type="submit" disabled={processing}>
                {modifier ? 'Actualizar' : 'Crear'}
            </Button>
        </form>
    );
}
