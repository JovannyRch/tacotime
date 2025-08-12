import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as AppPageProps } from './';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    /* eslint-disable no-var */
    var route: typeof ziggyRoute;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}

interface Product {
    id?: number;
    name?: string;
    price?: number;
    description?: string;
    is_available?: boolean;
    category_id?: number;
    category?: Category;
    modifiers?: Modifier[];
}

interface Category {
    id: number;
    name: string;
    modifiers?: Modifier[];
}

interface CategoryWithProducts extends Category {
    products: Product[];
}

interface ComboProduct {
    id: number;
    quantity: number;
    product?: Product[];
    pivot?: {
        quantity: number;
        unit_price: number;
        id?: number;
    };
    category?: Category;
}

interface ComboDetail extends Combo {
    products: ComboProduct[];
}

interface ComboProductPivot {
    id: number;
    quantity: number;
    complements?: string;
    notes?: string;
}

interface Combo {
    id?: number;
    name: string;
    price: number;
    description: string;
    products: ComboProductPivot[];
    product_ids?: number[];
    modifiers?: Modifier[];
}

interface ComboFormData {
    name: string;
    price: number;
    description: string;
    products: {
        id: number;
        quantity: number;
        complements: string;
        notes: string;
    }[];
}

interface ITable {
    id: number;
    name: string;
    status: string;
}

interface ComboProduct {
    id: number;
    quantity: number;
}

interface User {
    id?: number;
    name: string;
    email: string;
    role: 'mesero' | 'admin' | 'ordenes';
}

type LaravelLink = {
    url: string | null;
    label: string; // puede venir "&laquo; Previous", "1", "..."
    active: boolean;
};

interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: LaravelLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

type OrderStatus = 'pagado' | 'pendiente' | 'cancelado' | 'preparando' | string;

interface Order {
    id: number;
    status: OrderStatus;
    total: number;
    user: { name: string };
    table?: { name: string };
    products: {
        id: number;
        name: string;
        pivot: {
            quantity: number;
            unit_price: number;
            complements?: string;
            notes?: string;
        };
    }[];
    combos: {
        id: number;
        name: string;
        pivot: {
            quantity: number;
            unit_price: number;
            complements?: string;
            notes?: string;
        };
    }[];
    created_at?: string;
    payment?: Payment;
    resume?: string;
    is_delivery?: boolean;
}

interface EditableOrderProduct extends Product {
    _editData?: {
        quantity: number;
        complements: string[];
        note: string;
    };
}

type UserRole = 'mesero' | 'caja' | 'admin';

type PaymentMethod = 'cash' | 'card' | 'transfer';

type DiscountType = '' | 'PERCENT' | 'FIXED';

export interface Caja {
    id: number;
    user_id: number;
    opened_at: string;
    closed_at: string | null;

    // Totales consolidados (sólo si la caja está cerrada)
    total_cash: number;
    total_card: number;
    total_transfer: number;

    // Totales en tiempo real (calculados en backend si la caja está abierta)
    computed_totals: {
        cash: number;
        card: number;
        transfer: number;
    };

    // Lista de pagos registrados en esta sesión
    payments: Payment[];
}

export interface Payment {
    id: number;
    order_id: number;
    cash_register_session_id: number;
    method: PaymentMethod;
    amount: number;
    received_amount: number | null;
    change: number | null;
    created_at: string;
    updated_at: string;
    discount_type: DiscountType;
    discount_value: number;
    discount_amount: number;
    discount_reason: string;
    order?: Order;
}

interface CashRegisterSession {
    id: number;
    user_id: number;
    opened_at: string;
    closed_at: string | null;
    total_cash: number;
    total_card: number;
    total_transfer: number;
    created_at: string;
    updated_at: string;
    user?: User;
    payments?: Payment[];
}

export interface Modifier {
    id?: number;
    name: string;
    created_at: string;
    updated_at: string;

    products?: ModifierAssignableProduct[];
    categories?: ModifierAssignableCategory[];
    combos?: ModifierAssignableCombo[];
}

export interface ModifierAssignableProduct {
    id: number;
    name: string;
}

export interface ModifierAssignableCategory {
    id: number;
    name: string;
    // ... otros campos relevantes si los necesitas
}

export interface ModifierAssignableCombo {
    id: number;
    name: string;
}

export type ModifierAssignable =
    | { type: 'product'; data: ModifierAssignableProduct }
    | { type: 'category'; data: ModifierAssignableCategory }
    | { type: 'combo'; data: ModifierAssignableCombo };

export interface ModifierFormData {
    name: string;
}

export type AssignableType = 'product' | 'category' | 'combo';

export interface AssignableOption {
    id: number;
    name: string;
}
