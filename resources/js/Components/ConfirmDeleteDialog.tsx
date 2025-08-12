import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Trash } from 'lucide-react';

interface Props<T> {
    item: T;
    onDelete: (item: T) => void;
    description?: string;
    triggerVariant?: 'icon' | 'button';
    confirmText?: string;
}

export default function ConfirmDeleteDialog<T>({
    item,
    onDelete,
    description = '¿Estás seguro de eliminar este elemento?',
    triggerVariant = 'icon',
    confirmText = 'Eliminar',
}: Props<T>) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {triggerVariant === 'icon' ? (
                    <Button variant="destructive" size="icon">
                        <Trash className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button variant="destructive">Eliminar</Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{description}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            if (item) {
                                onDelete(item);
                            }
                        }}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
