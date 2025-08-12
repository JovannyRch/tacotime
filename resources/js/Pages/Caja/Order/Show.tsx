import OrderDetail from '@/Components/OrderDetail';
import CajeroLayout from '@/Layouts/CajaLayout';
import { PageProps } from '@/types';
import { Order } from '@/types/global';

interface Props extends PageProps {
    order: Order;
}

const Show = ({ order }: Props) => {
    return (
        <CajeroLayout>
            <OrderDetail order={order} />
        </CajeroLayout>
    );
};

export default Show;
