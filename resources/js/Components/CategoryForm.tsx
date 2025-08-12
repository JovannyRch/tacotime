import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { FormEvent } from 'react';

interface Props {
    onSubmit: (e: FormEvent) => void;
    processing: boolean;
    errors: Record<string, string>;
    setData: (key: string, value: unknown) => void;
    data: { name?: string };
}

const CategoryForm = ({
    data,
    setData,
    onSubmit,
    processing,
    errors,
}: Props) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-1">
                <Label htmlFor="name">Nombre</Label>
                <Input
                    className="bg-white"
                    id="name"
                    value={data.name ?? ''}
                    onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
            </div>

            {/* Submit */}
            <div className="pt-2">
                <Button type="submit" className="w-full" disabled={processing}>
                    Guardar
                </Button>
            </div>
        </form>
    );
};

export default CategoryForm;
