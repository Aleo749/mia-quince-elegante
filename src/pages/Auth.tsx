import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowLeft } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Verificar si ya está autenticado
    const isAuthenticated = localStorage.getItem("admin_authenticated") === "true";
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem("admin_authenticated", "true");
        toast({
          title: "¡Bienvenido!",
          description: "Sesión iniciada correctamente",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Error",
          description: "Contraseña incorrecta",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-primary hover:text-primary/80"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl text-primary mb-2">
            Bienvenida Mia
          </h1>
          <p className="font-body text-muted-foreground">
            Ingresa la contraseña para acceder al panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <Label htmlFor="password" className="text-foreground">
              Contraseña de Administración
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-primary-foreground font-medium"
          >
            {loading ? "Cargando..." : "Acceder"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
