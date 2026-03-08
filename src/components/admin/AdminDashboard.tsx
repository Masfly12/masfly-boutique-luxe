import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category_id: string;
  is_featured: boolean;
  is_active: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category_id: "",
  is_featured: false,
  is_active: true,
};

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price) || 0,
        category_id: form.category_id || null,
        is_featured: form.is_featured,
        is_active: form.is_active,
        ...(imageUrl && { image_url: imageUrl }),
      };

      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
      toast.success(editingId ? "Produit modifié !" : "Produit ajouté !");
      resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produit supprimé !");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setImageFile(null);
  };

  const startEdit = (product: any) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category_id: product.category_id || "",
      is_featured: product.is_featured,
      is_active: product.is_active,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Add button */}
      {!showForm && (
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="gradient-gold text-dark font-semibold hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-dark-card rounded-xl border border-gold/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              {editingId ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            <button onClick={resetForm}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nom du produit"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-dark border-gold/20"
            />
            <Input
              type="number"
              placeholder="Prix (FCFA)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="bg-dark border-gold/20"
            />
          </div>

          <Textarea
            placeholder="Description du produit"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="bg-dark border-gold/20"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={form.category_id}
              onValueChange={(v) => setForm({ ...form, category_id: v })}
            >
              <SelectTrigger className="bg-dark border-gold/20">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <label className="relative cursor-pointer bg-dark border border-gold/20 rounded-lg px-4 py-2 flex items-center gap-2 hover:border-gold/40 transition-colors">
                <Upload className="h-4 w-4 text-gold" />
                <span className="text-sm text-foreground">
                  {imageFile ? imageFile.name : "Image du produit"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="accent-gold"
              />
              Produit populaire
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="accent-gold"
              />
              Actif
            </label>
          </div>

          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!form.name || saveMutation.isPending}
            className="gradient-gold text-dark font-semibold hover:opacity-90"
          >
            {saveMutation.isPending ? "Enregistrement..." : editingId ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      )}

      {/* Products list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-dark-card rounded-xl h-20 animate-pulse border border-gold/5" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products?.map((p) => (
            <div
              key={p.id}
              className="bg-dark-card rounded-xl border border-gold/10 p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-muted flex-shrink-0">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold/20 text-2xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground truncate">{p.name}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="text-gold font-semibold">{p.price.toLocaleString("fr-FR")} FCFA</span>
                  <span>•</span>
                  <span>{(p.categories as any)?.name || "Sans catégorie"}</span>
                  {p.is_featured && <span className="text-gold">⭐</span>}
                  {!p.is_active && <span className="text-destructive">Inactif</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(p)}
                  className="p-2 rounded-lg hover:bg-gold/10 text-gold transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Supprimer ce produit ?")) deleteMutation.mutate(p.id);
                  }}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {products?.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Aucun produit. Cliquez sur "Ajouter un produit" pour commencer.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
