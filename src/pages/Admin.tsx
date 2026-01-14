import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Users, LogOut, Volume2, VolumeX, Trash2 } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

interface Guest {
  id: string;
  group_id: string;
  first_name: string;
  last_name: string;
  attending: boolean;
  table_number: number | null;
  whatsapp_number: string | null;
  created_at: string;
}

interface Group {
  id: string;
  phone_number: string | null;
  guests: Guest[];
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPlaying, toggle, pause } = useAudio();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = localStorage.getItem("admin_authenticated") === "true";
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    // Pausar música automáticamente en el admin
    pause();

    fetchGroups();
  }, [navigate, pause]);

  const fetchGroups = async () => {
    try {
      console.log("🔍 Iniciando carga de invitados...");
      console.log("🔧 RLS desactivado - usando consultas directas");
      
      // Usar consultas separadas (más confiables cuando RLS está desactivado)
      console.log("📥 Cargando grupos...");
      const { data: groupsData, error: groupsError } = await supabase
        .from("rsvp_groups")
        .select("*")
        .order("created_at", { ascending: false });

      if (groupsError) {
        console.error("❌ Error al cargar grupos:", groupsError);
        throw groupsError;
      }

      console.log("✅ Grupos cargados:", groupsData?.length || 0, groupsData);

      console.log("📥 Cargando invitados...");
      
      // Intentar primero con la función de base de datos
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_guests_with_groups');

      let guestsData: any[] | null = null;
      let guestsError: any = null;

      if (functionError || !functionData || functionData.length === 0) {
        console.log("⚠️ Función no disponible o sin datos, usando consulta directa...");
        console.log("Error de función:", functionError);
        
        // Fallback: consulta directa
        const result = await supabase
          .from("rsvp_guests")
          .select("*", { count: 'exact' })
          .order("created_at", { ascending: false });

        guestsData = result.data;
        guestsError = result.error;
        
        console.log("📊 Count de invitados (directa):", result.count);
        console.log("📊 Data de invitados (directa):", guestsData);
      } else {
        console.log("✅ Usando función de base de datos");
        // Transformar datos de la función al formato esperado
        guestsData = functionData.map((item: any) => ({
          id: item.guest_id,
          group_id: item.group_id,
          first_name: item.first_name,
          last_name: item.last_name,
          attending: item.attending,
          table_number: item.table_number,
          whatsapp_number: item.whatsapp_number,
          created_at: item.created_at,
          _group_phone: item.group_phone_number, // Guardar teléfono del grupo
        }));
      }

      if (guestsError) {
        console.error("❌ Error al cargar invitados:", guestsError);
        console.error("❌ Detalles del error:", {
          message: guestsError.message,
          details: guestsError.details,
          hint: guestsError.hint,
          code: guestsError.code,
        });
        throw guestsError;
      }

      console.log("✅ Invitados cargados:", guestsData?.length || 0, guestsData);

      // Verificar que tenemos datos
      if (!groupsData || groupsData.length === 0) {
        console.log("⚠️ No se encontraron grupos");
        setGroups([]);
        return;
      }

      if (!guestsData || guestsData.length === 0) {
        console.log("⚠️ No se encontraron invitados");
        setGroups([]);
        return;
      }

      // Agrupar invitados por group_id
      const groupedData: Group[] = (groupsData || []).map(group => {
        const groupGuests = (guestsData || []).filter(guest => guest.group_id === group.id);
        return {
          id: group.id,
          phone_number: group.phone_number,
          guests: groupGuests.map(guest => ({
            id: guest.id,
            group_id: guest.group_id,
            first_name: guest.first_name,
            last_name: guest.last_name,
            attending: guest.attending,
            table_number: guest.table_number,
            whatsapp_number: guest.whatsapp_number || guest._group_phone || null,
            created_at: guest.created_at,
          })),
        };
      });

      // Filtrar grupos que no tienen invitados
      const groupsWithGuests = groupedData.filter(group => group.guests.length > 0);

      console.log("✅ Grupos procesados:", groupsWithGuests.length);
      console.log("📊 Total de invitados:", groupsWithGuests.reduce((sum, g) => sum + g.guests.length, 0));
      console.log("📋 Datos completos:", groupsWithGuests);

      setGroups(groupsWithGuests);
    } catch (error: any) {
      console.error("❌ Error completo:", error);
      console.error("❌ Detalles del error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      toast({
        title: "Error al cargar invitados",
        description: error.message || "No se pudieron cargar los invitados. Revisa la consola para más detalles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    navigate("/auth");
  };

  const handleDeleteClick = (guest: Guest) => {
    setGuestToDelete({
      id: guest.id,
      name: `${guest.first_name} ${guest.last_name}`,
    });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!guestToDelete) return;

    try {
      console.log("🗑️ Intentando eliminar invitado:", guestToDelete);
      console.log("🔍 ID del invitado:", guestToDelete.id);
      
      // Intentar primero con la función de base de datos (más confiable)
      const { data: functionData, error: functionError } = await supabase
        .rpc('delete_guest', { guest_id_to_delete: guestToDelete.id });

      console.log("📊 Resultado de función de eliminación:", { functionData, functionError });

      if (functionError) {
        console.warn("⚠️ Función no disponible, intentando eliminación directa...");
        console.log("Error de función:", functionError);
        
        // Fallback: eliminación directa
        const { data, error } = await supabase
          .from("rsvp_guests")
          .delete()
          .eq("id", guestToDelete.id)
          .select();

        console.log("📊 Resultado de eliminación directa:", { data, error });

        if (error) {
          console.error("❌ Error al eliminar:", error);
          console.error("❌ Detalles completos:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          throw error;
        }

        if (!data || data.length === 0) {
          toast({
            title: "Error",
            description: "No se encontró el invitado para eliminar o ya fue eliminado",
            variant: "destructive",
          });
          return;
        }

        console.log("✅ Invitado eliminado correctamente (directa), datos eliminados:", data);
      } else {
        // La función se ejecutó correctamente
        if (!functionData || functionData.length === 0) {
          toast({
            title: "Error",
            description: "No se encontró el invitado para eliminar o ya fue eliminado",
            variant: "destructive",
          });
          return;
        }

        console.log("✅ Invitado eliminado correctamente (función), datos eliminados:", functionData);
      }
      
      // Recargar los datos
      await fetchGroups();
      
      toast({
        title: "Invitado eliminado",
        description: `${guestToDelete.name} ha sido eliminado correctamente`,
      });
    } catch (error: any) {
      console.error("❌ Error completo al eliminar:", error);
      console.error("❌ Detalles:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      toast({
        title: "Error",
        description: error.message || error.details || "No se pudo eliminar el invitado. Revisa la consola para más detalles.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setGuestToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    
    return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
  };

  const totalGuests = groups.reduce((sum, group) => sum + group.guests.length, 0);
  const attendingCount = groups.reduce(
    (sum, group) => sum + group.guests.filter(g => g.attending).length,
    0
  );
  const notAttendingCount = totalGuests - attendingCount;

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
              Bienvenida Mia
            </h1>
            <p className="text-muted-foreground font-body">
              XV Años de Mia Valentina
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={toggle}
              className="border-primary/50 text-primary hover:bg-primary/10"
              title={isPlaying ? "Silenciar música" : "Reproducir música"}
            >
              {isPlaying ? (
                <Volume2 className="w-4 h-4 mr-2" />
              ) : (
                <VolumeX className="w-4 h-4 mr-2" />
              )}
              {isPlaying ? "Silenciar" : "Reproducir"}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-display text-3xl text-foreground">{totalGuests}</p>
            <p className="font-body text-sm text-muted-foreground">Total Invitados</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-display text-3xl text-foreground">{attendingCount}</p>
            <p className="font-body text-sm text-muted-foreground">Confirmados</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="font-display text-3xl text-foreground">{notAttendingCount}</p>
            <p className="font-body text-sm text-muted-foreground">No Asisten</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-white border-b border-gray-300">
                <TableHead className="text-gray-900 font-semibold py-3 px-4 border-r border-gray-300">Nombre</TableHead>
                <TableHead className="text-gray-900 font-semibold py-3 px-4 border-r border-gray-300">Apellido</TableHead>
                <TableHead className="text-gray-900 font-semibold py-3 px-4 border-r border-gray-300">Teléfono</TableHead>
                <TableHead className="text-gray-900 font-semibold py-3 px-4 border-r border-gray-300">Fecha de Registro</TableHead>
                <TableHead className="text-gray-900 font-semibold py-3 px-4 text-center w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group, groupIndex) => {
                if (group.guests.length === 0) return null;
                
                const phoneNumber = group.phone_number || group.guests[0]?.whatsapp_number || "—";
                const isLastGroup = groupIndex === groups.length - 1;
                
                return group.guests.map((guest, index) => {
                  const isFirstInGroup = index === 0;
                  const isLastInGroup = index === group.guests.length - 1;
                  
                  return (
                    <TableRow 
                      key={guest.id} 
                      className={`
                        bg-white border-b border-gray-300
                        ${isFirstInGroup && !isLastGroup ? 'border-b-2 border-gray-400' : ''}
                        ${isLastInGroup && !isLastGroup ? 'border-b-2 border-gray-400' : ''}
                      `}
                    >
                      <TableCell className="text-gray-900 font-medium py-3 px-4 border-r border-gray-300">
                        {guest.first_name}
                      </TableCell>
                      <TableCell className="text-gray-900 py-3 px-4 border-r border-gray-300">
                        {guest.last_name}
                      </TableCell>
                      {isFirstInGroup ? (
                        <TableCell 
                          className="text-gray-900 align-top py-3 px-4 font-mono text-sm border-r border-gray-300"
                          rowSpan={group.guests.length}
                        >
                          {phoneNumber}
                        </TableCell>
                      ) : null}
                      <TableCell className="text-gray-900 py-3 px-4 border-r border-gray-300 text-sm">
                        {formatDate(guest.created_at)}
                      </TableCell>
                      <TableCell className="text-center py-3 px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(guest)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Eliminar invitado"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                });
              })}
              {groups.length === 0 || groups.every(g => g.guests.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-12 border-r border-gray-300">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-12 h-12 text-gray-400" />
                      <p className="text-lg">No hay invitados registrados</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar invitado?</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas eliminar a <strong>{guestToDelete?.name}</strong>? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
