import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { PaginatedResponse } from '@/types/global';
import { PaginationLaravel } from './pagination';

type Column<T> = {
    key: string;
    title: string;
    render?: (row: T) => React.ReactNode;
    bold?: boolean;
    align?: 'left' | 'center' | 'right';
    className?: string;
};

type Props<T> = {
    columns: Column<T>[];
    dataSource: T[];
    pagination: PaginatedResponse<T>;
};

export default function TableWrapper<T>({
    columns,
    dataSource,
    pagination,
}: Props<T>) {
    const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
        switch (align) {
            case 'center':
                return 'text-center';
            case 'right':
                return 'text-right';
            case 'left':
            default:
                return 'text-left';
        }
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-white shadow">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#F6F8FA] hover:bg-[#F1F3F5]">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={`font-bold text-black ${getAlignmentClass(col.align)} ${col.className ?? ''} ${col.key === 'actions' ? 'w-24' : ''}`}
                                >
                                    {col.title}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataSource.length > 0 ? (
                            dataSource.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={`${col.bold ? 'font-bold' : ''} py-3 ${getAlignmentClass(col.align)} ${col.className ?? ''} ${col.key === 'actions' ? 'w-24 text-center' : ''}`}
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : (row as never)[col.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="py-6 text-center text-muted-foreground"
                                >
                                    No hay datos disponibles.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className="flex items-center justify-end gap-4">
                    <PaginationLaravel meta={pagination} />
                </div>
            )}
        </div>
    );
}
