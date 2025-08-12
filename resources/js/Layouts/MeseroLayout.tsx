import ConfirmLogout from '@/Components/ConfirmLogout';
import { Head, Link, router } from '@inertiajs/react';

import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    pageName?: string;
}

export default function MeseroLayout({ children, pageName }: Props) {
    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {pageName && <Head title={pageName} />}
            <header className="flex items-center justify-between bg-white p-3 shadow">
                <Link
                    href={route('mesero.dashboard')}
                    className="text-lg font-bold"
                >
                    🌮 Taco Time
                </Link>
                <ConfirmLogout onLogout={handleLogout} />
            </header>

            <main className="flex-1 overflow-y-auto p-3">{children}</main>
        </div>
    );
}
