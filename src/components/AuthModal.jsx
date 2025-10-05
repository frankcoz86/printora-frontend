import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthModal = ({ isOpen, onOpenChange, onAuthenticated }) => {
    const { signIn, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error } = await signIn({ email, password });
            if (error) throw error;
            toast({ title: "Accesso effettuato!", description: "Bentornato!" });
            onAuthenticated();
            onOpenChange(false);
        } catch (error) {
            setError(error.message || "Credenziali non valide. Riprova.");
            toast({ title: "Errore di accesso", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error } = await signUp({ email, password });
            if (error) throw error;
            toast({ title: "Registrazione completata!", description: "Controlla la tua email per confermare l'account." });
            onOpenChange(false);
        } catch (error) {
            setError(error.message || "Impossibile completare la registrazione.");
            toast({ title: "Errore di registrazione", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-cyan-300">Accedi o Registrati</DialogTitle>
                    <DialogDescription>
                        Per salvare i tuoi design e completare l'ordine, devi accedere al tuo account.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                        <TabsTrigger value="signin">Accedi</TabsTrigger>
                        <TabsTrigger value="signup">Registrati</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="signin-email">Email</Label>
                                <Input id="signin-email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-slate-800 border-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signin-password">Password</Label>
                                <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-slate-800 border-slate-600" />
                            </div>
                            {error && <p className="text-sm text-red-400">{error}</p>}
                            <DialogFooter>
                                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Accedi
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>
                    <TabsContent value="signup">
                        <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input id="signup-email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-slate-800 border-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" type="password" placeholder="Crea una password sicura" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-slate-800 border-slate-600" />
                            </div>
                            {error && <p className="text-sm text-red-400">{error}</p>}
                            <DialogFooter>
                                <Button type="submit" className="w-full bg-fuchsia-600 hover:bg-fuchsia-700" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Crea Account
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;