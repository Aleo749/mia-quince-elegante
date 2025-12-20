import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Check, X, LogOut, Save, Trash2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

interface Guest {
  id: string;
  group_id: string;
  first_name: string;
  last_name: string;
  attending: boolean;
  table_number: number | null;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [editingTable, setEditingTable] = useState<{ id: string; value: string } | null>(null);
  const [filter, setFilter] = useState<"all" | "attending" | "not-attending">("all");

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        fetchGuests();
      }
      setLoading(false);
    });
  }, [navigate]);

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from("rsvp_guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los invitados",
        variant: "destructive",
      });
    } else {
      setGuests(data || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const updateTableNumber = async (guestId: string, tableNumber: number | null) => {
    const { error } = await supabase
      .from("rsvp_guests")
      .update({ table_number: tableNumber })
      .eq("id", guestId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la mesa",
        variant: "destructive",
      });
    } else {
      setGuests(guests.map(g =>
        g.id === guestId ? { ...g, table_number: tableNumber } : g
      ));
      setEditingTable(null);
      toast({
        title: "Actualizado",
        description: "Número de mesa actualizado",
      });
    }
  };

  const deleteGuest = async (guestId: string) => {
    const { error } = await supabase
      .from("rsvp_guests")
      .delete()
      .eq("id", guestId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el invitado",
        variant: "destructive",
      });
    } else {
      setGuests(guests.filter(g => g.id !== guestId));
      toast({
        title: "Eliminado",
        description: "Invitado eliminado correctamente",
      });
    }
  };

  const filteredGuests = guests.filter(guest => {
    if (filter === "attending") return guest.attending;
    if (filter === "not-attending") return !guest.attending;
    return true;
  });

  const attendingCount = guests.filter(g => g.attending).length;
  const notAttendingCount = guests.filter(g => !g.attending).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-primary">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground font-body">
              XV Años de Mia Fioquetti
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-display text-3xl text-foreground">{guests.length}</p>
            <p className="font-body text-sm text-muted-foreground">Total Invitados</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-display text-3xl text-foreground">{attendingCount}</p>
            <p className="font-body text-sm text-muted-foreground">Confirmados</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <X className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="font-display text-3xl text-foreground">{notAttendingCount}</p>
            <p className="font-body text-sm text-muted-foreground">No Asisten</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={filter === "attending" ? "default" : "outline"}
            onClick={() => setFilter("attending")}
            size="sm"
          >
            Asisten
          </Button>
          <Button
            variant={filter === "not-attending" ? "default" : "outline"}
            onClick={() => setFilter("not-attending")}
            size="sm"
          >
            No Asisten
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-foreground">Nombre</TableHead>
                <TableHead className="text-foreground">Apellido</TableHead>
                <TableHead className="text-foreground">Asiste</TableHead>
                <TableHead className="text-foreground">Mesa</TableHead>
                <TableHead className="text-foreground">Fecha</TableHead>
                <TableHead className="text-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id} className="border-border">
                  <TableCell className="text-foreground font-medium">
                    {guest.first_name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {guest.last_name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={guest.attending ? "default" : "destructive"}
                      className={guest.attending ? "bg-green-500/20 text-green-500" : ""}
                    >
                      {guest.attending ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editingTable?.id === guest.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editingTable.value}
                          onChange={(e) => setEditingTable({ id: guest.id, value: e.target.value })}
                          className="w-16 h-8 bg-input border-border text-foreground"
                          min="1"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => updateTableNumber(guest.id, editingTable.value ? parseInt(editingTable.value) : null)}
                          className="h-8 w-8"
                        >
                          <Save className="w-4 h-4 text-primary" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTable({ id: guest.id, value: guest.table_number?.toString() || "" })}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {guest.table_number || "—"}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(guest.created_at).toLocaleDateString("es-AR")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteGuest(guest.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredGuests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No hay invitados registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Back to invitation */}
        <div className="mt-8 text-center">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="text-primary"
          >
            ← Volver a la invitación
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
