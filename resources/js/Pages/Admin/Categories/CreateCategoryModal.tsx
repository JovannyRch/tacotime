import CategoryForm from '@/Components/CategoryForm';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

const CreateCategoryModal = () => {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: '',
        price: 0,
        category_id: 0,
        description: '',
        is_available: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('admin.categories.store'), {
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
                    Crear categoría
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nueva categoría</DialogTitle>
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

export default CreateCategoryModal;
