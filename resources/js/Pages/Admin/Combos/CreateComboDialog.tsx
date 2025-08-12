import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import ComboForm from '@/Pages/Combos/Form';
import { Product } from '@/types/global';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Props {
    products: Product[];
}

const CreateComboDialog = ({ products }: Props) => {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: '',
        price: 0,
        description: '',
        products: [] as {
            id: number;
            quantity: number;
            complements: string;
            notes: string;
        }[],
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        form.post('/combos', {
            onSuccess: () => {
                setOpen(false);
                form.reset();
            },
            preserveState: false,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Agregar combo
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo combo</DialogTitle>
                </DialogHeader>
                <ComboForm
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    processing={form.processing}
                    onSubmit={submit}
                    products={products}
                />
            </DialogContent>
        </Dialog>
    );
};

export default CreateComboDialog;
