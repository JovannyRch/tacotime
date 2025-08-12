import TableViewWrapper from '@/Components/TableViewWrapper';

import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import Table from '@/Components/ui/table-wrapper';
import AdminLayout from '@/Layouts/AdminLayout';
import { CashRegisterSession, PaginatedResponse } from '@/types/global';
import { formatCurrency, formatDate } from '@/utils/utils';
import { router } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';

type Props = {
    meta: PaginatedResponse<CashRegisterSession>;
};

const Index = ({ meta }: Props) => {
    // Helpers (puedes moverlos a /utils si quieres)
    const getTotals = (s: CashRegisterSession) => {
        const cash = Number(s.total_cash ?? 0);
        const card = Number(s.total_card ?? 0);
        const transfer = Number(s.total_transfer ?? 0);
        const total = cash + card + transfer;
        return { cash, card, transfer, total };
    };

    const TotalsCell = ({ s }: { s: CashRegisterSession }) => {
        const { cash, card, transfer, total } = getTotals(s);

        return (
            <div className="flex flex-col gap-1 text-right tabular-nums">
                <div className="flex items-center justify-end gap-2">
                    {cash > 0 && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Efec {formatCurrency(cash)}
                        </span>
                    )}
                    {card > 0 && (
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                            Tarj {formatCurrency(card)}
                        </span>
                    )}
                    {transfer > 0 && (
                        <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700">
                            Trans {formatCurrency(transfer)}
                        </span>
                    )}
                </div>

                <div className="text-sm font-semibold text-foreground">
                    {formatCurrency(total)}
                </div>
            </div>
        );
    };

    const StatusBadge = ({ s }: { s: CashRegisterSession }) => {
        const isOpen = !s.closed_at;
        return (
            <span
                className={[
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                    isOpen
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-700',
                ].join(' ')}
                title={isOpen ? 'Sesión abierta' : 'Sesión cerrada'}
            >
                <span
                    className={[
                        'h-1.5 w-1.5 rounded-full',
                        isOpen ? 'bg-amber-600' : 'bg-emerald-600',
                    ].join(' ')}
                />
                {isOpen ? 'Abierta' : 'Cerrada'}
            </span>
        );
    };

    const RangeCell = ({ s }: { s: CashRegisterSession }) => (
        <div className="text-sm leading-tight">
            <div>
                <span className="text-muted-foreground">Inicio:</span>{' '}
                {formatDate(s.opened_at)}
            </div>
            <div>
                <span className="text-muted-foreground">Fin:</span>{' '}
                {s.closed_at ? formatDate(s.closed_at) : '—'}
            </div>
        </div>
    );

    return (
        <AdminLayout pageName="Caja">
            <TableViewWrapper title="Caja">
                <Table
                    columns={[
                        { key: 'id', title: 'ID' },
                        {
                            key: 'user',
                            title: 'Usuario',
                            render: (s: CashRegisterSession) => (
                                <div className="flex flex-col">
                                    <span className="font-bold">
                                        {s?.user?.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {s?.user?.email}
                                    </span>
                                </div>
                            ),
                        },
                        {
                            key: 'status',
                            title: 'Estado',
                            render: (s: CashRegisterSession) => (
                                <StatusBadge s={s} />
                            ),
                        },
                        {
                            key: 'payments',
                            title: 'Pagos (detalle) / Total',
                            render: (s: CashRegisterSession) => (
                                <TotalsCell s={s} />
                            ),
                        },
                        {
                            key: 'range',
                            title: 'Rango',
                            render: (s: CashRegisterSession) => (
                                <RangeCell s={s} />
                            ),
                        },
                        {
                            key: 'actions',
                            title: '',
                            render: (s: CashRegisterSession) => (
                                <div className="flex items-center justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-40"
                                        >
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            'admin.cashier.show',
                                                            s.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Ver detalle
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    window.open(
                                                        route('caja.ticket', {
                                                            id: s.id,
                                                        }),
                                                        '_blank',
                                                    );
                                                }}
                                            >
                                                Imprimir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ),
                        },
                    ]}
                    dataSource={meta.data}
                    pagination={meta}
                />
            </TableViewWrapper>
        </AdminLayout>
    );
};

export default Index;
