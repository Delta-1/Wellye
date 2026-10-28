import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCheck,
  ChevronRight,
  GraduationCap,
  Headphones,
  Layers,
  Play,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { GoalType, LearnFormat, Subject } from "../lib/types";
export const goalLabels: Record<GoalType, string> = {
  escolar: "Provas escolares",
  enem: "ENEM",
  vestibular: "Vestibulares",
  concurso: "Concursos públicos",
  outros: "Outro objetivo",
};
export function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className={`logo ${small ? "small" : ""}`}>
      <span className="logo-mark">
        w<span />
      </span>
      {!small && (
        <span>
          Wellye<span className="logo-dot">.</span>
        </span>
      )}
    </span>
  );
}
export function SubjectIcon({
  subject,
  size = 19,
}: {
  subject: string;
  size?: number;
}) {
  const Icon =
    subject === "Matemática"
      ? Target
      : subject === "Ciências da Natureza"
        ? Sparkles
        : subject === "Informática"
          ? Layers
          : subject === "Ciências Humanas"
            ? GraduationCap
            : BookOpen;
  return <Icon size={size} />;
}
export function FormatIcon({
  kind,
  size = 17,
}: {
  kind: LearnFormat;
  size?: number;
}) {
  const Icon =
    kind === "Áudio"
      ? Headphones
      : kind === "Vídeo"
        ? Play
        : kind === "Exercícios"
          ? CheckCheck
          : kind === "Mapa mental"
            ? Layers
            : BookOpen;
  return <Icon size={size} />;
}
export function Tag({
  children,
  color = "purple",
}: {
  children: ReactNode;
  color?: string;
}) {
  return <span className={`tag ${color}`}>{children}</span>;
}
export function Modal({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") close.current();
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled),a[href],input,select,textarea,[tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
      >
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" aria-label="Fechar" onClick={onClose}>
            <X size={21} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function Empty({
  icon: Icon = BookOpen,
  title,
  children,
  action,
}: {
  icon?: typeof BookOpen;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon size={27} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
export function Donut({
  value,
  total = 0,
  size = 128,
}: {
  value: number;
  total?: number;
  size?: number;
}) {
  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="track" cx="60" cy="60" r="49" />
        <circle
          className="value"
          cx="60"
          cy="60"
          r="49"
          strokeDasharray={`${value * 3.079} 307.9`}
        />
      </svg>
      <span>
        <strong>{total ? `${value}%` : "—"}</strong>
        <small>{total ? "aproveitamento" : "seu começo"}</small>
      </span>
    </div>
  );
}
export function ArrowLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="text-button" onClick={onClick}>
      {children}
      <ArrowUpRight size={15} />
    </button>
  );
}
export function CheckRow({
  checked,
  children,
  onClick,
}: {
  checked: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="check-row" onClick={onClick} aria-pressed={checked}>
      <span className={`checkbox ${checked ? "checked" : ""}`}>
        {checked && <Check size={13} />}
      </span>
      {children}
      <ChevronRight size={16} />
    </button>
  );
}
export const subjectColors: Record<Subject, string> = {
  "Língua Portuguesa": "purple",
  Matemática: "orange",
  "Ciências da Natureza": "green",
  "Ciências Humanas": "blue",
  Informática: "blue",
  "Conhecimentos Específicos": "pink",
};
