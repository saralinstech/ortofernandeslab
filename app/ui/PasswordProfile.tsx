"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, LogOut, ShieldCheck } from "lucide-react";

export default function PasswordProfile({ name, email, forced }: { name: string; email: string; forced: boolean }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (newPassword !== confirmation) return setError("A confirmação não corresponde à nova senha.");
    setSaving(true);
    const response = await fetch("/api/profile-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmation }),
    });
    const result = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) return setError(result.error || "Não foi possível alterar a senha.");
    setMessage("Senha pessoal criada com segurança. Entrando no painel...");
    window.setTimeout(() => window.location.assign("/admin"), 900);
  };

  return <main className="password-profile-page"><section className="password-profile-card">
    <header className="password-profile-brand"><img src="/logo-orto.jpg" alt="Logo do Laboratório Orto Fernandes"/><div><b>Orto Fernandes</b><span>Área administrativa</span></div></header>
    <div className={`password-profile-alert ${forced ? "required" : "regular"}`}><ShieldCheck/><div><b>{forced ? "Crie sua senha pessoal" : "Altere sua senha"}</b><p>{forced ? "Você entrou com uma senha temporária. Para proteger o seu acesso, crie uma nova senha antes de continuar." : "Atualize sua senha sempre que achar necessário."}</p></div></div>
    <div className="password-profile-user"><span>{name.slice(0, 2).toUpperCase()}</span><div><b>{name}</b><small>{email}</small></div></div>
    <form onSubmit={submit}>
      <label>Senha atual ou temporária<div className="password-input"><input type={showPasswords ? "text" : "password"} autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)}/><KeyRound/></div></label>
      <label>Nova senha<div className="password-input"><input type={showPasswords ? "text" : "password"} autoComplete="new-password" minLength={12} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)}/><KeyRound/></div></label>
      <label>Confirme a nova senha<div className="password-input"><input type={showPasswords ? "text" : "password"} autoComplete="new-password" minLength={12} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)}/><KeyRound/></div></label>
      <button className="show-passwords" type="button" onClick={() => setShowPasswords((value) => !value)}>{showPasswords ? <EyeOff/> : <Eye/>}{showPasswords ? "Ocultar senhas" : "Mostrar senhas"}</button>
      <div className="password-rules"><b>Sua nova senha precisa ter:</b><span><Check/>12 ou mais caracteres</span><span><Check/>Letra maiúscula e minúscula</span><span><Check/>Número e símbolo</span></div>
      {error && <p className="password-feedback error">{error}</p>}
      {message && <p className="password-feedback success">{message}</p>}
      <button className="password-save" disabled={saving}>{saving ? "Salvando..." : forced ? "Criar senha e entrar" : "Salvar nova senha"}</button>
    </form>
    <footer>{!forced && <Link href="/admin"><ArrowLeft/>Voltar ao painel</Link>}<a href="/api/admin-logout"><LogOut/>Sair da conta</a></footer>
  </section></main>;
}
