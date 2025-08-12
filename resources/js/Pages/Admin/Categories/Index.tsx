import { ActionMenu } from '@/Components/ActionMenu';
import TableViewWrapper from '@/Components/TableViewWrapper';
import Table from '@/Components/ui/table-wrapper';
import AdminLayout from '@/Layouts/AdminLayout';
import { Category, PaginatedResponse } from '@/types/global';
import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CreateCategoryModal from './CreateCategoryModal';
import EditCategoryModal from './EditCategoryModal';

type Props = {
    meta: PaginatedResponse<Category>;
};

export default function CategoriesIndex({ meta }: Props) {
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    return (
        <AdminLayout pageName="Categorías">
            <TableViewWrapper
                title="Categorías"
                actions={<CreateCategoryModal />}
            >
                <Table
                    columns={[
                        { key: 'id', title: 'ID' },
                        { key: 'name', title: 'Nombre', bold: true },
                        {
                            key: 'actions',
                            title: 'Acciones',
                            render: (category: Category) => (
                                <div className="flex gap-2">
                                    <ActionMenu
                                        title="Acciones"
                                        items={[
                                            {
                                                label: 'Editar',
                                                icon: Pencil,
                                                onClick: () => {
                                                    setCategoryToEdit(category);
                                                },
                                                shortcut: 'E',
                                            },
                                            {
                                                label: 'Eliminar',
                                                icon: Trash2,
                                                danger: true,
                                                confirm: {
                                                    title: 'Eliminar categoría',
                                                    description:
                                                        'Esta acción no se puede deshacer.',
                                                    confirmText: 'Eliminar',
                                                },
                                                onClick: () =>
                                                    router.delete(
                                                        route(
                                                            'admin.categories.destroy',
                                                            category.id,
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
            {categoryToEdit && (
                <EditCategoryModal
                    category={categoryToEdit}
                    onClose={() => setCategoryToEdit(null)}
                    open={true}
                />
            )}
        </AdminLayout>
    );
}
