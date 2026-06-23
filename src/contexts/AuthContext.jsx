import { createContext, useContext, useState } from "react";
import { verifyEditorPassword } from "../services/contentApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isEditor, setIsEditor] = useState(false);
  const [password, setPassword] = useState("");

  async function login(pw) {
    const ok = await verifyEditorPassword(pw);
    if (ok) {
      setIsEditor(true);
      setPassword(pw);
    }
    return ok;
  }

  function logout() {
    setIsEditor(false);
    setPassword("");
  }

  return (
    <AuthContext.Provider value={{ isEditor, password, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
