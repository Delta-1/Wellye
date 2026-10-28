import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useApp } from "../lib/store";
import { Logo } from "./UI";
export default function Auth() {
  const { authenticate, explore } = useApp();
  const [mode, setMode] = useState("login");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await authenticate(mode, data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível conectar. Tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-story">
        <Logo />
        <div className="auth-story-content">
          <span className="pill">
            <span className="live-dot" /> APRENDER PODE SER MAIS LEVE
          </span>
          <h1>
            Seu estudo.
            <br />
            Seu ritmo.
            <br />
            <span>Seu futuro.</span>
          </h1>
          <p>
            Você não precisa dar conta de tudo hoje.
            <br />
            Só precisa dar o próximo passo.
          </p>
          <div className="auth-orbit">
            <div className="orbit-ring a" />
            <div className="orbit-ring b" />
            <div className="orbit-book">
              <BookOpen size={74} strokeWidth={1.2} />
              <Sparkles size={27} />
            </div>
            <span className="orbit-label one">
              <Target size={16} /> Um plano só seu
            </span>
            <span className="orbit-label two">
              <Check size={16} /> Um passo de cada vez
            </span>
          </div>
        </div>
        <small className="auth-foot">
          FEITO PARA O SEU JEITO DE APRENDER <span>✦</span>
        </small>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-mobile-logo">
          <Logo />
        </div>
        <div className="auth-form">
          <div className="form-kicker">
            <Sparkles size={16} /> SEU PRÓXIMO CAPÍTULO
          </div>
          <h2>
            {mode === "register"
              ? "Tudo começa com você."
              : mode === "recover"
                ? "Vamos recuperar seu acesso."
                : "Bom ter você por aqui."}
          </h2>
          <p>
            {mode === "register"
              ? "Crie sua conta e encontre um ritmo que funciona para você."
              : mode === "recover"
                ? "Use o código de recuperação que você guardou no cadastro."
                : "Entre para continuar construindo o seu futuro."}
          </p>
          {mode !== "recover" && (
            <div className="segmented">
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Entrar
              </button>
              <button
                className={mode === "register" ? "active" : ""}
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                Criar conta
              </button>
            </div>
          )}
          <form onSubmit={submit}>
            {mode === "register" && (
              <label>
                Como podemos chamar você?
                <div className="input-icon">
                  <Fingerprint size={18} />
                  <input
                    name="name"
                    placeholder="Seu nome"
                    required
                    minLength={2}
                    maxLength={60}
                    autoComplete="given-name"
                  />
                </div>
              </label>
            )}
            <label>
              E-mail
              <div className="input-icon">
                <Mail size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  required
                  autoComplete="email"
                  maxLength={254}
                />
              </div>
            </label>
            {mode === "recover" && (
              <label>
                Código de recuperação
                <div className="input-icon">
                  <ShieldCheck size={18} />
                  <input
                    name="recoveryCode"
                    placeholder="Código entregue no cadastro"
                    required
                    autoComplete="off"
                  />
                </div>
              </label>
            )}
            <label>
              {mode === "recover" ? "Nova senha" : "Senha"}
              <div className="input-icon">
                <LockKeyhole size={18} />
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  placeholder={
                    mode === "login" ? "Sua senha" : "Pelo menos 10 caracteres"
                  }
                  minLength={mode === "login" ? 1 : 10}
                  maxLength={72}
                  required
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
                <button
                  className="icon-button"
                  type="button"
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            {mode === "login" && (
              <button
                className="forgot"
                type="button"
                onClick={() => {
                  setMode("recover");
                  setError("");
                }}
              >
                Esqueci minha senha
              </button>
            )}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="button primary full" disabled={busy}>
              {busy
                ? "Conectando…"
                : mode === "register"
                  ? "Começar minha jornada"
                  : mode === "recover"
                    ? "Recuperar acesso"
                    : "Entrar na minha conta"}
              <ArrowRight size={18} />
            </button>
            {mode === "register" && (
              <p className="fineprint">
                Sua conta é exclusiva do Wellye. No cadastro, você receberá um
                código para recuperar sua senha. Guarde-o em um lugar seguro.
              </p>
            )}
          </form>
          {mode === "recover" ? (
            <button
              className="text-button center"
              onClick={() => setMode("login")}
            >
              Voltar para entrar
            </button>
          ) : (
            <>
              <div className="divider">
                <span>ou dê uma olhada primeiro</span>
              </div>
              <button className="button secondary full" onClick={explore}>
                Conhecer o Wellye
                <ArrowRight size={17} />
              </button>
              <p className="fineprint">
                Explore sem cadastro. Seu progresso fica neste dispositivo até
                você criar uma conta.
              </p>
            </>
          )}
          <div className="auth-trust">
            <ShieldCheck size={15} /> Seu espaço para aprender com
            tranquilidade.
          </div>
        </div>
      </div>
    </div>
  );
}
