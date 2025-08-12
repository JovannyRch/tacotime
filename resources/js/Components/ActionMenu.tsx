// components/ActionMenu.tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

type MenuAction = {
    label: string;
    onClick: (
        e?: Event | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => void;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
    danger?: boolean; // estiliza como destructiva
    shortcut?: string; // mostrar p. ej. "⌘E"
    confirm?: {
        title: string;
        description?: string;
        confirmText?: string; // default "Confirmar"
        cancelText?: string; // default "Cancelar"
    };
};

type Props = {
    items: MenuAction[];
    title?: string; // opcional, encabezado del menú
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
    /** Evita que el click burbujee al row (útil en tablas con onRowClick) */
    stopPropagation?: boolean;
    /** Trigger personalizado; si no se pasa, se usa el botón con MoreHorizontal */
    trigger?: React.ReactNode;
};

export function ActionMenu({
    items,
    title,
    align = 'end',
    side = 'bottom',
    className,
    stopPropagation = true,
    trigger,
}: Props) {
    const [confirmIndex, setConfirmIndex] = useState<number | null>(null);

    const handleItemClick = (e: Event, action: MenuAction, index: number) => {
        if (stopPropagation && 'stopPropagation' in e) e.stopPropagation();
        if (action.confirm) {
            setConfirmIndex(index);
            return;
        }
        action.onClick?.(e);
    };

    const pending = confirmIndex != null ? items[confirmIndex] : null;

    return (
        <div
            className={cn('inline-flex', className)}
            onClick={(e) => {
                if (stopPropagation) e.stopPropagation();
            }}
            onMouseDown={(e) => {
                if (stopPropagation) e.stopPropagation();
            }}
        >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {trigger ?? (
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Acciones"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align={align}
                    side={side}
                    className="min-w-48"
                    onClick={(e) => stopPropagation && e.stopPropagation()}
                >
                    {title && (
                        <>
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                {title}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    {items.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                            <DropdownMenuItem
                                key={idx}
                                disabled={action.disabled}
                                onSelect={(e) =>
                                    handleItemClick(e, action, idx)
                                }
                                className={cn(
                                    'cursor-pointer',
                                    action.danger &&
                                        'text-red-600 focus:text-red-700',
                                )}
                            >
                                {Icon && <Icon className="mr-2 h-4 w-4" />}
                                <span className="flex-1">{action.label}</span>
                                {action.shortcut && (
                                    <span className="text-xs text-muted-foreground">
                                        {action.shortcut}
                                    </span>
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Confirmación (si aplica) */}
            <AlertDialog
                open={!!pending}
                onOpenChange={(open) => !open && setConfirmIndex(null)}
            >
                <AlertDialogContent
                    onClick={(e) => stopPropagation && e.stopPropagation()}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pending?.confirm?.title}
                        </AlertDialogTitle>
                        {pending?.confirm?.description && (
                            <AlertDialogDescription>
                                {pending.confirm.description}
                            </AlertDialogDescription>
                        )}
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-2">
                        <AlertDialogCancel>
                            {pending?.confirm?.cancelText ?? 'Cancelar'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={(e) => {
                                pending?.onClick(e);
                                setConfirmIndex(null);
                            }}
                        >
                            {pending?.confirm?.confirmText ?? 'Confirmar'}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
