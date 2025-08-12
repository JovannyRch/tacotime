import { CashRegisterSessionCard } from '@/Components/CashRegisterSessionCard';
import { Button } from '@/Components/ui/button';
import AdminLayout from '@/Layouts/AdminLayout';
import { CashRegisterSession } from '@/types/global';
import { Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

interface ShowProps {
    session: CashRegisterSession;
}

const Show = ({ session }: ShowProps) => {
    return (
        <AdminLayout pageName={`Detalle de sesión #${session.id}`}>
            <div className="mb-4">
                {/* Go back to list */}
                <Button asChild variant="ghost">
                    <Link href={route('admin.cashier.index')}>
                        <ChevronLeft /> Volver al listado
                    </Link>
                </Button>
            </div>
            <CashRegisterSessionCard session={session} />
        </AdminLayout>
    );
};

export default Show;
