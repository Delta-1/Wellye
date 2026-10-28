import { newId } from "../lib/id";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  Layers,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useApp } from "../lib/store";
import { dayKey, plan, activeSubjects } from "../lib/study";
import { officialExams, questions } from "../lib/questions";
import type { Activity, AppState, ReviewCard } from "../lib/types";
import {
  Empty,
  FormatIcon,
  Modal,
  Progress,
  SectionHead,
  SubjectIcon,
  Tag,
  subjectColors,
} from "./UI";
import { QuestionReview } from "./Quiz";
import type { QuizConfig } from "./Quiz";
export default function Study({
  startQuiz,
  openActivity,
}: {
  startQuiz: (q: QuizConfig) => void;
  openActivity: (a: Activity) => void;
}) {
  const { state, update, toast, guest } = useApp();
  const [tab, setTab] = useState(
    location.hash.includes("cards") ? "cards" : "plan",
  );
  const [configure, setConfigure] = useState(false);
  const [quizSettings, setQuizSettings] = useState(false);
  const [subject, setSubject] = useState("");
  const [count, setCount] = useState(5);
  const [savedQuestion, setSavedQuestion] = useState("");
  const activities = plan(state);
  const done = state.completions[dayKey()] ?? [];
  useEffect(() => {
    if (location.hash.includes("cards")) setTab("cards");
  }, []);
  async function download() {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      reg?.active?.postMessage({ type: "CACHE_OFFLINE" });
      toast(
        "O app e as lições estão disponíveis offline após o primeiro carregamento. Suas respostas serão sincronizadas ao voltar.",
      );
    } else toast("Os conteúdos de leitura já estão salvos neste dispositivo.");
  }
  return (
    <div className="page">
      <div className="page-title">
        <div>
          <p className="eyebrow">APRENDER DO SEU JEITO</p>
          <h1>
            Seu espaço de estudo<span>.</span>
          </h1>
          <p>Um plano possível. Um conhecimento que fica.</p>
        </div>
        <button className="button secondary" onClick={() => void download()}>
          <Download size={16} /> Usar offline
        </button>
      </div>
      <div className="tabs">
        <button
          className={tab === "plan" ? "active" : ""}
          onClick={() => setTab("plan")}
        >
          <BookOpen size={16} />
          Meu plano
        </button>
        <button
          className={tab === "practice" ? "active" : ""}
          onClick={() => setTab("practice")}
        >
          <Sparkles size={16} />
          Praticar
        </button>
        <button
          className={tab === "cards" ? "active" : ""}
          onClick={() => setTab("cards")}
        >
          <Layers size={16} />
          Flashcards
        </button>
        <button
          className={tab === "exams" ? "active" : ""}
          onClick={() => setTab("exams")}
        >
          <Bookmark size={16} />
          Provas e salvos
        </button>
      </div>
      {tab === "plan" && (
        <>
          <section className="plan-banner">
            <div>
              <Tag>
                <Sparkles size={13} /> PERSONALIZADO PARA VOCÊ
              </Tag>
              <h2>Seu ritmo é o ponto de partida.</h2>
              <p>
                {state.profile.minutes} minutos por dia ·{" "}
                {state.profile.formats.join(", ")} ·{" "}
                {activeSubjects(state).length} matérias no seu caminho
              </p>
            </div>
            <button
              className="button secondary"
              onClick={() => setConfigure(true)}
            >
              <Settings2 size={16} /> Ajustar meu plano
            </button>
          </section>
          <div className="dashboard-columns">
            <section className="card">
              <SectionHead title="Hoje, um passo de cada vez">
                <Tag color="green">
                  {activities.filter((a) => done.includes(a.id)).length}/
                  {activities.length}
                </Tag>
              </SectionHead>
              <div className="study-activities">
                {activities.map((a, i) => (
                  <button
                    key={a.id}
                    onClick={() => openActivity(a)}
                    className="study-activity"
                  >
                    <span
                      className={`step-dot ${done.includes(a.id) ? "checked" : ""}`}
                    >
                      {done.includes(a.id) ? <Check size={17} /> : i + 1}
                    </span>
                    <div>
                      <span className="small-text purple-text">
                        {a.subject}
                      </span>
                      <h3>{a.topic}</h3>
                      <p>
                        <FormatIcon kind={a.kind} />
                        {a.kind} · {a.minutes} min
                      </p>
                    </div>
                    <span className="activity-play">
                      {done.includes(a.id) ? (
                        <Check size={18} />
                      ) : (
                        <Play size={17} />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <div className="plan-note">
                <Sparkles size={14} /> O plano se adapta às suas respostas e aos
                seus focos.
              </div>
            </section>
            <section className="card">
              <SectionHead title="Seu próximo passo" />
              <div className="focus-advice">
                <div className="focus-visual">
                  <BookOpen size={48} />
                  <Sparkles size={21} />
                </div>
                <h3>Entenda antes de acelerar.</h3>
                <p>
                  Leia a explicação com calma, tente um exemplo e só então
                  avance. Errar faz parte do processo.
                </p>
                <button
                  className="button primary full"
                  onClick={() =>
                    startQuiz({
                      kind: state.profile.diagnosticDone
                        ? "practice"
                        : "diagnostic",
                      count: 5,
                    })
                  }
                >
                  {state.profile.diagnosticDone
                    ? "Praticar 5 questões"
                    : "Fazer meu diagnóstico"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>
          </div>
        </>
      )}
      {tab === "practice" && (
        <>
          <section className="practice-hero">
            <span className="tool-icon purple">
              <Sparkles size={32} />
            </span>
            <div>
              <p className="eyebrow">CADA TENTATIVA ENSINA</p>
              <h2>Pratique sem medo de errar.</h2>
              <p>
                Questões autorais, do básico ao mais desafiador. Correção
                explicada em todas as alternativas.
              </p>
            </div>
            <button
              className="button primary"
              onClick={() => setQuizSettings(true)}
            >
              Montar simulado
              <ArrowRight size={16} />
            </button>
          </section>
          <SectionHead title="Qual vai ser o foco de hoje?" />
          <div className="subject-grid">
            {activeSubjects(state).map((s) => (
              <button
                className="card subject-card"
                key={s}
                onClick={() =>
                  startQuiz({ kind: "practice", subject: s, count: 5 })
                }
              >
                <span className={`subject-badge ${subjectColors[s]}`}>
                  <SubjectIcon subject={s} size={25} />
                </span>
                <h3>{s}</h3>
                <p>5 questões comentadas · níveis 1 a 5</p>
                <span className="text-button">
                  Começar a praticar
                  <ArrowUpRight size={15} />
                </span>
              </button>
            ))}
          </div>
        </>
      )}
      {tab === "cards" && <Flashcards />}
      {tab === "exams" && (
        <>
          <div className="section-head">
            <div>
              <h2>Direto da fonte</h2>
              <p>
                Provas e editais nos portais oficiais. Acesso externo requer
                internet.
              </p>
            </div>
            <ExternalLink size={19} />
          </div>
          <div className="exam-grid">
            {officialExams.map((e) => (
              <a
                className="card exam-card"
                key={e.title}
                href={e.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="tool-icon purple">
                  <BookOpen size={24} />
                </span>
                <h3>{e.title}</h3>
                <small className="purple-text">{e.org}</small>
                <p>{e.description}</p>
                <span className="text-button">
                  Consultar acervo oficial
                  <ArrowUpRight size={15} />
                </span>
              </a>
            ))}
          </div>
          <div className="section-head">
            <div>
              <h2>Suas questões salvas</h2>
              <p>Guarde o que merece uma segunda olhada.</p>
            </div>
            <Tag>{state.bookmarks.length} salvas</Tag>
          </div>
          {!state.bookmarks.length ? (
            <div className="card">
              <Empty icon={Bookmark} title="Sua coleção começa aqui">
                Toque no marcador de uma questão para revisá-la depois.
              </Empty>
            </div>
          ) : (
            <div className="saved-list">
              {questions
                .filter((q) => state.bookmarks.includes(q.id))
                .map((q) => (
                  <button
                    className="card saved-row"
                    key={q.id}
                    onClick={() => setSavedQuestion(q.id)}
                  >
                    <SubjectIcon subject={q.subject} />
                    <span>
                      <small>
                        {q.subject} · {q.topic}
                      </small>
                      <strong>{q.prompt}</strong>
                    </span>
                    <ChevronRight size={17} />
                  </button>
                ))}
            </div>
          )}
        </>
      )}
      {configure && (
        <Modal
          title="Um plano que cabe na sua vida"
          subtitle="Seu ritmo pode mudar. Seu plano também."
          onClose={() => setConfigure(false)}
        >
          <PlanSettings
            state={state}
            save={(s) => {
              update(() => s);
              setConfigure(false);
              toast("Plano ajustado ao seu novo ritmo.");
            }}
          />
        </Modal>
      )}
      {quizSettings && (
        <Modal
          title="Seu simulado, do seu jeito"
          onClose={() => setQuizSettings(false)}
        >
          <label>
            Matéria
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Misturar as matérias do meu objetivo</option>
              {activeSubjects(state).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Quantidade de questões
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              {[5, 10, 15]
                .filter((n) => !subject || n <= 5)
                .map((n) => (
                  <option value={n} key={n}>
                    {n} questões
                  </option>
                ))}
            </select>
          </label>
          <p className="fineprint">
            Banco inicial de 30 questões autorais. Questões já vistas podem
            reaparecer para revisão.{" "}
            {guest
              ? "Seu resultado fica neste dispositivo."
              : "Seu resultado fica salvo na sua conta."}
          </p>
          <button
            className="button primary full"
            onClick={() => {
              setQuizSettings(false);
              startQuiz({
                kind: "simulation",
                subject: subject || undefined,
                count: subject ? Math.min(count, 5) : count,
              });
            }}
          >
            Começar simulado
            <ArrowRight size={16} />
          </button>
        </Modal>
      )}
      {savedQuestion && (
        <QuestionReview
          q={questions.find((q) => q.id === savedQuestion)!}
          onClose={() => setSavedQuestion("")}
        />
      )}
    </div>
  );
}
function PlanSettings({
  state,
  save,
}: {
  state: AppState;
  save: (s: AppState) => void;
}) {
  const [minutes, setMinutes] = useState(state.profile.minutes);
  const [focus, setFocus] = useState(state.profile.focus);
  return (
    <>
      <label>
        Tempo diário
        <select
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        >
          {[15, 30, 45, 60, 90, 120].map((n) => (
            <option value={n} key={n}>
              {n} minutos por dia
            </option>
          ))}
        </select>
      </label>
      <label>Matérias que você quer priorizar</label>
      <div className="feedback-options">
        {activeSubjects(state).map((s) => (
          <button
            key={s}
            className={focus.includes(s) ? "selected" : ""}
            aria-pressed={focus.includes(s)}
            onClick={() =>
              setFocus((v) =>
                v.includes(s) ? v.filter((x) => x !== s) : [...v, s],
              )
            }
          >
            <span className="checkbox">
              {focus.includes(s) && <Check size={13} />}
            </span>
            {s}
          </button>
        ))}
      </div>
      <button
        className="button primary full"
        onClick={() =>
          save({ ...state, profile: { ...state.profile, minutes, focus } })
        }
      >
        Salvar meu ritmo
        <Check size={17} />
      </button>
    </>
  );
}
function Flashcards() {
  const { state, update, toast } = useApp();
  const [creating, setCreating] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [all, setAll] = useState(false);
  const allCards = [
    ...state.cards,
    ...questions
      .filter((q) => activeSubjects(state).includes(q.subject))
      .map((q) => ({
        id: q.id,
        front: q.prompt,
        back: `${q.options[q.correct]}\n\n${q.lesson}`,
        subject: q.subject,
        due: dayKey(),
        interval: 0,
      }))
      .filter((c) => !state.cards.some((s) => s.id === c.id)),
  ];
  const filtered = allCards.filter(
    (c) =>
      (all || c.due <= dayKey()) &&
      `${c.front} ${c.subject}`.toLowerCase().includes(query.toLowerCase()),
  );
  const card = filtered[index % Math.max(1, filtered.length)];
  function rate(remember: boolean) {
    if (!card) return;
    const interval = remember
      ? Math.min(60, Math.max(1, card.interval ? card.interval * 2 : 1))
      : 0;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + interval);
    const updated = { ...card, due: dayKey(dueDate), interval };
    update((s) => ({
      ...s,
      cards: [...s.cards.filter((c) => c.id !== card.id), updated],
    }));
    setFlipped(false);
    setIndex((i) => (remember && !all ? i : i + 1));
    toast(
      remember
        ? `Revisão agendada para ${interval === 1 ? "amanhã" : `daqui a ${interval} dias`}.`
        : "Tudo bem. Vamos revisar esse cartão mais uma vez.",
    );
  }
  return (
    <>
      <div className="section-head">
        <div>
          <h2>Um pouco hoje. Na memória amanhã.</h2>
          <p>Vire o cartão, tente lembrar e escolha quando revisar.</p>
        </div>
        <button className="button primary" onClick={() => setCreating(true)}>
          <Plus size={16} /> Criar flashcard
        </button>
      </div>
      <div className="flash-toolbar">
        <div className="input-icon">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Buscar assunto ou cartão"
          />
        </div>
        <button
          className="button secondary"
          onClick={() => {
            setAll(!all);
            setIndex(0);
          }}
        >
          {all ? "Ver revisões de hoje" : "Ver todos os cartões"}
        </button>
        <Tag>{filtered.length} cartões</Tag>
      </div>
      {card ? (
        <div className="flashcard-wrap">
          <button
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
            aria-label={
              flipped ? "Voltar à pergunta" : "Virar cartão e ver resposta"
            }
          >
            <div className="flashcard-top">
              <Tag>{card.subject}</Tag>
              <Layers size={22} />
            </div>
            <p className="eyebrow">
              {flipped ? "RESPOSTA" : "PUXE PELA MEMÓRIA"}
            </p>
            <h3>{flipped ? card.back : card.front}</h3>
            <span className="flip-hint">
              <RotateCcw size={16} /> Toque para {flipped ? "voltar" : "virar"}
            </span>
          </button>
          <div className="flash-actions">
            {flipped ? (
              <>
                <button
                  className="button secondary"
                  onClick={() => rate(false)}
                >
                  <RotateCcw size={16} /> Preciso revisar
                </button>
                <button className="button primary" onClick={() => rate(true)}>
                  <Check size={16} /> Lembrei!
                </button>
              </>
            ) : (
              <button
                className="button secondary"
                onClick={() => setFlipped(true)}
              >
                Ver resposta
                <RotateCcw size={16} />
              </button>
            )}
          </div>
          <p className="fineprint center-text">
            Revisão espaçada: 1, 2, 4, 8 dias… respeitando a sua memória.
          </p>
        </div>
      ) : (
        <div className="card">
          <Empty
            icon={Layers}
            title="Tudo revisado por aqui!"
            action={
              <button className="button secondary" onClick={() => setAll(true)}>
                Explorar todos os cartões
              </button>
            }
          >
            Volte amanhã para sua próxima revisão ou crie um cartão novo.
          </Empty>
        </div>
      )}
      {creating && (
        <Modal
          title="Uma ideia para lembrar"
          subtitle="Perguntas curtas e respostas claras funcionam melhor."
          onClose={() => setCreating(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const c: ReviewCard = {
                id: newId(),
                front: String(f.get("front")).trim(),
                back: String(f.get("back")).trim(),
                subject: String(f.get("subject")),
                due: dayKey(),
                interval: 0,
              };
              update((s) => ({ ...s, cards: [...s.cards, c] }));
              setCreating(false);
              setAll(true);
              toast("Seu flashcard está pronto.");
            }}
          >
            <label>
              Pergunta
              <textarea
                name="front"
                required
                maxLength={500}
                rows={3}
                placeholder="O que você quer lembrar?"
              />
            </label>
            <label>
              Resposta
              <textarea
                name="back"
                required
                maxLength={2000}
                rows={4}
                placeholder="Explique com suas próprias palavras."
              />
            </label>
            <label>
              Matéria
              <select name="subject">
                {activeSubjects(state).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <button className="button primary full">
              Criar meu flashcard
              <Plus size={16} />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function ActivityModal({
  activity,
  onClose,
  startQuiz,
}: {
  activity: Activity;
  onClose: () => void;
  startQuiz: (q: QuizConfig) => void;
}) {
  const { state, update, toast } = useApp();
  const lesson =
    questions.find(
      (q) => q.subject === activity.subject && q.topic === activity.topic,
    ) ?? questions.find((q) => q.subject === activity.subject)!;
  const [speaking, setSpeaking] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(0);
  const base = useRef(0);
  const recorded = useRef(false);
  const done = state.completions[dayKey()]?.includes(activity.id);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  useEffect(() => {
    if (!running) return;
    started.current = Date.now();
    const t = setInterval(
      () =>
        setElapsed(
          base.current + Math.floor((Date.now() - started.current) / 1000),
        ),
      250,
    );
    return () => clearInterval(t);
  }, [running]);
  function toggle() {
    if (running) {
      base.current = elapsed;
      setRunning(false);
    } else setRunning(true);
  }
  function speak() {
    if (!("speechSynthesis" in window)) {
      toast("A leitura em voz alta não está disponível neste dispositivo.");
      return;
    }
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = new SpeechSynthesisUtterance(
      `${lesson.topic}. ${lesson.lesson}. Exemplo. ${lesson.prompt}. Resposta: ${lesson.options[lesson.correct]}. ${lesson.explanations[lesson.correct]}`,
    );
    text.lang = "pt-BR";
    text.rate = 0.9;
    text.onend = () => setSpeaking(false);
    text.onerror = () => setSpeaking(false);
    speechSynthesis.speak(text);
    setSpeaking(true);
  }
  function complete() {
    if (recorded.current) return;
    recorded.current = true;
    const key = dayKey();
    const minutes = Math.floor(elapsed / 60);
    update((s) => ({
      ...s,
      completions: {
        ...s.completions,
        [key]: [...new Set([...(s.completions[key] ?? []), activity.id])],
      },
      focusSessions: [
        ...(s.focusSessions ?? []),
        { id: newId(), day: key, minutes },
      ],
      studyMinutes: {
        ...s.studyMinutes,
        [key]: (s.studyMinutes[key] ?? 0) + minutes,
      },
    }));
    toast(
      `Atividade concluída! ${minutes ? `${minutes} min registrados.` : "Seu próximo passo já está esperando."}`,
    );
    onClose();
  }
  return (
    <Modal
      title={lesson.topic}
      subtitle={`${activity.subject} · ${activity.minutes} min sugeridos`}
      onClose={onClose}
      wide
    >
      <div className="lesson-top">
        <Tag>
          <FormatIcon kind={activity.kind} />
          {activity.kind}
        </Tag>
        <button className="text-button" onClick={speak}>
          {speaking ? <Pause size={15} /> : <Volume2 size={15} />}{" "}
          {speaking ? "Parar leitura" : "Ouvir explicação"}
        </button>
      </div>
      <article className="lesson">
        <p className="eyebrow">COMECE PELO ESSENCIAL</p>
        <h3>{lesson.topic}</h3>
        <p>{lesson.lesson}</p>
        {activity.kind === "Mapa mental" && (
          <div className="mind-map">
            <div>{lesson.topic}</div>
            <span>↓</span>
            <div>{lesson.lesson.split(".")[0]}.</div>
            <span>↓</span>
            <div>Aplicação: {lesson.options[lesson.correct]}</div>
          </div>
        )}
        <div className="lesson-example">
          <span className="eyebrow">UM EXEMPLO PARA CONECTAR AS IDEIAS</span>
          <h4>{lesson.prompt}</h4>
          <p>
            <strong>{lesson.options[lesson.correct]}</strong>
          </p>
          <p>{lesson.explanations[lesson.correct]}</p>
        </div>
        <div className="soft-note">
          <Sparkles size={20} />
          <p>
            Agora explique o conceito em voz alta, com suas palavras. Se travar,
            releia e tente de novo.
          </p>
        </div>
        {activity.kind === "Vídeo" && (
          <a
            className="button secondary"
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activity.subject + " " + lesson.topic + " aula")}`}
            target="_blank"
            rel="noreferrer"
          >
            <Play size={16} /> Buscar videoaulas sobre o tema
            <ExternalLink size={14} />
          </a>
        )}
      </article>
      <div className="focus-timer">
        <div>
          <Clock3 size={21} />
          <span>
            <strong>
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
              {String(elapsed % 60).padStart(2, "0")}
            </strong>
            <small>tempo de foco registrado</small>
          </span>
        </div>
        <button className="button secondary" onClick={toggle}>
          {running ? <Pause size={15} /> : <Play size={15} />}{" "}
          {running ? "Pausar" : "Começar foco"}
        </button>
      </div>
      <Progress
        value={Math.min(100, (elapsed / (activity.minutes * 60)) * 100)}
      />
      <p className="fineprint">
        Registre seu tempo com o cronômetro. Concluir uma atividade sem
        cronômetro marca o checklist e não soma minutos.
      </p>
      <div className="button-row">
        <button
          className="button secondary"
          onClick={() => {
            onClose();
            startQuiz({
              kind: "practice",
              subject: activity.subject,
              count: 5,
            });
          }}
        >
          Praticar este assunto
          <ArrowRight size={16} />
        </button>
        <button className="button primary" onClick={complete}>
          {done ? "Registrar nova revisão" : "Concluir atividade"}
          <Check size={17} />
        </button>
      </div>
    </Modal>
  );
}
