// utils/print.ts
export async function printFromUrl(url: string) {
    try {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include", // importante para rutas protegidas en Inertia/Laravel
            headers: {
                Accept: "text/html,application/xhtml+xml",
            },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rawHtml = await res.text();

        // Calcula base para que assets relativos resuelvan bien dentro del iframe
        const u = new URL(url, window.location.origin);
        const baseHref = u.origin + u.pathname.replace(/[^/]*$/, ""); // directorio de la vista

        // Inyecta <base> justo después de <head> (o lo crea si no hay <head>)
        const html = rawHtml.includes("<head>")
            ? rawHtml.replace("<head>", `<head><base href="${baseHref}">`)
            : `<head><base href="${baseHref}"></head>${rawHtml}`;

        // Crea iframe oculto
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.setAttribute("aria-hidden", "true");
        document.body.appendChild(iframe);

        // Escribe el HTML
        const doc = iframe.contentDocument!;
        doc.open();
        doc.write(html);
        doc.close();

        // Espera recursos (imágenes + fuentes)
        await waitForImages(doc);
        if ("fonts" in doc) {
            // @ts-ignore
            await (doc as any).fonts.ready;
        }

        // Imprime y limpia
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1500);
    } catch (err) {
        console.error("Error al imprimir:", err);
    }
}

function waitForImages(doc: Document) {
    const images = Array.from(doc.images || []);
    if (images.length === 0) return Promise.resolve();

    return new Promise<void>((resolve) => {
        let loaded = 0;
        const check = () => {
            loaded++;
            if (loaded >= images.length) resolve();
        };
        images.forEach((img) => {
            if (img.complete) {
                check();
            } else {
                img.addEventListener("load", check, { once: true });
                img.addEventListener("error", check, { once: true });
            }
        });
    });
}
