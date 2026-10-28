import type { Question, Subject, GoalType } from "./types";
export const subjects: Subject[] = [
  "Língua Portuguesa",
  "Matemática",
  "Ciências da Natureza",
  "Ciências Humanas",
  "Informática",
  "Conhecimentos Específicos",
];
// Original teaching questions. These are not attributed to an exam board or official exam.
const raw: [
  Subject,
  number,
  string,
  string,
  string[],
  number,
  string[],
  string,
][] = [
  [
    "Língua Portuguesa",
    1,
    "Ortografia",
    "Qual palavra está escrita corretamente?",
    ["Excessão", "Exceção", "Escessão", "Exceçâo"],
    1,
    [
      "“Excessão” não é a grafia padrão.",
      "“Exceção” é a grafia correta: começa com ex- e termina em -ção.",
      "A palavra começa com ex-, e não es-.",
      "O til aparece no ã: exceção.",
    ],
    "Observe a grafia das palavras mais frequentes e crie exemplos próprios para memorizá-las.",
  ],
  [
    "Língua Portuguesa",
    2,
    "Interpretação",
    "“Lia estudou todos os dias e, aos poucos, ganhou confiança.” O trecho destaca:",
    [
      "Uma mudança gradual",
      "Um resultado imediato",
      "Uma obrigação imposta",
      "Uma dúvida sem solução",
    ],
    0,
    [
      "“Aos poucos” indica que a confiança se desenvolveu gradualmente.",
      "“Aos poucos” se opõe a um resultado imediato.",
      "O texto não informa que alguém obrigou Lia a estudar.",
      "O texto relata uma conquista, não uma dúvida.",
    ],
    "Procure as expressões que marcam tempo, causa e consequência. Elas ajudam a identificar o sentido do texto.",
  ],
  [
    "Língua Portuguesa",
    3,
    "Concordância",
    "Qual frase segue a concordância verbal padrão?",
    [
      "Fazem dois anos que estudo.",
      "Houveram muitas dúvidas.",
      "Existem bons materiais aqui.",
      "A gente estudamos juntos.",
    ],
    2,
    [
      "Fazer indicando tempo é impessoal: “Faz dois anos”.",
      "Haver com sentido de existir é impessoal: “Houve muitas dúvidas”.",
      "O sujeito “bons materiais” está no plural, assim como “existem”.",
      "“A gente” exige verbo na terceira pessoa do singular: “estuda”.",
    ],
    "Diferencie “haver” impessoal de “existir”, que concorda normalmente com o sujeito.",
  ],
  [
    "Língua Portuguesa",
    4,
    "Orações subordinadas",
    "Em “Embora estivesse cansada, Maria continuou estudando”, a oração inicial expressa:",
    ["Causa", "Condição", "Concessão", "Finalidade"],
    2,
    [
      "A oração não apresenta a causa de Maria estudar.",
      "Uma condição usaria estruturas como “se estivesse”.",
      "“Embora” introduz uma concessão: há um obstáculo que não impede a ação.",
      "Uma finalidade indicaria objetivo, com “para que”, por exemplo.",
    ],
    "Concessão expressa um contraste que não impede o fato principal. Conectivos: embora, ainda que, mesmo que.",
  ],
  [
    "Língua Portuguesa",
    5,
    "Crase",
    "Em qual alternativa o uso da crase é obrigatório?",
    [
      "Começou à estudar cedo.",
      "Entregou o trabalho à professora.",
      "Foi à pé para a escola.",
      "Referiu-se à uma prova.",
    ],
    1,
    [
      "Não há crase antes de verbo: “a estudar”.",
      "“Entregou a” + “a professora” produz a fusão “à professora”.",
      "Não há artigo feminino antes de “pé”: “a pé”.",
      "Não ocorre crase antes do artigo indefinido “uma” neste caso.",
    ],
    "A crase é a fusão da preposição a com o artigo a. Teste a troca por um masculino: “ao professor” confirma “à professora”.",
  ],
  [
    "Matemática",
    1,
    "Operações básicas",
    "Uma estudante resolveu 8 questões pela manhã e 7 à tarde. Quantas resolveu no total?",
    ["14", "15", "16", "17"],
    1,
    [
      "8 + 7 não é 14.",
      "Somando as duas quantidades: 8 + 7 = 15.",
      "16 seria 8 + 8.",
      "17 seria 8 + 9.",
    ],
    "Quando o enunciado pede o total de dois grupos, somamos as quantidades.",
  ],
  [
    "Matemática",
    2,
    "Porcentagem",
    "Em uma lista com 20 questões, você acertou 15. Qual foi seu aproveitamento?",
    ["60%", "70%", "75%", "80%"],
    2,
    [
      "60% de 20 corresponde a 12 questões.",
      "70% de 20 corresponde a 14 questões.",
      "15 ÷ 20 × 100 = 75%.",
      "80% de 20 corresponde a 16 questões.",
    ],
    "Porcentagem = parte ÷ total × 100. O total representa 100%.",
  ],
  [
    "Matemática",
    3,
    "Regra de três",
    "Uma impressora produz 120 páginas em 4 minutos. Mantendo o ritmo, quantas produz em 7 minutos?",
    ["180", "200", "210", "240"],
    2,
    [
      "180 páginas seriam produzidas em 6 minutos.",
      "200 não corresponde a 7 vezes a taxa de 30 por minuto.",
      "120 ÷ 4 = 30 páginas por minuto; 30 × 7 = 210.",
      "240 páginas exigiriam 8 minutos.",
    ],
    "Em uma proporção direta, calcule o valor por unidade e multiplique pela quantidade desejada.",
  ],
  [
    "Matemática",
    4,
    "Equações",
    "Se 3(x − 2) = 2x + 5, então x vale:",
    ["5", "7", "9", "11"],
    3,
    [
      "Substituindo 5: 9 ≠ 15.",
      "Substituindo 7: 15 ≠ 19.",
      "Substituindo 9: 21 ≠ 23.",
      "3x − 6 = 2x + 5, portanto x = 11.",
    ],
    "Distribua a multiplicação, reúna os termos com x e isole a incógnita. Confira substituindo o resultado.",
  ],
  [
    "Matemática",
    5,
    "Probabilidade",
    "Uma caixa tem 3 bolas azuis e 2 vermelhas. Duas são retiradas sem reposição. Qual a chance de ambas serem azuis?",
    ["3/10", "9/25", "2/5", "1/5"],
    0,
    [
      "3/5 × 2/4 = 6/20 = 3/10.",
      "9/25 suporia reposição da primeira bola.",
      "2/5 é a chance inicial de uma vermelha, não de duas azuis.",
      "1/5 não corresponde ao produto das probabilidades condicionais.",
    ],
    "Sem reposição, o total e a quantidade da cor sorteada diminuem após cada retirada. Multiplique as probabilidades condicionais.",
  ],
  [
    "Ciências da Natureza",
    1,
    "Biologia celular",
    "Qual estrutura armazena a maior parte do DNA em uma célula humana típica?",
    ["Núcleo", "Ribossomo", "Membrana plasmática", "Lisossomo"],
    0,
    [
      "O núcleo contém a maior parte do DNA; as mitocôndrias também possuem uma pequena parte.",
      "Ribossomos participam da síntese de proteínas.",
      "A membrana controla trocas com o meio.",
      "Lisossomos participam da digestão intracelular.",
    ],
    "As células eucarióticas possuem núcleo delimitado por membrana, onde se localiza a maior parte do material genético.",
  ],
  [
    "Ciências da Natureza",
    2,
    "Ecologia",
    "Em uma cadeia alimentar, plantas são chamadas de produtoras porque:",
    [
      "Decompõem animais",
      "Produzem matéria orgânica por fotossíntese",
      "Consomem outros seres",
      "Não precisam de energia",
    ],
    1,
    [
      "A decomposição é realizada principalmente por fungos e bactérias.",
      "Plantas transformam energia luminosa em energia química, produzindo matéria orgânica.",
      "Plantas fotossintetizantes não dependem da ingestão de outros seres para obter carbono orgânico.",
      "A fotossíntese requer energia luminosa.",
    ],
    "Produtores são a base de muitas cadeias alimentares: convertem energia e disponibilizam matéria orgânica aos consumidores.",
  ],
  [
    "Ciências da Natureza",
    3,
    "Química",
    "Uma solução aquosa com pH 3, a 25 °C, é:",
    ["Básica", "Neutra", "Ácida", "Sempre pura"],
    2,
    [
      "Soluções básicas têm pH maior que 7 a 25 °C.",
      "A neutralidade corresponde a pH 7 a 25 °C.",
      "pH menor que 7 indica caráter ácido a 25 °C.",
      "pH mede acidez e não demonstra pureza.",
    ],
    "A escala de pH é logarítmica. A 25 °C, pH abaixo de 7 é ácido e acima de 7 é básico.",
  ],
  [
    "Ciências da Natureza",
    4,
    "Física",
    "Um carro percorre 150 km em 2,5 horas. Qual é sua velocidade média?",
    ["50 km/h", "60 km/h", "75 km/h", "90 km/h"],
    1,
    [
      "50 × 2,5 = 125 km, não 150.",
      "Velocidade média = distância ÷ tempo = 150 ÷ 2,5 = 60 km/h.",
      "75 km/h corresponderia a 150 km em 2 horas.",
      "90 × 2,5 = 225 km.",
    ],
    "Velocidade média relaciona deslocamento e intervalo de tempo. Para trajetos retilíneos no mesmo sentido, divida a distância pelo tempo.",
  ],
  [
    "Ciências da Natureza",
    5,
    "Genética",
    "No cruzamento Aa × Aa, com dominância completa, qual a probabilidade de um descendente ter o fenótipo recessivo?",
    ["0%", "25%", "50%", "75%"],
    1,
    [
      "O genótipo aa pode ocorrer.",
      "As combinações são AA, Aa, Aa e aa. Apenas aa é recessivo: 1/4 = 25%.",
      "50% é a proporção de heterozigotos Aa.",
      "75% apresenta o fenótipo dominante.",
    ],
    "O quadro de Punnett combina os gametas dos progenitores. Com dominância completa, o fenótipo recessivo exige dois alelos recessivos.",
  ],
  [
    "Ciências Humanas",
    1,
    "Geografia",
    "Qual elemento é utilizado para orientar direções em um mapa?",
    ["Legenda", "Rosa dos ventos", "Escala", "Título"],
    1,
    [
      "A legenda explica símbolos.",
      "A rosa dos ventos indica direções, como norte, sul, leste e oeste.",
      "A escala relaciona distâncias no mapa e no terreno.",
      "O título informa o tema do mapa.",
    ],
    "Um mapa utiliza título, legenda, escala e orientação para comunicar informações espaciais.",
  ],
  [
    "Ciências Humanas",
    2,
    "História do Brasil",
    "A Lei Áurea, de 1888, determinou:",
    [
      "A independência do Brasil",
      "A abolição legal da escravidão no Brasil",
      "A proclamação da República",
      "O voto feminino",
    ],
    1,
    [
      "A independência foi proclamada em 1822.",
      "A Lei Áurea aboliu legalmente a escravidão no Brasil em 13 de maio de 1888.",
      "A República foi proclamada em 1889.",
      "O voto feminino foi reconhecido nacionalmente em 1932.",
    ],
    "Relacione eventos históricos a seus contextos e consequências. A abolição legal não garantiu a integração social dos libertos.",
  ],
  [
    "Ciências Humanas",
    3,
    "Cidadania",
    "Em uma democracia, a separação dos poderes busca principalmente:",
    [
      "Concentrar decisões",
      "Impedir a participação popular",
      "Equilibrar funções e limitar abusos",
      "Eliminar as leis",
    ],
    2,
    [
      "A separação procura evitar a concentração de poder.",
      "Participação popular e separação de poderes são compatíveis.",
      "A divisão de funções permite controles recíprocos entre os poderes.",
      "As leis continuam fundamentais ao Estado de Direito.",
    ],
    "Executivo, Legislativo e Judiciário possuem funções próprias e controles recíprocos, respeitando a Constituição.",
  ],
  [
    "Ciências Humanas",
    4,
    "Escala cartográfica",
    "Em um mapa de escala 1:100.000, uma distância de 3 cm equivale a:",
    ["300 m", "3 km", "30 km", "300 km"],
    1,
    [
      "300 m corresponderiam a 0,3 cm nessa escala.",
      "3 × 100.000 = 300.000 cm = 3.000 m = 3 km.",
      "30 km corresponderiam a 30 cm.",
      "300 km corresponderiam a 300 cm.",
    ],
    "A escala usa a mesma unidade nos dois lados. Multiplique e depois converta centímetros em metros ou quilômetros.",
  ],
  [
    "Ciências Humanas",
    5,
    "Análise de fontes",
    "Dois jornais de uma mesma época descrevem um evento de formas diferentes. A análise histórica deve:",
    [
      "Descartar ambos",
      "Aceitar apenas o mais antigo",
      "Comparar contexto, autoria e outras evidências",
      "Escolher o que confirma uma opinião prévia",
    ],
    2,
    [
      "A divergência pode revelar perspectivas relevantes.",
      "A antiguidade por si só não garante confiabilidade.",
      "A crítica das fontes compara autoria, contexto, interesses e evidências independentes.",
      "Confirmar apenas uma opinião prévia gera viés de confirmação.",
    ],
    "Fontes históricas são produzidas em contextos específicos. Compare perspectivas e evidências antes de construir uma interpretação.",
  ],
  [
    "Informática",
    1,
    "Segurança digital",
    "Qual senha tende a oferecer maior resistência a tentativas de adivinhação?",
    [
      "12345678",
      "Seu primeiro nome",
      "Uma frase longa, exclusiva e imprevisível",
      "Sua data de nascimento",
    ],
    2,
    [
      "Sequências comuns são facilmente testadas.",
      "Nomes são previsíveis.",
      "Comprimento, imprevisibilidade e exclusividade fortalecem a senha. Use um gerenciador.",
      "Datas pessoais podem ser descobertas.",
    ],
    "Use senhas únicas e longas e ative a verificação em duas etapas quando disponível.",
  ],
  [
    "Informática",
    2,
    "Planilhas",
    "Em uma planilha configurada em português, qual fórmula soma A1 até A5?",
    ["=SOMA(A1:A5)", "=SOMA(A1;A5)", "=MÉDIA(A1:A5)", "=TOTAL(A1:A5)"],
    0,
    [
      "O sinal de dois-pontos representa o intervalo completo A1:A5.",
      "O ponto e vírgula separa argumentos: somaria apenas A1 e A5.",
      "MÉDIA calcula a média aritmética.",
      "TOTAL não é a função padrão de soma.",
    ],
    "Em planilhas, “:” indica um intervalo contínuo de células. SOMA adiciona os valores numéricos do intervalo.",
  ],
  [
    "Informática",
    3,
    "Redes",
    "O protocolo HTTPS acrescenta principalmente qual proteção à comunicação HTTP?",
    [
      "Criptografia em trânsito e autenticação do servidor",
      "Garantia de que o site é honesto",
      "Remoção de todos os vírus",
      "Internet sem conexão",
    ],
    0,
    [
      "TLS protege os dados em trânsito e autentica o servidor por certificados.",
      "Sites maliciosos também podem usar HTTPS.",
      "HTTPS não substitui medidas contra malware.",
      "HTTPS depende de uma conexão de rede.",
    ],
    "HTTPS protege a comunicação, mas não garante que o conteúdo ou o responsável pelo site seja confiável.",
  ],
  [
    "Informática",
    4,
    "Referências de células",
    "Ao copiar a fórmula =$A$1*B1 de C1 para C2, ela se torna:",
    ["=$A$2*B2", "=$A$1*B2", "=A2*B2", "=$A$1*B1"],
    1,
    [
      "$A$1 é uma referência absoluta e não muda.",
      "A referência absoluta $A$1 permanece; a relativa B1 passa a B2.",
      "A cópia não remove os sinais de referência absoluta.",
      "B1 é relativa e muda ao copiar uma linha abaixo.",
    ],
    "O símbolo $ fixa linha ou coluna. Referências absolutas permanecem inalteradas ao copiar fórmulas.",
  ],
  [
    "Informática",
    5,
    "Backup",
    "A estratégia de backup 3-2-1 recomenda:",
    [
      "Três senhas e dois usuários",
      "Três cópias, em dois tipos de mídia, com uma fora do local",
      "Uma cópia atualizada a cada três anos",
      "Três arquivos na mesma pasta",
    ],
    1,
    [
      "A estratégia trata de cópias dos dados.",
      "São três cópias dos dados, incluindo a original, em dois tipos de mídia, com uma cópia fora do local.",
      "Backups devem seguir uma frequência compatível com a importância dos dados.",
      "O mesmo dispositivo representa um único ponto de falha.",
    ],
    "Backups precisam ser independentes e testados. Uma cópia desconectada ou imutável ajuda a proteger contra ransomware.",
  ],
  [
    "Conhecimentos Específicos",
    1,
    "Administração pública",
    "Qual princípio exige que a Administração Pública atue conforme a lei?",
    ["Publicidade", "Legalidade", "Eficiência", "Impessoalidade"],
    1,
    [
      "Publicidade trata da transparência dos atos.",
      "Legalidade vincula a atuação administrativa à lei e ao ordenamento jurídico.",
      "Eficiência busca bons resultados no uso de recursos.",
      "Impessoalidade se relaciona à finalidade pública e à ausência de favorecimentos.",
    ],
    "Os princípios expressos do art. 37 da Constituição são legalidade, impessoalidade, moralidade, publicidade e eficiência.",
  ],
  [
    "Conhecimentos Específicos",
    2,
    "Atendimento",
    "Ao atender uma pessoa com uma dúvida, a atitude mais adequada é:",
    [
      "Interromper e presumir o problema",
      "Ouvir, confirmar a necessidade e orientar com clareza",
      "Usar apenas termos técnicos",
      "Prometer uma solução impossível",
    ],
    1,
    [
      "Presumir pode levar a uma orientação equivocada.",
      "A escuta ativa e a clareza ajudam a entender e resolver a necessidade.",
      "Termos técnicos sem explicação dificultam o atendimento.",
      "Promessas irreais prejudicam a confiança.",
    ],
    "No atendimento, ouça com atenção, confirme o entendimento e informe limites e próximos passos de forma respeitosa.",
  ],
  [
    "Conhecimentos Específicos",
    3,
    "Gestão",
    "No ciclo PDCA, a etapa Check corresponde a:",
    ["Planejar", "Executar", "Verificar os resultados", "Agir corretivamente"],
    2,
    [
      "Planejar é Plan.",
      "Executar é Do.",
      "Check é verificar resultados e compará-los às metas.",
      "Agir corretivamente é Act.",
    ],
    "PDCA significa Plan, Do, Check, Act: planejar, executar, verificar e agir para melhorar continuamente.",
  ],
  [
    "Conhecimentos Específicos",
    4,
    "Ética e impessoalidade",
    "Um servidor favorece um familiar em um atendimento, sem critério legal. Qual princípio é diretamente violado?",
    ["Impessoalidade", "Especialidade", "Continuidade", "Autotutela"],
    0,
    [
      "O favorecimento pessoal contraria a impessoalidade.",
      "Especialidade se refere à atuação vinculada às finalidades da entidade.",
      "Continuidade trata da manutenção dos serviços públicos.",
      "Autotutela é o controle da Administração sobre seus atos.",
    ],
    "Critérios objetivos e finalidade pública orientam a atuação impessoal. Relações pessoais não devem determinar privilégios.",
  ],
  [
    "Conhecimentos Específicos",
    5,
    "Gestão de estoques",
    "Demanda média: 10 unidades por dia; prazo de reposição: 5 dias; estoque de segurança: 20 unidades. Qual é o ponto de pedido?",
    ["30", "50", "70", "100"],
    2,
    [
      "30 não cobre o consumo durante a reposição mais a segurança.",
      "50 cobre o prazo, mas ignora o estoque de segurança.",
      "Ponto de pedido = 10 × 5 + 20 = 70 unidades.",
      "100 excede o valor calculado pelos dados do enunciado.",
    ],
    "O ponto de pedido considera o consumo esperado durante o prazo de reposição, acrescido do estoque de segurança.",
  ],
];
export const questions: Question[] = raw.map((r, i) => ({
  id: `w-${i + 1}`,
  subject: r[0],
  level: r[1] as Question["level"],
  topic: r[2],
  prompt: r[3],
  options: r[4],
  correct: r[5],
  explanations: r[6],
  lesson: r[7],
  kind:
    r[0] === "Conhecimentos Específicos" || r[0] === "Informática"
      ? "concurso"
      : "universal",
}));
export function relevantSubjects(type: GoalType): Subject[] {
  return type === "concurso"
    ? [subjects[0], subjects[1], subjects[4], subjects[5]]
    : type === "outros"
      ? subjects
      : subjects.slice(0, 4);
}
export function selectQuestions(
  type: GoalType,
  count = 5,
  subject?: string,
  previousIds: string[] = [],
  seed = 0,
): Question[] {
  const pool = questions.filter((q) =>
    subject
      ? q.subject === subject
      : relevantSubjects(type).includes(q.subject),
  );
  const ordered = [...pool].sort(
    (a, b) =>
      a.level - b.level ||
      ((Number(a.id.slice(2)) + seed) % 7) -
        ((Number(b.id.slice(2)) + seed) % 7),
  );
  const used = new Set<string>();
  const selected: Question[] = [];
  for (let i = 0; i < count; i++) {
    const level = (i % 5) + 1;
    const candidates = ordered.filter((q) => !used.has(q.id));
    const choose = candidates.filter((q) => q.level === level);
    const q =
      choose.find((q) => !previousIds.includes(q.id)) ??
      choose[0] ??
      candidates[0];
    if (q) {
      used.add(q.id);
      selected.push(q);
    }
  }
  return selected;
}
export const officialExams = [
  {
    title: "ENEM",
    org: "INEP · Ministério da Educação",
    description: "Cadernos de questões e gabaritos oficiais, por edição.",
    url: "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    type: "enem",
  },
  {
    title: "FUVEST",
    org: "Universidade de São Paulo",
    description: "Acervo oficial de provas e respostas do vestibular.",
    url: "https://www.fuvest.br/acervo-vestibular/",
    type: "vestibular",
  },
  {
    title: "Concursos FGV",
    org: "FGV Conhecimento",
    description:
      "Encontre seu concurso e consulte o edital e os documentos oficiais.",
    url: "https://conhecimento.fgv.br/concursos",
    type: "concurso",
  },
  {
    title: "Cebraspe",
    org: "Centro de seleção",
    description: "Consulte os concursos e suas páginas oficiais.",
    url: "https://www.cebraspe.org.br/concursos/",
    type: "concurso",
  },
];
