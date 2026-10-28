import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Flame,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { useApp } from "../lib/store";
import {
  accuracy,
  activeSubjects,
  monthStats,
  streak,
  weekly,
} from "../lib/study";
import { WeekChart } from "./Home";
import {
  Donut,
  Empty,
  Modal,
  Progress,
  SectionHead,
  SubjectIcon,
  Tag,
  subjectColors,
} from "./UI";
export default function Performance({ recap }: { recap: () => void }) {
  const { state } = useApp();
  const [period, setPeriod] = useState(7);
  const [tab, setTab] = useState("general");
  const [board, setBoard] = useState("");
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (period - 1));
  const answers = state.answers.filter(
    (a) => new Date(a.at) >= cutoff && (!board || a.board === board),
  );
  const data = { ...state, answers };
  const correct = answers.filter((a) => a.correct).length;
  const simulations = state.quizzes.filter(
    (q) => new Date(q.at) >= cutoff && q.kind === "simulation",
  );
  const totalMinutes = Object.entries(state.studyMinutes)
    .filter(([d]) => new Date(d + "T23:59:59") >= cutoff)
    .reduce((s, [, v]) => s + v, 0);
  return (
    <div className="page">
      <div className="page-title">
        <div>
          <p className="eyebrow">CADA PASSO CONTA</p>
          <h1>
            Olha o quanto você avançou<span>.</span>
          </h1>
          <p>Sem comparação. A sua evolução é com você.</p>
        </div>
        <button className="button secondary" onClick={recap}>
          <Sparkles size={16} /> Minha retrospectiva
        </button>
      </div>
      <div className="performance-controls">
        <div className="tabs">
          <button
            className={tab === "general" ? "active" : ""}
            onClick={() => {
              setTab("general");
              setBoard("");
            }}
          >
            Visão geral
          </button>
          <button
            className={tab === "subjects" ? "active" : ""}
            onClick={() => {
              setTab("subjects");
              setBoard("");
            }}
          >
            Por matéria
          </button>
          <button
            className={tab === "boards" ? "active" : ""}
            onClick={() => setTab("boards")}
          >
            Por banca
          </button>
        </div>
        <div className="segmented compact">
          {[7, 30].map((n) => (
            <button
              key={n}
              className={period === n ? "active" : ""}
              onClick={() => setPeriod(n)}
            >
              {n} dias
            </button>
          ))}
        </div>
      </div>
      {tab === "boards" && (
        <label className="board-filter">
          Filtrar banca
          <select value={board} onChange={(e) => setBoard(e.target.value)}>
            <option value="">Todas as bancas</option>
            {[...new Set(state.goals.map((g) => g.board).filter(Boolean))].map(
              (b) => (
                <option key={b}>{b}</option>
              ),
            )}
          </select>
          <small className="muted">
            Agrupamento pelo objetivo ativo na hora de responder. As questões
            são autorais.
          </small>
        </label>
      )}
      {tab !== "subjects" && (
        <>
          <div className="performance-grid">
            <section className="card performance-summary">
              <SectionHead title="Seu desempenho" />
              <div className="summary-content">
                <Donut
                  value={accuracy(data)}
                  total={answers.length}
                  size={160}
                />
                <div className="summary-numbers">
                  <div>
                    <span>Questões respondidas</span>
                    <strong>{answers.length}</strong>
                  </div>
                  <div>
                    <span className="green-text">
                      <Check size={14} /> Acertos
                    </span>
                    <strong>{correct}</strong>
                  </div>
                  <div>
                    <span className="rose-text">
                      <X size={14} /> Oportunidades de aprender
                    </span>
                    <strong>{answers.length - correct}</strong>
                  </div>
                </div>
              </div>
              <div className="plan-note">
                Últimos {period} dias ·{" "}
                {answers.length < 20
                  ? "Amostra inicial: continue praticando para um retrato mais completo."
                  : "Cada questão ajuda a entender seu progresso."}
              </div>
            </section>
            <section className="card performance-chart">
              <SectionHead title="Sua constância">
                <Tag>{period} dias</Tag>
              </SectionHead>
              <WeekChart data={weekly(data, period)} />
              <p className="fineprint">
                Quantidade de questões respondidas por dia, incluindo sessões
                pausadas.
              </p>
            </section>
          </div>
          <div className="performance-stat-grid">
            {[
              [Trophy, simulations.length, "simulados concluídos"],
              [Clock3, totalMinutes, "minutos de foco"],
              [Flame, streak(state), "dias de constância"],
            ].map(([Icon, value, label]) => {
              const I = Icon as typeof Trophy;
              return (
                <div className="card mini-stat" key={String(label)}>
                  <span className="tool-icon purple">
                    <I size={24} />
                  </span>
                  <strong>{String(value)}</strong>
                  <p>{String(label)}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
      <section className="card subject-performance">
        <SectionHead
          title={
            tab === "subjects"
              ? "Um olhar para cada matéria"
              : "Onde colocar sua atenção"
          }
        >
          <Tag>Seu próximo passo</Tag>
        </SectionHead>
        <div className="subject-performance-list">
          {activeSubjects(state).map((s) => {
            const n = answers.filter((a) => a.subject === s).length;
            const percent = accuracy(data, s);
            return (
              <div key={s} className="subject-performance-row">
                <span className={`subject-badge ${subjectColors[s]}`}>
                  <SubjectIcon subject={s} />
                </span>
                <div>
                  <strong>{s}</strong>
                  <span>
                    {n
                      ? n + " questões respondidas"
                      : "Vamos conhecer seu ponto de partida"}
                  </span>
                </div>
                <div className="subject-score">
                  <span>{n ? `${percent}%` : "—"}</span>
                  <Progress value={percent} />
                </div>
                <Tag
                  color={!n ? "neutral" : percent >= 70 ? "green" : "orange"}
                >
                  {!n
                    ? "A começar"
                    : percent >= 70
                      ? "Continue assim"
                      : "Vamos revisar"}
                </Tag>
              </div>
            );
          })}
        </div>
      </section>
      <section className="card history-card">
        <SectionHead title="Suas últimas sessões" />
        {!state.quizzes.length ? (
          <Empty icon={BookOpen} title="Seu primeiro resultado está por vir">
            Conclua um diagnóstico, uma prática ou um simulado para acompanhar
            por aqui.
          </Empty>
        ) : (
          <div className="history-list">
            {state.quizzes
              .slice(-8)
              .reverse()
              .map((q) => (
                <div key={q.id}>
                  <span className="subject-badge purple">
                    <BookOpen size={18} />
                  </span>
                  <span>
                    <strong>
                      {q.kind === "diagnostic"
                        ? "Diagnóstico inicial"
                        : q.kind === "simulation"
                          ? "Simulado personalizado"
                          : "Sessão de prática"}
                    </strong>
                    <small>
                      {new Date(q.at).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </small>
                  </span>
                  <Tag color={q.correct / q.total >= 0.7 ? "green" : "purple"}>
                    {q.correct}/{q.total} acertos
                  </Tag>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
export function Recap({
  month,
  onClose,
}: {
  month: string;
  onClose: () => void;
}) {
  const { state } = useApp();
  const [slide, setSlide] = useState(0);
  const stats = monthStats(state, month);
  const monthName = new Date(month + "-15T12:00:00").toLocaleDateString(
    "pt-BR",
    { month: "long", year: "numeric" },
  );
  const slides = [
    {
      eyebrow: "ESSA HISTÓRIA É SUA",
      title: "Pequenos passos.\nUm mês inteiro de você.",
      number: String(stats.days),
      label: "dias em que você apareceu por você",
      text: "Cada dia de estudo é um encontro com o futuro que você quer construir.",
      Icon: Flame,
    },
    {
      eyebrow: "CADA TENTATIVA ENSINOU",
      title: "Você tentou.\nE isso já é evolução.",
      number: String(stats.answers),
      label: `questões respondidas · ${stats.correct} acertos`,
      text: "Até as respostas que não deram certo ajudaram a encontrar o próximo passo.",
      Icon: Sparkles,
    },
    {
      eyebrow: "O SEU TEMPO TEM VALOR",
      title: "Um investimento\nque fica com você.",
      number: String(stats.minutes),
      label: "minutos de foco registrados",
      text: "Seu ritmo é único. Continue construindo uma rotina que respeita quem você é.",
      Icon: Clock3,
    },
  ];
  const current = slides[slide];
  return (
    <Modal title={`Seu mês em Wellye · ${monthName}`} onClose={onClose}>
      <div className="recap">
        <div className="recap-progress">
          {slides.map((_, i) => (
            <span className={i <= slide ? "active" : ""} key={i} />
          ))}
        </div>
        <current.Icon size={43} />
        <p className="eyebrow">{current.eyebrow}</p>
        <h2>{current.title}</h2>
        <strong className="recap-number">{current.number}</strong>
        <span>{current.label}</span>
        <p>{current.text}</p>
        <button
          className="button cream full"
          onClick={() => (slide < 2 ? setSlide(slide + 1) : onClose())}
        >
          {slide < 2 ? "Mais um capítulo" : "Continuar minha história"}
          <ArrowRight size={17} />
        </button>
      </div>
    </Modal>
  );
}
