import CategoryForm from '@/Components/CategoryForm';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Category } from '@/types/global';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface Props {
    category: Category;
    open: boolean;
    onClose: () => void;
}

const EditCategoryModal = ({ category, onClose, open }: Props) => {
    const form = useForm({
        name: category.name,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(route('admin.categories.update', { id: category.id }), {
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
                    <DialogTitle>Editar categoría</DialogTitle>
                </DialogHeader>
                <CategoryForm
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    processing={form.processing}
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
};

export default EditCategoryModal;
