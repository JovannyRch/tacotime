import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import ComboForm from '@/Pages/Combos/Form';
import { ComboDetail, Product } from '@/types/global';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
    products: Product[];
    combo: ComboDetail;
    open: boolean;
    onClose: () => void;
}

const EditComboDialog = ({ products, combo, open, onClose }: Props) => {
    const form = useForm({
        name: combo.name,
        price: combo.price,
        description: combo.description,
        products: combo.products.map((product) => ({
            id: product.id,
            quantity: product.pivot?.quantity || 1,
            complements: '',
            notes: '',
        })),
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        form.put(route('combos.update', combo.id), {
            onSuccess: () => {
                onClose();
                form.reset();
            },
            preserveState: false,
        });
    };

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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar producto</DialogTitle>
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

export default EditComboDialog;
