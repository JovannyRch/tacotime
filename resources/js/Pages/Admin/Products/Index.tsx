import { ActionMenu } from '@/Components/ActionMenu';
import TableViewWrapper from '@/Components/TableViewWrapper';
import { Badge } from '@/Components/ui/badge';
import Table from '@/Components/ui/table-wrapper';
import AdminLayout from '@/Layouts/AdminLayout';
import { Category, PaginatedResponse, Product, User } from '@/types/global';
import { formatCurrency } from '@/utils/utils';
import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CreateProductDialog from './CreateProductDialog';
import EditProductDialog from './EditProductDialog';

type Props = {
    meta: PaginatedResponse<User>;
    categories: Category[];
};

export default function ProductsIndex({ meta, categories }: Props) {
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    return (
        <AdminLayout pageName="Productos">
            <TableViewWrapper
                title="Productos"
                actions={<CreateProductDialog categories={categories} />}
            >
                <Table
                    columns={[
                        { key: 'id', title: 'ID' },
                        {
                            key: 'name',
                            title: 'Nombre',
                            bold: true,
                            render: (product: Product) => (
                                <div className="flex flex-col">
                                    <span>{product.name}</span>
                                    <span className="text-sm text-gray-500">
                                        {product.category
                                            ? product.category.name
                                            : 'Sin categoría'}
                                    </span>
                                </div>
                            ),
                        },
                        {
                            key: 'price',
                            title: 'Precio',
                            bold: true,
                            render: (product: Product) =>
                                formatCurrency(product.price),
                        },

                        {
                            key: 'available',
                            title: 'Estatus',
                            align: 'center',
                            render: (product: Product) => (
                                <Badge
                                    className={
                                        product.is_available
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                    }
                                >
                                    {product.is_available
                                        ? 'Disponible'
                                        : 'No disponible'}
                                </Badge>
                            ),
                        },

                        {
                            key: 'actions',
                            title: '',
                            render: (product: Product) => (
                                <div className="flex gap-2">
                                    <ActionMenu
                                        title="Acciones"
                                        items={[
                                            {
                                                label: 'Editar',
                                                icon: Pencil,
                                                onClick: () => {
                                                    setProductToEdit(product);
                                                },
                                                shortcut: 'E',
                                            },
                                            {
                                                label: 'Eliminar',
                                                icon: Trash2,
                                                danger: true,
                                                confirm: {
                                                    title: 'Eliminar producto',
                                                    description:
                                                        'Esta acción no se puede deshacer.',
                                                    confirmText: 'Eliminar',
                                                },
                                                onClick: () =>
                                                    router.delete(
                                                        route(
                                                            'products.destroy',
                                                            product.id,
                                                        ),
                                                        {
                                                            preserveState: false,
                                                        },
                                                    ),
                                            },
                                        ]}
                                    />
                                </div>
                            ),
                        },
                    ]}
                    dataSource={meta.data}
                    pagination={meta}
                />
            </TableViewWrapper>
            {productToEdit && (
                <EditProductDialog
                    categories={categories}
                    product={productToEdit}
                    open={true}
                    onClose={() => {
                        setProductToEdit(null);
                    }}
                />
            )}
        </AdminLayout>
    );
}
