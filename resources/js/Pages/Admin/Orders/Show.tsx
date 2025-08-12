import OrderDetail from '@/Components/OrderDetail';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Order } from '@/types/global';

interface Props extends PageProps {
    order: Order;
}

export default function Show({ order }: Props) {
    return (
        <AdminLayout pageName={`Orden #${order.id}`}>
            <OrderDetail order={order} />
        </AdminLayout>
    );
}
