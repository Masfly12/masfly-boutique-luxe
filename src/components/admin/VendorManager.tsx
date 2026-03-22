import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CheckCircle, XCircle, Clock, Store, Mail,
  CreditCard, Loader2, MessageCircle, Eye,
} from "lucide-react";

const GOLD = "#C9A84C";

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  unpaid:                { label: "Non payé",            color: "#EF4444" },
  pending_verification:  { label: "Paiement à vérifier", color: "#EAB308" },
  paid:                  { label: "Payé",                color: "#22C55E" },
};

const APPROVAL_STATUS: Record<string, { label: string; color: string }> = {
  pending:  { label: "En attente", color: "#EAB308" },
  approved: { label: "Approuvé",   color: "#22C55E" },
  rejected: { label: "Rejeté",     color: "#EF4444" },
};

export function VendorManager() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [rejectNote, setRejectNote] = useState("");

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["admin-vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*, user_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (vendor: any) => {
      const { error } = await supabase.rpc("admin_approve_vendor_payment", {
        _vendor_id: vendor.id,
        _amount: paymentAmount ? parseFloat(paymentAmount) : null,
        _reference: paymentRef || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vendors"] });
      setSelectedVendor(null);
      setPaymentRef("");
      setPaymentAmount("");
      toast.success("Vendeur approuvé et activé !");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const rejectMutation = useMutation({
    mutationFn: async (vendor: any) => {
      const { error } = await supabase.rpc("reject_vendor", {
        _vendor_id: vendor.id,
        _note: rejectNote || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vendors"] });
      setSelectedVendor(null);
      setRejectNote("");
      toast.success("Vendeur rejeté.");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const filtered = vendors?.filter((v: any) => {
    if (filter === "all") return true;
    return v.approval_status === filter;
  });

  const counts = {
    all:      vendors?.length ?? 0,
    pending:  vendors?.filter((v: any) => v.approval_status === "pending").length ?? 0,
    approved: vendors?.filter((v: any) => v.approval_status === "approved").length ?? 0,
    rejected: vendors?.filter((v: any) => v.approval_status === "rejected").length ?? 0,
  };

  return (
    <div className="space-y-4">

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="font-body text-[10px] tracking-[0.2em] uppercase px-4 py-2 transition-all duration-200 border"
            style={{
              background: filter === f ? GOLD : "var(--card)",
              color: filter === f ? "#0a0a0a" : "var(--muted-foreground)",
              borderColor: filter === f ? GOLD : "var(--border)",
            }}
          >
            {f === "all" ? "Tous" : f === "pending" ? "En attente" : f === "approved" ? "Approuvés" : "Rejetés"}
            {" "}({counts[f]})
          </button>
        ))}
      </div>

      {/* Liste */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: GOLD }} />
        </div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-12 border border-border" style={{ background: "var(--card)" }}>
          <Store className="h-8 w-8 mx-auto mb-3" style={{ color: `rgba(201,168,76,0.3)` }} />
          <p className="text-xs font-body text-muted-foreground tracking-wide">Aucun vendeur dans cette catégorie</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered?.map((vendor: any) => {
            const payStatus = PAYMENT_STATUS[vendor.payment_status] ?? PAYMENT_STATUS.unpaid;
            const appStatus = APPROVAL_STATUS[vendor.approval_status] ?? APPROVAL_STATUS.pending;
            return (
              <div
                key={vendor.id}
                className="border border-border p-4 transition-all duration-200"
                style={{ background: "var(--card)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar boutique */}
                    {vendor.logo_url ? (
                      <img src={vendor.logo_url} alt="" className="w-10 h-10 object-cover border border-border flex-shrink-0" />
                    ) : (
                      <div
                        className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                        style={{ border: `1px solid rgba(201,168,76,0.2)`, background: "#0a0a0a" }}
                      >
                        <Store className="h-4 w-4" style={{ color: `rgba(201,168,76,0.5)` }} />
                      </div>
                    )}
                    <div>
                      <p className="font-body text-sm font-medium text-foreground tracking-wide">
                        {vendor.shop_name || vendor.name || "Sans nom"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p className="text-[10px] text-muted-foreground font-body">
                          {vendor.user_id?.slice(0, 8)}...
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-body mt-0.5">
                        Inscrit le {new Date(vendor.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  {/* Badges statuts */}
                  <div className="flex flex-col gap-1.5 items-end shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: payStatus.color }} />
                      <span className="text-[9px] font-body tracking-[0.1em] uppercase" style={{ color: payStatus.color }}>
                        {payStatus.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: appStatus.color }} />
                      <span className="text-[9px] font-body tracking-[0.1em] uppercase" style={{ color: appStatus.color }}>
                        {appStatus.label}
                      </span>
                    </div>
                    {vendor.payment_reference && (
                      <span className="text-[9px] font-mono text-muted-foreground">
                        Réf: {vendor.payment_reference}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {(vendor.shop_description || vendor.description) && (
                  <p className="text-[11px] text-muted-foreground font-body mt-3 leading-relaxed line-clamp-2">
                    {vendor.shop_description || vendor.description}
                  </p>
                )}

                {/* Actions */}
                {vendor.approval_status !== "approved" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className="flex-1 flex items-center justify-center gap-1.5 font-body text-[10px] tracking-[0.15em] uppercase py-2 transition-all duration-200 hover:opacity-90"
                      style={{ background: GOLD, color: "#0a0a0a" }}
                    >
                      <CheckCircle className="h-3 w-3" />
                      Approuver
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVendor({ ...vendor, action: "reject" });
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 font-body text-[10px] tracking-[0.15em] uppercase py-2 transition-all duration-200 border border-destructive text-destructive hover:bg-destructive/5"
                    >
                      <XCircle className="h-3 w-3" />
                      Rejeter
                    </button>
                    {vendor.whatsapp && (
                      <a
                        href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 font-body text-[10px] tracking-[0.15em] uppercase py-2 px-3 transition-all border border-border text-muted-foreground hover:text-foreground"
                      >
                        <MessageCircle className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal approbation ── */}
      {selectedVendor && selectedVendor.action !== "reject" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelectedVendor(null)}
        >
          <div
            className="w-full max-w-md border border-border p-6 space-y-4"
            style={{ background: "var(--background)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-4" style={{ background: GOLD }} />
              <p className="text-[9px] font-body tracking-[0.3em] uppercase" style={{ color: GOLD }}>
                Approuver le vendeur
              </p>
            </div>
            <p className="font-body text-sm text-foreground">
              Boutique : <strong>{selectedVendor.shop_name || selectedVendor.name}</strong>
            </p>

            <div className="space-y-2">
              <label className="text-[9px] font-body tracking-[0.25em] uppercase text-muted-foreground">
                Montant reçu (FCFA)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Ex: 5000"
                className="w-full h-10 px-3 text-sm border border-border bg-background focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-body tracking-[0.25em] uppercase text-muted-foreground">
                Référence de paiement
              </label>
              <input
                type="text"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="Ex: TXN-2025-XXXXX"
                className="w-full h-10 px-3 text-sm border border-border bg-background focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => approveMutation.mutate(selectedVendor)}
                disabled={approveMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase py-3 transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: GOLD, color: "#0a0a0a" }}
              >
                {approveMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                Confirmer l'approbation
              </button>
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-5 font-body text-[10px] tracking-[0.2em] uppercase border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal rejet ── */}
      {selectedVendor?.action === "reject" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelectedVendor(null)}
        >
          <div
            className="w-full max-w-md border border-border p-6 space-y-4"
            style={{ background: "var(--background)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-4" style={{ background: "#EF4444" }} />
              <p className="text-[9px] font-body tracking-[0.3em] uppercase text-destructive">
                Rejeter le vendeur
              </p>
            </div>
            <p className="font-body text-sm text-foreground">
              Boutique : <strong>{selectedVendor.shop_name || selectedVendor.name}</strong>
            </p>

            <div className="space-y-2">
              <label className="text-[9px] font-body tracking-[0.25em] uppercase text-muted-foreground">
                Motif du rejet (optionnel)
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Ex: Informations insuffisantes..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-border bg-background resize-none focus:outline-none focus:border-destructive"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => rejectMutation.mutate(selectedVendor)}
                disabled={rejectMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase py-3 transition-all bg-destructive text-white hover:opacity-90 disabled:opacity-50"
              >
                {rejectMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                Confirmer le rejet
              </button>
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-5 font-body text-[10px] tracking-[0.2em] uppercase border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}