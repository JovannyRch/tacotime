import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { User, UserRole } from '@/types/global';
import { useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';

type Props = {
    user: User;
    onClose: () => void;
    open: boolean;
};

export default function EditUserDialog({ user, onClose, open }: Props) {
    const { data, setData, put, reset } = useForm({
        name: user.name,
        password: '',
        role: user.role as UserRole,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('admin.users.update', user.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                    reset();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar usuario</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Label className="block text-sm font-medium text-gray-700">
                        Nombre
                    </Label>
                    <Input
                        placeholder="Nombre"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="bg-white"
                    />
                    <Label className="block text-sm font-medium text-gray-700">
                        Correo electrónico
                    </Label>
                    <Input
                        placeholder="Correo electrónico"
                        value={user.email}
                        readOnly
                        className="cursor-not-allowed bg-gray-100"
                        disabled
                    />
                    <Label className="block text-sm font-medium text-gray-700">
                        Contraseña (opcional)
                    </Label>
                    <Input
                        placeholder="Nueva contraseña (opcional)"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="bg-white"
                    />
                    <Label className="block text-sm font-medium text-gray-700">
                        Rol
                    </Label>
                    <Select
                        value={data.role}
                        onValueChange={(value) =>
                            setData('role', value as UserRole)
                        }
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue className="bg-white" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="mesero">Mesero</SelectItem>
                            <SelectItem value="caja">Cajero</SelectItem>
                            {/*   <SelectItem value="admin">Admin</SelectItem> */}
                            {/*   <SelectItem value="ordenes">Órdenes</SelectItem> */}
                        </SelectContent>
                    </Select>
                    <Button type="submit" className="w-full">
                        Actualizar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
