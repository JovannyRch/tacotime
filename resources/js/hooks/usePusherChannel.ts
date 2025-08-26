// src/hooks/usePusherChannel.ts
import { useEffect, useRef } from "react";
import Pusher, { Channel, Options } from "pusher-js";

// Singleton para no abrir múltiples conexiones al mismo tiempo
let pusherSingleton: Pusher | null = null;

type EventHandler<T = any> = (data: T) => void;
type EventsMap = Record<string, EventHandler>;

interface UsePusherChannelOptions extends Partial<Options> {
    key?: string;
    cluster?: string;
    forceTLS?: boolean;
}

/**
 * Suscribe a un canal público de Pusher y bindea eventos.
 * - channelName: nombre del canal (p.ej. 'orders')
 * - events: { 'order.created': handler, 'order.updated': handler2, ... }
 * - deps: dependencias para re-suscripción (p.ej. [channelName])
 * - options: override de key/cluster/forceTLS
 */
export function usePusherChannel(
    channelName: string,
    events: EventsMap,
    deps: any[] = [],
    options: UsePusherChannelOptions = {},
) {
    const channelRef = useRef<Channel | null>(null);

    useEffect(() => {
        const key = options.key ?? import.meta.env.VITE_PUSHER_KEY;
        const cluster = options.cluster ?? import.meta.env.VITE_PUSHER_CLUSTER;
        const forceTLS = options.forceTLS ?? true;

        if (!key || !cluster) {
            if (import.meta.env.DEV) {
                console.warn(
                    "[usePusherChannel] Faltan VITE_PUSHER_KEY o VITE_PUSHER_CLUSTER",
                );
            }
            return;
        }

        if (!pusherSingleton) {
            pusherSingleton = new Pusher(key, {
                cluster,
                forceTLS,
                ...options,
            });
        }

        const channel = pusherSingleton.subscribe(channelName);
        channelRef.current = channel;

        // Bind de todos los eventos
        Object.entries(events).forEach(([eventName, handler]) => {
            channel.bind(eventName, handler);
        });

        return () => {
            if (!channelRef.current) return;

            // Unbind de handlers específicos primero
            Object.entries(events).forEach(([eventName, handler]) => {
                channelRef.current!.unbind(eventName, handler);
            });

            // Luego unsubscribe del canal
            pusherSingleton?.unsubscribe(channelName);
            channelRef.current = null;
            // No desconectamos el singleton para permitir reutilización en otras pantallas
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelName, ...deps]);
}
