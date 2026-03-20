import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  avatar_url: string | null;
}

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient           = useQueryClient();

  const checkAdmin = useCallback(async (userId: string) => {
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    setIsAdmin(!error && Boolean(data));
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkAdmin(session.user.id);
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setIsAdmin(false);
          setProfile(null);
          setLoading(false);
          return;
        }
        Promise.all([
          checkAdmin(session.user.id),
          fetchProfile(session.user.id),
        ]).finally(() => setLoading(false));
      }
    );

    return () => subscription.unsubscribe();
  }, [checkAdmin, fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Mise à jour du profil avec le nom si fourni
    if (data.user && fullName) {
      await supabase.from("profiles").upsert({ id: data.user.id, full_name: fullName });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, "id">>) => {
    if (!user) throw new Error("Non connecté");
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...updates });
    if (error) throw error;
    await fetchProfile(user.id);
  };

  return { user, profile, loading, isAdmin, signIn, signUp, signOut, updateProfile };
}