import ModifierAssignForm from '@/Components/ModifierAssignForm';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AdminLayout from '@/Layouts/AdminLayout';
import { AssignableOption, Modifier } from '@/types/global';
import { Link, router } from '@inertiajs/react';
import { ChevronLeft, Trash } from 'lucide-react';

interface Props {
    modifier: Modifier;
    products: AssignableOption[];
    categories: AssignableOption[];
    combos: AssignableOption[];
}

const Show = ({ modifier, products, categories, combos }: Props) => {
    const handleUnassign = (
        assignableType: 'product' | 'category' | 'combo',
        assignableId: number,
    ) => {
        router.post(
            route('admin.modifiers.unassign', modifier.id),
            {
                assignable_type: assignableType,
                assignable_id: assignableId,
            },
            {
                preserveState: false,
            },
        );
    };

    const renderAssignments = (
        label: string,
        items: AssignableOption[] | undefined,
        type: 'product' | 'category' | 'combo',
    ) => {
        if (!items || items.length === 0) return null;

        return (
            <div className="mt-6">
                <h3 className="text-md mb-2 font-semibold">{label}</h3>
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li
                            key={`${type}-${item.id}`}
                            className="flex items-center justify-between rounded-md bg-gray-100 p-2"
                        >
                            <span>{item.name}</span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleUnassign(type, item.id)}
                            >
                                <Trash />
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <AdminLayout pageName={`${modifier.name}`}>
            <Button variant="ghost" className="mb-4" asChild>
                <Link href={route('admin.modifiers.index')}>
                    <ChevronLeft />
                    Volver a la lista
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>{modifier.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ModifierAssignForm
                        modifier={modifier}
                        products={products}
                        categories={categories}
                        combos={combos}
                    />

                    {renderAssignments(
                        'Productos asignados',
                        modifier.products,
                        'product',
                    )}
                    {renderAssignments(
                        'Categorías asignadas',
                        modifier.categories,
                        'category',
                    )}
                    {renderAssignments(
                        'Combos asignados',
                        modifier.combos,
                        'combo',
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default Show;
