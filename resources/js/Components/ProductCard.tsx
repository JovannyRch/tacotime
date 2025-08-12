import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/utils';

interface ProductCardProps {
    name: string;
    price: number;
    onClick: () => void;
    showAdd?: boolean;
    className?: string;
}

export function ProductCard({
    name,
    price,
    onClick,
    showAdd = false,
    className,
}: ProductCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'rounded-xl border border-gray-200 bg-white p-4 text-left shadow-md transition hover:shadow-lg active:scale-[0.98]',
                className,
            )}
        >
            <p className="text-base font-semibold text-gray-900">{name}</p>
            <p className="text-md mt-1 text-muted-foreground">
                {formatCurrency(price)}
            </p>
            {showAdd && (
                <span className="text-md mt-2 inline-block font-medium text-primary">
                    + Agregar
                </span>
            )}
        </button>
    );
}
