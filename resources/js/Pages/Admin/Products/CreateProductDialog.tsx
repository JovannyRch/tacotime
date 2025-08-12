import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import ProductForm from '@/Pages/Products/Form';
import { Category } from '@/types/global';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface Props {
    categories: Category[];
}

const CreateProductDialog = ({ categories }: Props) => {
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
        form.post('/products', {
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
                    Agregar producto
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo producto</DialogTitle>
                </DialogHeader>
                <ProductForm
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    processing={form.processing}
                    onSubmit={handleSubmit}
                    categories={categories}
                />
            </DialogContent>
        </Dialog>
    );
};

export default CreateProductDialog;
