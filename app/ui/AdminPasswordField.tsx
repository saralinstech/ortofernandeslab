"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminPasswordField({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <label>
      {label}
      <div className="admin-login-password">
        <input name="password" type={visible ? "text" : "password"} required autoComplete="current-password" />
        <button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Ocultar senha" : "Mostrar senha"}>
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </label>
  );
}
