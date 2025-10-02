import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Helmet } from "react-helmet-async";

export function SignIn(){
    return (
        <>
            <Helmet title="Login"/>
            <div className="p-8 flex flex-col items-center">
                <div className="flex w-[350px] flex-col justify-center gap-6 itemc">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Acessar Painel
                        </h1>
                        <p className="text-sm text-muted-foreground">Acompanhe suas vendas pelo painel do parceiro!</p>
                    </div>

                    <form action="" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Seu e-mail</Label>
                            <Input id="email" type="email"/>
                        </div>

                        <Button className="w-full" type="submit">Acessar Painel</Button>
                    </form>
                </div>
            </div>
        </>
    )
}