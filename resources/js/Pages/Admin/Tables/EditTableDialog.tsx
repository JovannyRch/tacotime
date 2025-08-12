import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import TableForm from '@/Pages/Tables/Form';
import { ITable } from '@/types/global';
import { useForm } from '@inertiajs/react';
import { Edit } from 'lucide-react';

interface Props {
    table?: ITable;
    open: boolean;
    onClose: () => void;
}

const EditTableDialog = ({ table, open, onClose }: Props) => {
    const form = useForm({
        name: table?.name || '',
        status: table?.status || 'disponible',
    });

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                    form.reset();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar mesa</DialogTitle>
                </DialogHeader>
                <TableForm
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    processing={form.processing}
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.put(route('tables.update', table?.id), {
                            onSuccess: () => {
                                onClose();
                                form.reset();
                            },
                            preserveState: false,
                        });
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default EditTableDialog;
