import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { InsertUser } from "@shared/schema";

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
