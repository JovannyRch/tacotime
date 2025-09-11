import { CreateOrder } from "@/Components/CreateOrder";
import MeseroLayout from "@/Layouts/MeseroLayout";
import { CategoryWithProducts, Combo, ITable, Order } from "@/types/global";

interface Props {
    table: ITable;
    categories: CategoryWithProducts[];
    combos: Combo[];
    order: Order | null;
}

export default function TomarOrdenPage({
    table,
    categories,
    combos,
    order,
}: Props) {
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
