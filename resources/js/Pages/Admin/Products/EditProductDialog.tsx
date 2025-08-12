import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import ProductForm from '@/Pages/Products/Form';
import { Category, Product } from '@/types/global';
import { useForm } from '@inertiajs/react';

interface Props {
    categories: Category[];
    product?: Product;
    open: boolean;
    onClose: () => void;
}

const EditProductDialog = ({ categories, product, open, onClose }: Props) => {
    const form = useForm({
        name: product?.name || '',
        price: product?.price || 0,
        category_id: product?.category_id || 0,
        description: product?.description || '',
        is_available: product?.is_available,
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar producto</DialogTitle>
                </DialogHeader>
                <ProductForm
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    processing={form.processing}
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.put(route('products.update', product?.id), {
                            onSuccess: () => {
                                onClose();
                                form.reset();
                            },
                            preserveState: false,
                        });
                    }}
                    categories={categories}
                />
            </DialogContent>
        </Dialog>
    );
};

export default EditProductDialog;
