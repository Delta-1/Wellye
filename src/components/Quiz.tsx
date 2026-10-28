import { newId } from "../lib/id";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Flag,
  HelpCircle,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useApp } from "../lib/store";
import { accuracy } from "../lib/study";
import { selectQuestions } from "../lib/questions";
import type { Answer, Question } from "../lib/types";
import { Modal, Progress, SubjectIcon, Tag } from "./UI";
export interface QuizConfig {
  kind: "diagnostic" | "practice" | "simulation";
  subject?: string;
  count: number;
}
const reasons = [
  "Não conhecia o assunto",
  "Tive dificuldade de interpretação",
  "Fiquei em dúvida entre alternativas",
  "Faltou atenção",
  "Preciso revisar a base",
  "Estava tudo bem",
];
export default function Quiz({
  config,
  onClose,
}: {
  config: QuizConfig;
  onClose: () => void;
}) {
  const { state, update } = useApp();
  const [quizId] = useState(() => newId());
  const [list] = useState(() =>
    selectQuestions(
      state.goals.find((g) => g.active)?.type ?? "enem",
      config.count,
      config.subject,
      state.answers.map((a) => a.questionId),
      state.quizzes.length,
    ),
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [stage, setStage] = useState<"questions" | "feedback" | "result">(
    "questions",
  );
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [details, setDetails] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const start = useRef(Date.now());
  const [confirmExit, setConfirmExit] = useState(false);
  useEffect(() => {
    if (stage !== "questions") return;
    const t = setInterval(
      () => setSeconds(Math.floor((Date.now() - start.current) / 1000)),
      1000,
    );
    return () => clearInterval(t);
  }, [stage]);
  const q = list[index];
  const score = answers.filter((a) => a.correct).length;
  function submit() {
    if (selected === null || checked) return;
    const a: Answer = {
      id: `${quizId}-${q.id}`,
      questionId: q.id,
      selected,
      correct: selected === q.correct,
      subject: q.subject,
      at: new Date().toISOString(),
      seconds,
      quizId,
      board: state.goals.find((g) => g.active)?.board,
      goalId: state.goals.find((g) => g.active)?.id,
    };
    setAnswers((v) => [...v, a]);
    update((s) => ({ ...s, answers: [...s.answers, a] }));
    setChecked(true);
  }
  function next() {
    if (index === list.length - 1) {
      setStage("feedback");
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setChecked(false);
    setDetails(false);
    setSeconds(0);
    start.current = Date.now();
  }
  function finish() {
    update((s) => ({
      ...s,
      quizzes: [
        ...s.quizzes,
        {
          id: quizId,
          at: new Date().toISOString(),
          kind: config.kind,
          correct: score,
          total: list.length,
          difficulty,
        },
      ],
      profile: {
        ...s.profile,
        diagnosticDone:
          config.kind === "diagnostic" ? true : s.profile.diagnosticDone,
      },
    }));
    setStage("result");
  }
  function exit() {
    if (stage === "result") {
      onClose();
      return;
    }
    setConfirmExit(true);
  }
  return (
    <Modal
      title={
        stage === "result"
          ? "Seu ponto de partida"
          : stage === "feedback"
            ? "Uma última coisa…"
            : config.kind === "diagnostic"
              ? "Vamos descobrir seu ritmo"
              : config.kind === "simulation"
                ? "Seu simulado personalizado"
                : "Um pouco de prática"
      }
      subtitle={
        stage === "questions"
          ? "O importante é aprender em cada tentativa."
          : undefined
      }
      onClose={exit}
      wide
    >
      {stage === "questions" && q && (
        <>
          <div className="quiz-meta">
            <Tag>
              <SubjectIcon subject={q.subject} size={14} />
              {q.subject}
            </Tag>
            <span>
              <Clock3 size={14} />
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </span>
            <button
              className={`icon-button ${state.bookmarks.includes(q.id) ? "bookmarked" : ""}`}
              aria-label={
                state.bookmarks.includes(q.id)
                  ? "Remover dos salvos"
                  : "Salvar questão"
              }
              onClick={() =>
                update((s) => ({
                  ...s,
                  bookmarks: s.bookmarks.includes(q.id)
                    ? s.bookmarks.filter((id) => id !== q.id)
                    : [...s.bookmarks, q.id],
                }))
              }
            >
              <Bookmark size={18} />
            </button>
          </div>
          <div className="quiz-progress">
            <Progress
              value={((index + (checked ? 1 : 0)) / list.length) * 100}
            />
            <span>
              {index + 1} de {list.length}
            </span>
          </div>
          <div className="question-head">
            <span className="eyebrow">
              {q.topic} · NÍVEL {q.level}/5
            </span>
            <h3>{q.prompt}</h3>
          </div>
          <div className="quiz-options">
            {q.options.map((o, i) => (
              <button
                key={o}
                disabled={checked}
                className={`quiz-option ${selected === i ? "selected" : ""} ${checked && q.correct === i ? "correct" : ""} ${checked && selected === i && q.correct !== i ? "incorrect" : ""}`}
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                <div>{o}</div>
                {checked && q.correct === i ? (
                  <CheckCircle2 size={19} />
                ) : checked && selected === i ? (
                  <XCircle size={19} />
                ) : null}
              </button>
            ))}
          </div>
          {checked && (
            <div
              className={`correction ${selected === q.correct ? "success" : "learning"}`}
              role="status"
            >
              <h4>
                {selected === q.correct ? (
                  <>
                    <CheckCircle2 size={20} /> Muito bem! Você acertou.
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> Mais uma chance de aprender.
                  </>
                )}
              </h4>
              <p>{q.explanations[selected!]}</p>
              {selected !== q.correct && (
                <p>
                  <strong>
                    Resposta correta: {String.fromCharCode(65 + q.correct)}.
                  </strong>{" "}
                  {q.explanations[q.correct]}
                </p>
              )}
              <button
                className="text-button"
                onClick={() => setDetails(!details)}
              >
                Entender todas as alternativas
                <ChevronDown size={15} />
              </button>
              {details && (
                <div className="all-explanations">
                  {q.explanations.map((exp, i) => (
                    <p key={exp}>
                      <span
                        className={i === q.correct ? "green-text" : "muted"}
                      >
                        {String.fromCharCode(65 + i)} ·{" "}
                        {i === q.correct ? "Correta" : "Incorreta"}
                      </span>
                      {exp}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="quiz-bottom">
            <span>
              <ShieldNote />
            </span>
            {checked ? (
              <button className="button primary" onClick={next}>
                {index === list.length - 1 ? "Continuar" : "Próxima questão"}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="button primary"
                disabled={selected === null}
                onClick={submit}
              >
                Conferir resposta
                <Check size={16} />
              </button>
            )}
          </div>
        </>
      )}
      {stage === "feedback" && (
        <div className="quiz-feedback">
          <span className="empty-icon">
            <HelpCircle size={30} />
          </span>
          <h3>O que dificultou as questões?</h3>
          <p>
            Sua resposta ajuda a ajustar as próximas etapas. Pode escolher mais
            de uma opção.
          </p>
          <div className="feedback-options">
            {reasons.map((r) => (
              <button
                key={r}
                className={difficulty.includes(r) ? "selected" : ""}
                aria-pressed={difficulty.includes(r)}
                onClick={() =>
                  setDifficulty((v) =>
                    v.includes(r)
                      ? v.filter((x) => x !== r)
                      : r === "Estava tudo bem"
                        ? [r]
                        : [...v.filter((x) => x !== "Estava tudo bem"), r],
                  )
                }
              >
                <span className="checkbox">
                  {difficulty.includes(r) && <Check size={13} />}
                </span>
                {r}
              </button>
            ))}
          </div>
          <button className="button primary full" onClick={finish}>
            Ver meu resultado
            <ArrowRight size={17} />
          </button>
        </div>
      )}
      {stage === "result" && (
        <div className="quiz-result">
          <div className="result-orbit">
            <Sparkles size={35} />
          </div>
          <p className="eyebrow">CADA TENTATIVA CONTA</p>
          <h3>
            {score === 0
              ? "Aprender começa aqui."
              : score === list.length
                ? "Você está construindo uma ótima base!"
                : "Um passo a mais no seu caminho."}
          </h3>
          <p>
            {score === 0
              ? "Agora sabemos por onde começar. Vamos construir sua base com calma."
              : "Seus acertos mostram o que já sabe. Seus erros mostram o próximo passo."}
          </p>
          <div className="result-stats">
            <div>
              <strong>
                {score}
                <small>/{list.length}</small>
              </strong>
              <span>acertos nesta sessão</span>
            </div>
            <div>
              <strong>
                {Math.round((score / list.length) * 100)}
                <small>%</small>
              </strong>
              <span>aproveitamento</span>
            </div>
            <div>
              <strong>
                {accuracy(state)}
                <small>%</small>
              </strong>
              <span>histórico geral</span>
            </div>
          </div>
          <div className="soft-note">
            <Flag size={20} />
            <p>
              Seu plano agora prioriza os assuntos em que você precisa de mais
              apoio. Você pode ajustar os focos em Estudos.
            </p>
          </div>
          <button className="button primary full" onClick={onClose}>
            Continuar no meu ritmo
            <ArrowRight size={17} />
          </button>
        </div>
      )}
      {confirmExit && (
        <div className="exit-confirm">
          <div>
            <Flag size={24} />
            <h3>Pausar por aqui?</h3>
            <p>
              As respostas já conferidas ficam salvas. Esta sessão não entrará
              no total de simulados concluídos.
            </p>
            <div className="button-row">
              <button
                className="button secondary"
                onClick={() => setConfirmExit(false)}
              >
                Continuar estudando
              </button>
              <button className="button primary" onClick={onClose}>
                Pausar sessão
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
function ShieldNote() {
  return <small className="muted">Questão autoral Wellye</small>;
}
export function QuestionReview({
  q,
  onClose,
}: {
  q: Question;
  onClose: () => void;
}) {
  return (
    <Modal title={q.topic} subtitle="Questão autoral salva" onClose={onClose}>
      <h3>{q.prompt}</h3>
      {q.options.map((o, i) => (
        <div
          className={`review-option ${i === q.correct ? "correct" : ""}`}
          key={o}
        >
          <strong>
            {String.fromCharCode(65 + i)} · {o}
          </strong>
          <p>{q.explanations[i]}</p>
        </div>
      ))}
    </Modal>
  );
}
