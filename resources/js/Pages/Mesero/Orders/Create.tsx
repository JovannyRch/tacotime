import { CreateOrder } from '@/Components/CreateOrder';
import MeseroLayout from '@/Layouts/MeseroLayout';
import { CategoryWithProducts, Combo, ITable } from '@/types/global';

interface Props {
    table: ITable;
    categories: CategoryWithProducts[];
    combos: Combo[];
}

export default function TomarOrdenPage({ table, categories, combos }: Props) {
    return (
        <MeseroLayout pageName="Tomar Orden">
            <CreateOrder
                table={table}
                categories={categories}
                combos={combos}
            />
        </MeseroLayout>
    );
}
