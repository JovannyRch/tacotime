import { Category, Order, PaymentMethod, Product } from '@/types/global';

export function formatCurrency(
    value: number | string | null | undefined,
): string {
    if (value === null || value === undefined) {
        return '-';
    }

    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    if (isNaN(value)) {
        return '-';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}

export const OrderStatusMapper: Record<string, string> = {
    pendiente: 'En proceso',
    pagado: 'Pagado',
};

export const PaymentMethodMapper: Record<PaymentMethod, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
};

export function formatDate(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return new Intl.DateTimeFormat('es-MX', options).format(new Date(date));
}

export function capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getTableNameOrDefault = (order: Order): string => {
    if (order.is_delivery) {
        return 'Para llevar';
    }
    return order.table?.name || 'Sin mesa';
};

export const COLORS = {
    BACKGROUND_COLOR: '#FDEEDD',
    MAIN: '#900603',
    SECONDARY: '#F6AF16',
};

export const getComplementOptions = (
    category?: Category,
    product?: Product,
) => {
    const options: string[] = [
        ...(category?.modifiers?.map((m) => m.name) || []),
        ...(product?.modifiers?.map((m) => m.name) || []),
    ];

    return Array.from(new Set(options)).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' }),
    );
};
