import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const CreateUserDialog = () => {
    const [open, setOpen] = useState(false);

    const { data, setData, post, reset } = useForm({
        name: "",
        email: "",
        password: "",
        role: "mesero",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.users.store"), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    useEffect(() => {
        if (open) {
            setData({
                name: "",
                email: "",
                password: "",
                role: "mesero",
            });
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Nuevo Usuario
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear usuario</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Nombre"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="bg-white"
                    />
                    <Input
                        placeholder="Correo"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="bg-white"
                    />
                    <Input
                        placeholder="Contraseña"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="bg-white"
                    />
                    <Select
                        value={data.role}
                        onValueChange={(value) => setData("role", value)}
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue
                                className="bg-white"
                                placeholder="Rol"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mesero">Mesero</SelectItem>
                            <SelectItem value="caja">Cajero</SelectItem>
                            {/*     <SelectItem value="admin">Admin</SelectItem> */}
                            {/*   <SelectItem value="ordenes">Órdenes</SelectItem> */}
                        </SelectContent>
                    </Select>
                    <Button type="submit" className="w-full">
                        Crear
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateUserDialog;
