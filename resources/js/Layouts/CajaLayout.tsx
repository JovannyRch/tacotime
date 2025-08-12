import ConfirmLogout from '@/Components/ConfirmLogout';
import { cn } from '@/lib/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    pageName?: string;
}

export default function CajeroLayout({ children, pageName }: Props) {
    const { url } = usePage();
    const user = usePage().props.auth.user;

    const navItems = [
        { label: 'Caja actual', href: '/caja' },
        { label: 'Órdenes pendientes', href: '/caja/ordenes' },
        { label: 'Servicio a domicilio', href: '/caja/ordenar' },
    ];

    const handleLogout = async () => {
        axios.post('/caja/cash-register/close').finally(() => {
            router.post(route('logout'));
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {pageName && <Head title={pageName} />}
            <header className="bg-white px-4 py-3 shadow">
                <Link
                    href={route('mesero.dashboard')}
                    className="text-lg font-bold"
                >
                    🌮 Taco Time
                </Link>
            </header>

            <nav className="flex justify-between gap-4 border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
                <div className="flex space-x-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'text-sm font-medium',
                                url === item.href
                                    ? 'border-b-2 border-teal-700 text-teal-700'
                                    : 'text-gray-500 hover:text-gray-700',
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center">
                    <div className="flex flex-col text-sm font-medium text-gray-700">
                        <span className="text-sm font-medium text-gray-700">
                            {user.name}
                        </span>
                        <span className="text-sm font-medium text-gray-500">
                            {user.email}
                        </span>
                    </div>
                    <ConfirmLogout onLogout={handleLogout} />
                </div>
            </nav>

            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
