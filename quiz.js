/* =========================================================
   HUMANIZE — quiz.js
   Motor de quiz: seleção, progresso, pontuação, feedback.
   IMPORTANTE: o resultado nunca diagnostica personalidade,
   transtornos ou saúde mental — apenas reflete sobre percepção.
   ========================================================= */

const QUIZZES = [
  {
    id: 'comunicacao',
    title: 'Você percebe a comunicação não verbal?',
    description: 'Situações de conversa e mensagens do dia a dia.',
    questions: [
      {
        text: 'Você manda uma mensagem para um amigo. Ele visualiza e não responde por algumas horas. Qual seria sua primeira interpretação?',
        options: [
          { text: 'Ele está bravo comigo.', correct: false },
          { text: 'Ele não gosta mais de mim.', correct: false },
          { text: 'Pode haver várias explicações.', correct: true },
          { text: 'Vou mandar várias mensagens.', correct: false }
        ],
        feedback: 'Nosso cérebro busca uma explicação rápida para preencher a incerteza — e geralmente escolhe a mais negativa. Na prática, um "visualizado" sem resposta pode significar dezenas de coisas que não têm nada a ver com você.'
      },
      {
        text: 'Durante uma conversa, um amigo cruza os braços e olha para o celular. O que isso indica com certeza?',
        options: [
          { text: 'Que ele está entediado com a conversa.', correct: false },
          { text: 'Nada com certeza — depende do contexto todo.', correct: true },
          { text: 'Que ele não gosta de você.', correct: false },
          { text: 'Que ele está bravo.', correct: false }
        ],
        feedback: 'Um gesto isolado nunca conta a história toda. Frio no ambiente, cansaço ou um hábito qualquer podem explicar a mesma postura. Linguagem corporal só faz sentido combinada com o contexto.'
      },
      {
        text: 'Num grupo, todos riem de uma piada que você não entendeu. Qual atitude tende a gerar menos ansiedade?',
        options: [
          { text: 'Rir junto para não parecer de fora.', correct: false },
          { text: 'Perguntar com naturalidade o que houve.', correct: true },
          { text: 'Ficar em silêncio e se afastar.', correct: false },
          { text: 'Pensar que estão rindo de você.', correct: false }
        ],
        feedback: 'A necessidade de "pertencer na hora" é forte na adolescência, mas perguntar com naturalidade costuma reduzir a ansiedade mais do que fingir — e raramente gera o julgamento que a gente imagina.'
      }
    ]
  },
  {
    id: 'influencia',
    title: 'Quanto você é influenciado pelo ambiente?',
    description: 'Pressão de grupo e decisões do cotidiano.',
    questions: [
      {
        text: 'Seu grupo de amigos decide fazer algo que você não faria sozinho. O que costuma pesar mais nessa hora?',
        options: [
          { text: 'O medo de ser deixado de lado.', correct: true },
          { text: 'A vontade real de fazer aquilo.', correct: false },
          { text: 'A opinião dos seus pais.', correct: false },
          { text: 'Nada disso influencia.', correct: false }
        ],
        feedback: 'O medo da exclusão social é um dos gatilhos mais fortes de comportamento em grupo — e isso não é falta de personalidade, é biologia social funcionando como sempre funcionou.'
      },
      {
        text: 'Você percebe que todos os seus amigos estão usando uma nova rede social. Isso normalmente acontece por quê?',
        options: [
          { text: 'Porque a rede é sempre melhor que as outras.', correct: false },
          { text: 'Prova social: seguimos o que vemos os outros fazendo.', correct: true },
          { text: 'Porque é obrigatório.', correct: false },
          { text: 'Acaso, sem nenhum motivo.', correct: false }
        ],
        feedback: 'Prova social é o nome do fenômeno: usamos o comportamento dos outros como atalho para decidir o que é "certo" fazer, especialmente quando não temos certeza sozinhos.'
      },
      {
        text: 'Um ambiente mais silencioso e sério tende a deixar seu comportamento:',
        options: [
          { text: 'Exatamente igual ao de sempre.', correct: false },
          { text: 'Mais formal, mesmo sem perceber.', correct: true },
          { text: 'Mais barulhento, por reação.', correct: false },
          { text: 'Impossível prever.', correct: false }
        ],
        feedback: 'O ambiente funciona como um roteiro invisível: tendemos a ajustar tom de voz, postura e até vocabulário de acordo com o espaço em que estamos, quase sem decidir isso conscientemente.'
      }
    ]
  }
];

const state = { quiz: null, index: 0, score: 0, answered: false };

document.addEventListener('DOMContentLoaded', () => {
  renderPicker();
  document.getElementById('retry-btn').addEventListener('click', showPicker);
});

function renderPicker() {
  const list = document.getElementById('quiz-list');
  list.innerHTML = '';
  QUIZZES.forEach(q => {
    const card = document.createElement('button');
    card.className = 'quiz-pick-card';
    card.innerHTML = `<h3>${q.title}</h3><p>${q.description}</p>`;
    card.addEventListener('click', () => startQuiz(q.id));
    list.appendChild(card);
  });
}

function startQuiz(id) {
  state.quiz = QUIZZES.find(q => q.id === id);
  state.index = 0;
  state.score = 0;

  document.getElementById('quiz-picker').hidden = true;
  document.getElementById('quiz-result').hidden = true;
  document.getElementById('quiz-player').hidden = false;
  document.getElementById('quiz-title-label').textContent = state.quiz.title;

  renderQuestion();
}

function renderQuestion() {
  state.answered = false;
  const q = state.quiz;
  const question = q.questions[state.index];

  document.getElementById('quiz-progress-label').textContent =
    `Pergunta ${state.index + 1} de ${q.questions.length}`;
  document.getElementById('progress-fill').style.width =
    `${(state.index / q.questions.length) * 100}%`;

  document.getElementById('question-text').textContent = question.text;

  const list = document.getElementById('option-list');
  list.innerHTML = '';
  question.options.forEach(opt => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt.text;
    btn.addEventListener('click', () => selectOption(btn, opt, question));
    li.appendChild(btn);
    list.appendChild(li);
  });

  const feedbackBox = document.getElementById('feedback-box');
  feedbackBox.classList.remove('is-visible');
  document.getElementById('next-btn').disabled = true;
  document.getElementById('next-btn').textContent =
    state.index === q.questions.length - 1 ? 'Ver resultado' : 'Próxima';
}

function selectOption(btn, opt, question) {
  if (state.answered) return;
  state.answered = true;

  const allButtons = document.querySelectorAll('#option-list .option-btn');
  allButtons.forEach(b => { b.disabled = true; });

  if (opt.correct) {
    btn.classList.add('is-correct');
    state.score++;
  } else {
    btn.classList.add('is-wrong');
    allButtons.forEach(b => {
      const match = question.options.find(o => o.text === b.textContent);
      if (match && match.correct) b.classList.add('is-correct');
    });
  }

  const feedbackBox = document.getElementById('feedback-box');
  document.getElementById('feedback-text').textContent = question.feedback;
  feedbackBox.classList.add('is-visible');

  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = false;
  nextBtn.onclick = () => {
    state.index++;
    if (state.index >= state.quiz.questions.length) {
      showResult();
    } else {
      renderQuestion();
    }
  };
}

function showResult() {
  document.getElementById('quiz-player').hidden = true;
  document.getElementById('quiz-result').hidden = false;
  document.getElementById('progress-fill').style.width = '100%';

  const total = state.quiz.questions.length;
  document.getElementById('result-score').textContent = `${state.score}/${total}`;

  const ratio = state.score / total;
  let title, text;
  if (ratio >= 0.8) {
    title = 'Você presta bastante atenção aos detalhes da comunicação.';
    text = 'Você considerou o contexto antes de tirar conclusões rápidas — exatamente o tipo de pausa que evita mal-entendidos no dia a dia.';
  } else if (ratio >= 0.4) {
    title = 'Você percebe boa parte, mas ainda cai em conclusões rápidas às vezes.';
    text = 'Isso é extremamente comum: o cérebro adora atalhos. Perceber quando isso acontece já é o primeiro passo para interpretar situações com mais calma.';
  } else {
    title = 'Este quiz mostrou como é fácil tirar conclusões rápidas.';
    text = 'Não é sobre "acertar" — é sobre notar como reagimos automaticamente antes de considerar outras explicações possíveis.';
  }
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-text').textContent = text;

  saveBestScore(state.quiz.id, state.score, total);
}

function showPicker() {
  document.getElementById('quiz-result').hidden = true;
  document.getElementById('quiz-picker').hidden = false;
}

/* ---------- Progresso salvo localmente (opcional, não é diagnóstico) ---------- */
function saveBestScore(quizId, score, total) {
  try {
    const key = 'humanize_quiz_scores';
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    const current = saved[quizId];
    if (!current || score > current.score) {
      saved[quizId] = { score, total };
      localStorage.setItem(key, JSON.stringify(saved));
    }
  } catch (e) {
    /* localStorage indisponível — segue sem salvar */
  }
}
