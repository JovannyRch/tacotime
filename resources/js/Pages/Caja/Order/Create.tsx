import { CreateOrder } from '@/Components/CreateOrder';
import CajeroLayout from '@/Layouts/CajaLayout';
import { CategoryWithProducts, Combo, ITable } from '@/types/global';

interface Props {
    table: ITable;
    categories: CategoryWithProducts[];
    combos: Combo[];
}

export default function TomarOrdenPage({ table, categories, combos }: Props) {
    return (
        <CajeroLayout pageName="Tomar Orden">
            <CreateOrder
                table={table}
                categories={categories}
                combos={combos}
                isDelivery
            />
        </CajeroLayout>
    );
}
