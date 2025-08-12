import TableViewWrapper from '@/Components/TableViewWrapper';
import Table from '@/Components/ui/table-wrapper';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modifier, PaginatedResponse } from '@/types/global';

import { ActionMenu } from '@/Components/ActionMenu';
import { router } from '@inertiajs/react';
import { Pencil, Trash2, Utensils } from 'lucide-react';
import { useState } from 'react';
import ModifierDialog from './ModifierDialog';

interface Props {
    meta: PaginatedResponse<Modifier>;
}

const Index = ({ meta }: Props) => {
    const [modifierToEdit, setModifierToEdit] = useState<Modifier | null>(null);

    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

    return (
        <AdminLayout pageName="Complementos">
            <TableViewWrapper
                title="Complementos"
                actions={
                    <ModifierDialog
                        open={openCreateModal}
                        onClose={() => setOpenCreateModal(false)}
                        onClick={() => setOpenCreateModal(true)}
                    />
                }
            >
                <Table
                    columns={[
                        { key: 'id', title: 'ID' },
                        { key: 'name', title: 'Nombre', bold: true },
                        {
                            key: 'actions',
                            title: '',
                            render: (modifier: Modifier) => (
                                <div className="flex items-center space-x-2">
                                    <ActionMenu
                                        title="Acciones"
                                        items={[
                                            {
                                                label: 'Asignar productos',
                                                icon: Utensils,
                                                onClick: () => {
                                                    router.visit(
                                                        route(
                                                            'admin.modifiers.show',
                                                            modifier.id,
                                                        ),
                                                    );
                                                },
                                            },
                                            {
                                                label: 'Editar',
                                                icon: Pencil,
                                                onClick: () => {
                                                    setModifierToEdit(modifier);
                                                },
                                                shortcut: 'E',
                                            },
                                            {
                                                label: 'Eliminar',
                                                icon: Trash2,
                                                danger: true,
                                                confirm: {
                                                    title: 'Eliminar complemento',
                                                    description:
                                                        'Esta acción no se puede deshacer.',
                                                    confirmText: 'Eliminar',
                                                },
                                                onClick: () =>
                                                    router.delete(
                                                        route(
                                                            'admin.modifiers.destroy',
                                                            modifier.id,
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
                {modifierToEdit && (
                    <ModifierDialog
                        modifier={modifierToEdit}
                        onClose={() => setModifierToEdit(null)}
                        open={true}
                    />
                )}
            </TableViewWrapper>
        </AdminLayout>
    );
};

export default Index;
