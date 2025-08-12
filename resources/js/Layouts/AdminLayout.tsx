import ConfirmLogout from '@/Components/ConfirmLogout';
import { Button } from '@/Components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    DollarSign,
    HandPlatter,
    LayoutDashboard,
    LayoutGrid,
    LeafyGreen,
    List,
    Package,
    Users,
    Utensils,
} from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    pageName?: string;
};

const Route = ({
    title,
    path,
    icon,
}: {
    title: string;
    path: string;
    icon?: ReactNode;
}) => {
    const { url } = usePage();
    const isActive = (path: string) => url.startsWith(path);

    return (
        <Link href={path}>
            <Button
                variant={isActive(path) ? 'secondary' : 'ghost'}
                className="w-full justify-start"
            >
                {icon && <span className="mr-1">{icon}</span>}
                {title}
            </Button>
        </Link>
    );
};

export default function AdminLayout({ children, pageName = '' }: Props) {
    return (
        <div className="grid min-h-screen grid-cols-[240px_1fr] bg-gray-100 text-gray-900">
            {pageName && <Head title={pageName} />}
            <aside className="bg-background p-4 shadow-md">
                <h1 className="mb-6 text-xl font-bold">🌮 Taco Time</h1>
                <nav className="flex flex-col gap-2">
                    <Route
                        title="Dashboard"
                        path="/admin/dashboard"
                        icon={<LayoutDashboard />}
                    />
                    <Route
                        title="Productos"
                        path="/admin/products"
                        icon={<List />}
                    />
                    <Route
                        title="Complementos"
                        path="/admin/modifiers"
                        icon={<LeafyGreen />}
                    />

                    <Route
                        title="Combos"
                        path="/admin/combos"
                        icon={<Package />}
                    />
                    <Route
                        title="Categorías"
                        path="/admin/categories"
                        icon={<Utensils />}
                    />
                    <Route
                        title="Mesas"
                        path="/admin/tables"
                        icon={<LayoutGrid />}
                    />

                    <Route
                        title="Usuarios"
                        path="/admin/users"
                        icon={<Users />}
                    />
                    <Route
                        title="Órdenes"
                        path="/admin/orders"
                        icon={<HandPlatter />}
                    />
                    <Route
                        title="Caja"
                        path="/admin/cashier"
                        icon={<DollarSign />}
                    />
                    <div className="my-4 border-t border-gray-200"></div>
                    <ConfirmLogout
                        onLogout={() => {
                            router.post(route('logout'));
                        }}
                    />
                </nav>
            </aside>

            <main className="border-l border-black/10 bg-white p-6">
                {children}
            </main>
        </div>
    );
}
