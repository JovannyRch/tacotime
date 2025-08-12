import { ActionMenu } from '@/Components/ActionMenu';
import TableViewWrapper from '@/Components/TableViewWrapper';
import Table from '@/Components/ui/table-wrapper';
import AdminLayout from '@/Layouts/AdminLayout';
import { Combo, ComboDetail, PaginatedResponse, Product } from '@/types/global';
import { formatCurrency } from '@/utils/utils';
import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CreateComboDialog from './CreateComboDialog';
import EditComboDialog from './EditComboDialog';

type Props = {
    meta: PaginatedResponse<ComboDetail>;
    products: Product[];
};

export default function ComboIndex({ meta, products }: Props) {
    const [comboToEdit, setComboToEdit] = useState<ComboDetail | null>(null);

    return (
        <AdminLayout pageName="Combos">
            <TableViewWrapper
                title="Combos"
                actions={<CreateComboDialog products={products} />}
            >
                <Table
                    columns={[
                        { key: 'id', title: 'ID' },
                        {
                            key: 'name',
                            title: 'Nombre',
                            render: (combo: Combo) => (
                                <>
                                    <div className="flex flex-col">
                                        <span className="font-bold">
                                            {combo.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {combo.description || ''}
                                        </span>
                                    </div>
                                </>
                            ),
                        },
                        {
                            key: 'price',
                            title: 'Precio',
                            render: (combo: Combo) =>
                                formatCurrency(combo.price),
                        },

                        {
                            key: 'actions',
                            title: '',
                            render: (combo: Combo) => (
                                <div className="flex gap-2">
                                    <ActionMenu
                                        title="Acciones"
                                        items={[
                                            {
                                                label: 'Editar',
                                                icon: Pencil,
                                                onClick: () => {
                                                    setComboToEdit(combo);
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
                                                            'admin.combos.destroy',
                                                            combo.id,
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
            {comboToEdit && (
                <EditComboDialog
                    products={products}
                    combo={comboToEdit}
                    open={true}
                    onClose={() => setComboToEdit(null)}
                />
            )}
        </AdminLayout>
    );
}
