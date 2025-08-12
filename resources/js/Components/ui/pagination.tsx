// components/PaginationLaravel.tsx
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { PaginatedResponse } from '@/types/global';
import { router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
} from 'lucide-react';

type Props<T> = {
    meta: PaginatedResponse<T>;
    className?: string;

    onNavigate?: (url: string) => void;
};

export function PaginationLaravel<T>({
    meta,
    className,
    onNavigate,
}: Props<T>) {
    const {
        current_page,
        from,
        to,
        total,
        last_page,
        prev_page_url,
        next_page_url,
        links,
        path,
    } = meta;

    if (last_page <= 1) return null;

    const go = (url?: string | null) => {
        if (!url) return;
        if (onNavigate) onNavigate(url);
        else router.visit(url, { preserveScroll: true, preserveState: true });
    };

    // Asegura first/last por si no vinieran en links (a veces depende de la versión)
    const firstUrl = meta.first_page_url ?? `${path}?page=1`;
    const lastUrl = meta.last_page_url ?? `${path}?page=${last_page}`;

    // Laravel mete en links los botones prev/next y páginas. Filtramos y normalizamos
    const pageItems = links
        // Quitamos etiquetas vacías tipo "Previous"/"Next" si prefieres dibujarlas manualmente
        .filter((l) => isPageNumber(l.label) || isDots(l.label))
        .map((l, i) => ({
            key: `${l.label}-${i}`,
            label: decode(l.label),
            url: l.url,
            active: l.active,
            isDots: isDots(l.label),
        }));

    return (
        <nav
            aria-label="Paginación"
            className={cn(
                'flex w-full items-center justify-between gap-3',
                className,
            )}
        >
            <span className="text-sm text-muted-foreground">
                Mostrando <span className="font-medium">{from ?? 0}</span>–
                <span className="font-medium">{to ?? 0}</span> de{' '}
                <span className="font-medium">{total}</span>
            </span>

            <div className="flex items-center gap-1">
                {/* Primera */}
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Primera página"
                    disabled={current_page === 1}
                    onClick={() => go(firstUrl)}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Anterior */}
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Página anterior"
                    disabled={!prev_page_url}
                    onClick={() => go(prev_page_url)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Páginas */}
                <ul className="mx-1 flex items-center gap-1">
                    {pageItems.map((item) =>
                        item.isDots ? (
                            <li key={item.key}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled
                                    aria-label="Más páginas"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </li>
                        ) : (
                            <li key={item.key}>
                                <Button
                                    size="sm"
                                    variant={
                                        item.active ? 'default' : 'outline'
                                    }
                                    className={cn(
                                        'min-w-9',
                                        item.active && 'pointer-events-none',
                                    )}
                                    aria-current={
                                        item.active ? 'page' : undefined
                                    }
                                    onClick={() =>
                                        go(
                                            item.url ??
                                                buildUrl(
                                                    path,
                                                    Number(item.label),
                                                ),
                                        )
                                    }
                                >
                                    {item.label}
                                </Button>
                            </li>
                        ),
                    )}
                </ul>

                {/* Siguiente */}
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Página siguiente"
                    disabled={!next_page_url}
                    onClick={() => go(next_page_url)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Última */}
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Última página"
                    disabled={current_page === last_page}
                    onClick={() => go(lastUrl)}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </nav>
    );
}

/* ------------ helpers ------------- */

function decode(html: string) {
    // Normaliza entidades comunes; si necesitas algo más robusto, cambia por una librería.
    return html
        .replace('&laquo;', '«')
        .replace('&raquo;', '»')
        .replace('&amp;', '&');
}

function isDots(label: string) {
    const l = decode(label).trim();
    return l === '...' || l === '…';
}

function isPageNumber(label: string) {
    return /^\d+$/.test(label.trim());
}

function buildUrl(path: string, page: number) {
    const url = new URL(
        path,
        typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost',
    );
    url.searchParams.set('page', String(page));
    return url.toString();
}
