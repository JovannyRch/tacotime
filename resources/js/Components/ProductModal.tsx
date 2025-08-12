import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { EditableOrderProduct } from '@/types/global';
import { getComplementOptions } from '@/utils/utils';
import { useEffect, useState } from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    onAdd: (data: {
        product: EditableOrderProduct;
        quantity: number;
        complements: string[];
        note: string;
    }) => void;
    product: EditableOrderProduct;
}

export const ProductModal = ({ open, onClose, onAdd, product }: Props) => {
    const [quantity, setQuantity] = useState('1');
    const [complements, setComplements] = useState<string[]>([]);
    const [note, setNote] = useState('');

    const options = getComplementOptions(product?.category, product);

    const toggleComplement = (opt: string) => {
        setComplements((prev) =>
            prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
        );
    };

    const handleConfirm = () => {
        if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
            alert('Por favor, ingresa una cantidad válida.');
            return;
        }

        onAdd({ product, quantity: Number(quantity), complements, note });
        setQuantity('1');
        setComplements([]);
        setNote('');
        onClose();
    };

    useEffect(() => {
        if (open) {
            if (product._editData) {
                setQuantity(product._editData.quantity.toString());
                setComplements(product._editData.complements || []);
                setNote(product._editData.note || '');
            }
        }
    }, [open]);

    if (!product) {
        return null;
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">
                        {product.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold">
                            Cantidad
                        </label>
                        <input
                            type="number"
                            className="mt-1 w-full rounded border p-2"
                            value={quantity}
                            min={1}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    {options.length > 0 && (
                        <div>
                            <label className="text-sm font-semibold">
                                Complementos
                            </label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {options.map((opt) => (
                                    <Button
                                        key={opt}
                                        variant={
                                            complements.includes(opt)
                                                ? 'secondary'
                                                : 'outline'
                                        }
                                        className={
                                            !complements.includes(opt)
                                                ? 'bg-white text-gray-900 hover:bg-gray-100'
                                                : ''
                                        }
                                        onClick={() => toggleComplement(opt)}
                                        size="sm"
                                    >
                                        {opt}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-semibold">Notas</label>
                        <textarea
                            className="mt-1 w-full rounded border p-2"
                            rows={2}
                            placeholder="Ej. Bien dorado, con poca salsa..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <Button onClick={handleConfirm} className="mt-2 w-full">
                        {product._editData
                            ? 'Actualizar producto'
                            : 'Agregar a la orden'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
