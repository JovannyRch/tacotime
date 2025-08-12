import { ActionMenu } from '@/Components/ActionMenu';
import TableViewWrapper from '@/Components/TableViewWrapper';
import Table from '@/Components/ui/table-wrapper';
import AdminLayout from '@/Layouts/AdminLayout';
import { PaginatedResponse, User } from '@/types/global';
import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CreateUserDialog from './components/CreateUserDialog';
import EditUserDialog from './components/EditUserDialog';

type Props = {
    meta: PaginatedResponse<User>;
};

export default function UserIndex({ meta }: Props) {
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const roleMapping: Record<string, string> = {
        mesero: 'Mesero',
        caja: 'Cajero',
        admin: 'Administrador',
        ordenes: 'Órdenes',
    };

    return (
        <AdminLayout pageName="Usuarios">
            <TableViewWrapper title="Usuarios" actions={<CreateUserDialog />}>
                <Table
                    dataSource={meta.data}
                    columns={[
                        { key: 'id', title: 'ID' },
                        {
                            key: 'name',
                            title: 'Nombre',
                            render(row) {
                                return (
                                    <div className="flex flex-col">
                                        <span className="font-bold">
                                            {row.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {row.role
                                                ? roleMapping[row.role] ||
                                                  row.role
                                                : 'Sin rol'}
                                        </span>
                                    </div>
                                );
                            },
                        },
                        { key: 'email', title: 'Email' },

                        {
                            key: 'actions',
                            title: '',
                            render: (user: User) => (
                                <div className="flex gap-2">
                                    <ActionMenu
                                        title="Acciones"
                                        items={[
                                            {
                                                label: 'Editar',
                                                icon: Pencil,
                                                onClick: () => {
                                                    setUserToEdit(user);
                                                },
                                                shortcut: 'E',
                                            },
                                            {
                                                label: 'Eliminar',
                                                icon: Trash2,
                                                danger: true,
                                                confirm: {
                                                    title: 'Eliminar usuario',
                                                    description:
                                                        'Esta acción no se puede deshacer.',
                                                    confirmText: 'Eliminar',
                                                },
                                                onClick: () =>
                                                    router.delete(
                                                        route(
                                                            'admin.users.destroy',
                                                            user.id,
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
                    pagination={meta}
                />
            </TableViewWrapper>
            {userToEdit && (
                <EditUserDialog
                    user={userToEdit}
                    onClose={() => setUserToEdit(null)}
                    open={true}
                />
            )}
        </AdminLayout>
    );
}
