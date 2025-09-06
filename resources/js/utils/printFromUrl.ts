export async function printFromUrl(url: string) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "text/html",
            },
        });

        const html = await response.text();

        // Crear iframe oculto
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        document.body.appendChild(iframe);

        // Escribir el HTML en el iframe
        iframe.contentDocument?.open();
        iframe.contentDocument?.write(html);
        iframe.contentDocument?.close();

        // Esperar a que carguen estilos/recursos
        iframe.onload = () => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            // Opcional: limpiar después de imprimir
            setTimeout(() => document.body.removeChild(iframe), 1000);
        };
    } catch (error) {
        console.error("Error al imprimir:", error);
    }
}
