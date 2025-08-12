import Authenticated from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Combo, ComboProduct } from '@/types/global';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import ComboForm from './Form';

interface Props extends PageProps {
    combo: Combo;
    products: ComboProduct[];
}

export default function Edit({ products, combo }: Props) {
    const form = useForm({
        name: combo.name ?? '',
        price: combo.price ?? 0,
        description: combo.description ?? '',
        products: (combo.products ?? []) as {
            id: number;
            quantity: number;
            complements: string;
            notes: string;
        }[],
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.put(`/combos/${combo.id}`, {
            preserveState: false,
        });
    };

    return (
        <Authenticated>
            <Head title="Editar Combo" />
            <div className="p-6">
                <h1 className="mb-4 text-xl font-bold">Nuevo Combo</h1>
                <ComboForm
                    onSubmit={submit}
                    products={products}
                    processing={form.processing}
                    errors={form.errors}
                    setData={form.setData}
                    data={form.data}
                />
            </div>
        </Authenticated>
    );
}
