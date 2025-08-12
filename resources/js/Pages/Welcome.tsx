import tacoAnimation from '@/assets/taco-animation.json'; // 👉 usa tu archivo Lottie
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Head, Link } from '@inertiajs/react';
import Lottie from 'lottie-react';

export default function Welcome() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <Head title="Bienvenido a Taco Time" />
            <Card className="w-full max-w-md rounded-2xl p-6 text-center shadow-xl">
                <CardHeader>
                    <Lottie
                        animationData={tacoAnimation}
                        className="h-48"
                        loop
                    />
                    <CardTitle className="mt-2 text-3xl font-bold">
                        Bienvenido a Taco Time
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Sistema de pedidos eficiente, moderno y delicioso.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full">
                            <Link href="/login">Iniciar sesión</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
