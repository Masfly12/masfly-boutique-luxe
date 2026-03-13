import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadProductImage } from "@/hooks/useVendor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X, ImagePlus, Loader2, Package } from "lucide-react";
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

interface Props {
  vendorId: string;
  editProduct?: any;
  onClose: () => void;
}

export function VendorProductForm({ vendorId, editProduct, onClose }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<ProductForm>(
    editProduct
      ? {
          name: editProduct.name,
          description: editProduct.description || "",
          price: editProduct.price.toString(),
          category_id: editProduct.category_id || "",
          is_featured: editProduct.is_featured,
          is_active: editProduct.is_active,
        }
      : emptyForm
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price) || 0,
        category_id: form.category_id || null,
        is_featured: form.is_featured,
        is_active: form.is_active,
        vendor_id: vendorId,
      };

      let productId = editProduct?.id;

      if (editProduct) {
        const { error } = await supabase.from("products").update(payload).eq("id", editProduct.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        productId = data.id;
      }

      if (imageFiles.length > 0 && productId) {
        const { data: existing } = await supabase
          .from("product_images")
          .select("display_order")
          .eq("product_id", productId)
          .order("display_order", { ascending: false })
          .limit(1);

        let nextOrder = (existing?.[0]?.display_order ?? -1) + 1;

        for (const file of imageFiles) {
          const imageUrl = await uploadProductImage(file);
          await supabase.from("product_images").insert({
            product_id: productId,
            image_url: imageUrl,
            display_order: nextOrder++,
          });
        }

        if (!editProduct) {
          const { data: firstImg } = await supabase
            .from("product_images")
            .select("image_url")
            .eq("product_id", productId)
            .order("display_order")
            .limit(1)
            .single();
          if (firstImg) {
            await supabase.from("products").update({ image_url: firstImg.image_url }).eq("id", productId);
          }
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products", vendorId] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(editProduct ? "Produit modifié !" : "Produit ajouté !");
      onClose();
    },
    onError: (err: any) => toast.error(err.message),
    onSettled: () => setUploading(false),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const existingImages = editProduct?.product_images || [];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            {editProduct ? "Modifier le produit" : "Nouveau produit"}
          </h2>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nom + Prix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-body font-medium text-foreground">
            Nom du produit <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="Ex: Robe en wax, Téléphone Samsung..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-body font-medium text-foreground">
            Prix (FCFA) <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            placeholder="Ex: 15000"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            min="0"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-body font-medium text-foreground">Description</label>
        <Textarea
          placeholder="Décrivez votre produit : matière, taille, couleur disponible..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
      </div>

      {/* Catégorie */}
      <div className="space-y-1.5">
        <label className="text-sm font-body font-medium text-foreground">Catégorie</label>
        <Select
          value={form.category_id}
          onValueChange={(v) => setForm({ ...form, category_id: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <label className="text-sm font-body font-medium text-foreground">Photos du produit</label>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img: any) => (
              <div key={img.id} className="w-20 h-20 rounded-xl overflow-hidden border border-border">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* New image previews */}
        {imageFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {imageFiles.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-20 h-20 object-cover rounded-xl border border-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setImageFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-xl px-4 py-3 hover:border-primary transition-colors w-fit">
          <ImagePlus className="h-4 w-4 text-primary" />
          <span className="text-sm font-body text-foreground">Ajouter des photos</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
        </label>
      </div>

      {/* Options */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-body text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            className="accent-primary"
          />
          Mettre en vedette
        </label>
        <label className="flex items-center gap-2 text-sm font-body text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="accent-primary"
          />
          Produit actif
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={!form.name || !form.price || saveMutation.isPending || uploading}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold"
        >
          {(saveMutation.isPending || uploading) ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {uploading ? "Upload en cours..." : "Enregistrement..."}
            </span>
          ) : editProduct ? "Modifier le produit" : "Ajouter le produit"}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </div>
  );
}