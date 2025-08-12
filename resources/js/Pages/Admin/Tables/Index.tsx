import { ActionMenu } from '@/Components/ActionMenu';
import TableViewWrapper from '@/Components/TableViewWrapper';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import Table from '@/Components/ui/table-wrapper';
import AdminLayout from '@/Layouts/AdminLayout';
import TableForm from '@/Pages/Tables/Form';
import { ITable, PaginatedResponse } from '@/types/global';
import { capitalizeFirstLetter } from '@/utils/utils';
import { router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EditTableDialog from './EditTableDialog';

type Props = {
    meta: PaginatedResponse<ITable>;
};

export default function TableIndex({ meta }: Props) {
    const [open, setOpen] = useState(false);
    const [tableToEdit, setTableToEdit] = useState<ITable | null>(null);

    const form = useForm({
        name: '',
        status: 'disponible',
    });

    return (
        <AdminLayout pageName="Mesas">
            <TableViewWrapper
                title="Mesas"
                actions={
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                Registrar mesa
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Registrar mesa</DialogTitle>
                            </DialogHeader>
                            <TableForm
                                data={form.data}
                                setData={form.setData}
                                errors={form.errors}
                                processing={form.processing}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    form.post('/tables', {
                                        onSuccess: () => {
                                            setOpen(false);
                                            form.reset();
                                        },
                                        preserveState: false,
                                    });
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                }
            >
                <Table
                    columns={[
                        { key: 'id', title: 'ID' },
                        { key: 'name', title: 'Nombre', bold: true },
                        {
                            key: 'status',
                            title: 'Estado',
                            align: 'center',
                            render: (table: ITable) => (
                                <Badge
                                    className={
                                        table.status === 'disponible'
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                    }
                                >
                                    {capitalizeFirstLetter(table.status)}
                                </Badge>
                            ),
                        },
                        {
                            key: 'actions',
                            title: '',
                            render: (table: ITable) => (
                                <div className="flex gap-2">
                                    <ActionMenu
                                        title="Acciones"
                                        items={[
                                            {
                                                label: 'Editar',
                                                icon: Pencil,
                                                onClick: () => {
                                                    setTableToEdit(table);
                                                },
                                                shortcut: 'E',
                                            },
                                            {
                                                label: 'Eliminar',
                                                icon: Trash2,
                                                danger: true,
                                                confirm: {
                                                    title: 'Eliminar mesa',
                                                    description:
                                                        'Esta acción no se puede deshacer.',
                                                    confirmText: 'Eliminar',
                                                },
                                                onClick: () =>
                                                    router.delete(
                                                        route(
                                                            'tables.destroy',
                                                            table.id,
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
            {tableToEdit && (
                <EditTableDialog
                    table={tableToEdit}
                    open={!!tableToEdit}
                    onClose={() => setTableToEdit(null)}
                />
            )}
        </AdminLayout>
    );
}
