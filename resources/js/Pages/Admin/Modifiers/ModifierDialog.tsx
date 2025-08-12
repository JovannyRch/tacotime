import ModifierForm from '@/Components/ModifierForm';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Modifier } from '@/types/global';
import { Plus } from 'lucide-react';

type Props = {
    modifier?: Modifier;
    onClose: () => void;
    open?: boolean;
    onClick?: () => void;
};

export default function ModifierDialog({
    modifier,
    onClose,
    open,
    onClick,
}: Props) {
    const isEdit = Boolean(modifier);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            {!isEdit && onClick && (
                <DialogTrigger asChild>
                    <Button
                        variant={isEdit ? 'secondary' : 'default'}
                        size={isEdit ? 'icon' : 'default'}
                        onClick={onClick}
                    >
                        <Plus /> Agregar complemento
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {modifier ? 'Editar complemento' : 'Crear complemento'}
                    </DialogTitle>
                </DialogHeader>
                <ModifierForm
                    modifier={modifier}
                    onSuccess={() => {
                        onClose();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
