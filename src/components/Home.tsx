import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Headphones,
  Layers,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useApp } from "../lib/store";
import { accuracy, dayKey, plan, streak, weekly } from "../lib/study";
import type { Activity, Page } from "../lib/types";
import {
  ArrowLink,
  Donut,
  FormatIcon,
  Progress,
  SectionHead,
  SubjectIcon,
  Tag,
  subjectColors,
} from "./UI";
import type { QuizConfig } from "./Quiz";
export default function Home({
  navigate,
  startQuiz,
  openActivity,
}: {
  navigate: (p: Page) => void;
  startQuiz: (q: QuizConfig) => void;
  openActivity: (a: Activity) => void;
}) {
  const { state } = useApp();
  const activities = plan(state);
  const completed = state.completions[dayKey()] ?? [];
  const done = activities.filter((a) => completed.includes(a.id)).length;
  const goal = state.goals.find((g) => g.active);
  const total = state.answers.length;
  const week = weekly(state);
  const minutes = state.studyMinutes[dayKey()] ?? 0;
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  return (
    <div className="page home-page">
      <div className="page-greeting">
        <div>
          <p className="eyebrow">UM NOVO DIA, NOVAS POSSIBILIDADES</p>
          <h1>
            {greeting}, {state.profile.name.split(" ")[0]}
            <span className="greeting-spark"> ✦</span>
          </h1>
          <p>Um pouquinho hoje faz toda a diferença amanhã.</p>
        </div>
        <div className="date-label">
          <span>
            {new Date().toLocaleDateString("pt-BR", { weekday: "long" })}
          </span>
          <strong>
            {new Date().toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
            })}
          </strong>
        </div>
      </div>
      <div className="hero-grid">
        <section className="welcome-card">
          <div className="welcome-content">
            <span className="pill">
              <Sparkles size={13} /> SEU PLANO. SEU TEMPO.
            </span>
            <h2>
              O seu futuro começa
              <br />
              com um passo <em>hoje.</em>
            </h2>
            <p>
              {done === activities.length
                ? "Seu plano de hoje está completo. Que tal uma revisão leve?"
                : `Você tem um plano de ${state.profile.minutes} minutos feito para o seu ritmo. Vamos nessa?`}
            </p>
            <button
              className="button cream"
              onClick={() =>
                !state.profile.diagnosticDone
                  ? startQuiz({ kind: "diagnostic", count: 5 })
                  : openActivity(
                      activities.find((a) => !completed.includes(a.id)) ??
                        activities[0],
                    )
              }
            >
              {state.profile.diagnosticDone
                ? "Continuar meus estudos"
                : "Descobrir meu ponto de partida"}
              <ArrowRight size={17} />
            </button>
            <div className="hero-foot">
              <span className="tiny-avatar">
                <Check size={10} />
              </span>{" "}
              Pequenos passos também são progresso.
            </div>
          </div>
          <div className="learning-art" aria-hidden="true">
            <div className="art-orbit one" />
            <div className="art-orbit two" />
            <span className="art-star s1">✦</span>
            <span className="art-star s2">✧</span>
            <span className="art-star s3">✦</span>
            <div className="art-book">
              <BookOpen size={90} strokeWidth={1.1} />
              <span className="book-glow" />
            </div>
            <div className="art-chip top">
              <Sparkles size={14} /> Do seu jeito
            </div>
            <div className="art-chip bottom">
              <Check size={14} /> Você consegue
            </div>
            <span className="art-dot" />
          </div>
        </section>
        <section className="card daily-card">
          <div className="card-kicker">
            <span>SEU RITMO HOJE</span>
            <Clock3 size={17} />
          </div>
          <div className="daily-ring">
            <Donut
              value={Math.min(
                100,
                Math.round((minutes / state.profile.minutes) * 100),
              )}
              total={minutes ? 1 : 0}
              size={126}
            />
            <div>
              <strong>
                {minutes}
                <small> / {state.profile.minutes} min</small>
              </strong>
              <p>dedicados a você</p>
              <Tag color="green">
                {done === activities.length
                  ? "Plano concluído"
                  : "Um passo de cada vez"}
              </Tag>
            </div>
          </div>
          <div className="daily-bottom">
            <span>
              {done} de {activities.length} atividades concluídas
            </span>
            <span>{Math.round((done / activities.length) * 100)}%</span>
          </div>
          <Progress value={(done / activities.length) * 100} />
        </section>
      </div>
      <div className="stat-grid">
        <Stat
          icon={BookOpen}
          value={String(total)}
          label="questões respondidas"
          color="purple"
        />
        <Stat
          icon={Target}
          value={total ? `${accuracy(state)}%` : "—"}
          label="aproveitamento geral"
          color="green"
        />
        <Stat
          icon={Trophy}
          value={String(
            state.quizzes.filter((q) => q.kind === "simulation").length,
          )}
          label="simulados concluídos"
          color="orange"
        />
        <Stat
          icon={Flame}
          value={String(streak(state))}
          label={
            streak(state) === 1 ? "dia de constância" : "dias de constância"
          }
          color="pink"
        />
      </div>
      <div className="dashboard-columns">
        <section className="card plan-card">
          <SectionHead eyebrow="FEITO PARA VOCÊ" title="Seu plano de hoje">
            <ArrowLink onClick={() => navigate("study")}>Ver plano</ArrowLink>
          </SectionHead>
          <div className="plan-meta">
            <span>
              <Clock3 size={14} />
              {state.profile.minutes} minutos · {activities.length} atividades
            </span>
            <Tag color="green">No seu ritmo</Tag>
          </div>
          <div className="activity-list">
            {activities.map((a, i) => (
              <button
                key={a.id}
                className={`activity ${completed.includes(a.id) ? "done" : ""}`}
                onClick={() => openActivity(a)}
              >
                <span
                  className={`activity-number ${completed.includes(a.id) ? "checked" : ""}`}
                >
                  {completed.includes(a.id) ? (
                    <Check size={18} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span className="activity-content">
                  <strong>{a.subject}</strong>
                  <small>{a.topic}</small>
                  <span>
                    <FormatIcon kind={a.kind} size={12} />
                    {a.kind}
                    <i>·</i>
                    {a.minutes} min
                  </span>
                </span>
                <span className={`subject-badge ${subjectColors[a.subject]}`}>
                  <SubjectIcon subject={a.subject} />
                </span>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
          <div className="plan-note">
            <Sparkles size={14} />
            {state.answers.length
              ? "Ajustado com base nas suas respostas e preferências."
              : "Seu plano fica mais preciso a cada questão respondida."}
          </div>
        </section>
        <section className="card evolution-card">
          <SectionHead eyebrow="CADA PASSO CONTA" title="Sua evolução">
            <Tag>7 dias</Tag>
          </SectionHead>
          <div className="chart-overview">
            <strong>
              {week.reduce((s, d) => s + d.answers, 0)}
              <small>questões na semana</small>
            </strong>
            <span className="chart-legend">
              <i /> Questões respondidas
            </span>
          </div>
          <WeekChart data={week} />
          <div className="chart-caption">
            {total
              ? "Continue aparecendo por você. A constância transforma."
              : "Seu gráfico começa com a primeira resposta. Vamos dar esse passo?"}
          </div>
          <button
            className="text-button"
            onClick={() => navigate("performance")}
          >
            Explorar meu desempenho
            <ArrowUpRight size={15} />
          </button>
        </section>
      </div>
      <div className="section-head tools-head">
        <div>
          <h2>Seu jeito de aprender</h2>
          <p>Mais caminhos para o mesmo sonho.</p>
        </div>
        <span className="muted small-text">ESCOLHA O SEU PRÓXIMO PASSO</span>
      </div>
      <div className="tools-grid">
        <Tool
          icon={Layers}
          title="Flashcards"
          text="Revisar, lembrar, evoluir."
          color="purple"
          onClick={() => {
            location.hash = "study/cards";
            navigate("study");
          }}
        />
        <Tool
          icon={Trophy}
          title="Simulados"
          text="Pratique com propósito."
          color="orange"
          onClick={() => startQuiz({ kind: "simulation", count: 10 })}
        />
        <Tool
          icon={Headphones}
          title="Aprenda ouvindo"
          text="O conhecimento te acompanha."
          color="green"
          onClick={() => {
            const a = activities[0];
            openActivity({ ...a, kind: "Áudio" });
          }}
        />
        <Tool
          icon={Target}
          title="Seus objetivos"
          text={goal?.target || "Um destino. Muitas possibilidades."}
          color="blue"
          onClick={() => navigate("goals")}
        />
      </div>
      <div className="home-footer">
        <span>✦</span> Você não precisa ser perfeito. Só precisa continuar.
      </div>
    </div>
  );
}
function Stat({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof BookOpen;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <section className="stat-card">
      <span className={`stat-icon ${color}`}>
        <Icon size={21} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
      <ArrowUpRight size={15} className="stat-arrow" />
    </section>
  );
}
function Tool({
  icon: Icon,
  title,
  text,
  color,
  onClick,
}: {
  icon: typeof BookOpen;
  title: string;
  text: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button className="tool-card" onClick={onClick}>
      <span className={`tool-icon ${color}`}>
        <Icon size={23} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <ChevronRight size={16} />
    </button>
  );
}
export function WeekChart({ data }: { data: ReturnType<typeof weekly> }) {
  const max = Math.max(5, ...data.map((d) => d.answers));
  return (
    <div
      className={`week-chart ${data.length > 7 ? "month-chart" : ""}`}
      role="img"
      aria-label={`Questões por dia: ${data.map((d) => `${d.key}: ${d.answers}`).join(", ")}`}
    >
      <div className="chart-grid">
        <span>{max}</span>
        <span>{Math.round(max / 2)}</span>
        <span>0</span>
      </div>
      <div className="chart-bars">
        {data.map((d, i) => (
          <div
            className={`bar-column ${i === data.length - 1 ? "today" : ""}`}
            key={d.key}
          >
            <div className="bar-track">
              <div
                className="bar"
                style={{
                  height: d.answers
                    ? `${Math.max(5, (d.answers / max) * 100)}%`
                    : "3px",
                }}
              >
                <span>{d.answers}</span>
              </div>
            </div>
            <small>{data.length > 7 ? d.day : d.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
