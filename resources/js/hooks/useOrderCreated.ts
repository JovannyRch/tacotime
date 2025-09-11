import { Order, OrderWithLastIndexes } from "@/types/global";
import { usePusherChannel } from "./usePusherChannel";

export const useOrderCreated = ({
    handleNewOrder,
}: {
    handleNewOrder?: (order: Order) => void;
}) => {
    usePusherChannel("orders", {
        "order.created": (payload: OrderWithLastIndexes) => {
            const newOrder = payload;
            handleNewOrder?.(newOrder);

            const url =
                route("orders.comanda", newOrder.id) +
                `?auto_print=1&lastProductIndex=${newOrder.lastProductIndex ?? 0}&lastComboIndex=${newOrder?.lastComboIndex ?? 0}`;
            window.open(url, "_blank");
        },
    });
};
