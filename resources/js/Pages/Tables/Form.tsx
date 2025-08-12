import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

interface Props {
    data: {
        name: string;
        status: string;
    };
    setData: (key: string, value: unknown) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: Record<string, string>;
}

export default function TableForm({
    data,
    setData,
    onSubmit,
    processing,
    errors,
}: Props) {
    return (
        <form onSubmit={onSubmit} className="max-w-md space-y-4">
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

            {/* Estado */}
            <div className="space-y-1">
                <Label htmlFor="status">Estado</Label>
                <Select
                    value={data.status}
                    onValueChange={(value) => setData('status', value)}
                >
                    <SelectTrigger id="status" className="bg-white">
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="disponible">Disponible</SelectItem>
                        <SelectItem value="ocupada">Ocupada</SelectItem>
                    </SelectContent>
                </Select>
                {errors.status && (
                    <p className="text-sm text-red-500">{errors.status}</p>
                )}
            </div>

            {/* Botón submit */}
            <Button type="submit" disabled={processing} className="w-full">
                Guardar
            </Button>
        </form>
    );
}
