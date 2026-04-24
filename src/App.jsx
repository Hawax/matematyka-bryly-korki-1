import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEYS = {
  section: 'math-screen-section',
  answers: 'math-screen-answers',
  practice: 'math-screen-practice'
}

const sections = [
  { id: 'start', title: 'Start', minutes: '5 min', icon: BookIcon },
  { id: 'pola', title: 'Pola figur', minutes: '15 min', icon: GridIcon },
  { id: 'ulamki', title: 'Ułamki', minutes: '15 min', icon: MeasureIcon },
  { id: 'siatki', title: 'Siatki i bryły', minutes: '10 min', icon: CubeIcon },
  { id: 'kalendarz', title: 'Kalendarz', minutes: '10 min', icon: CalendarIcon },
  { id: 'powtorka', title: 'Podsumowanie', minutes: '5 min', icon: StarIcon }
]

const lessonTips = {
  start: [
    'Najpierw patrzymy na przykład, dopiero potem zapisujemy działanie.',
    'Jedna mała rzecz naraz daje najlepszy efekt.',
    'Jeśli coś nie wychodzi, wracamy do obrazka albo do liczenia na palcach.'
  ],
  pola: [
    'Pole to liczba małych kawałków, które mieszczą się w figurze.',
    'Kwadrat i prostokąt liczymy przez mnożenie boków.',
    'Trójkąt to połowa prostokąta z taką samą podstawą i wysokością.'
  ],
  ulamki: [
    'Licznik mówi, ile części bierzemy, a mianownik — na ile części dzielimy całość.',
    'Gdy mianowniki są różne, najpierw szukamy wspólnego mianownika.',
    '0,5 to połowa, więc ułamki zwykłe i dziesiętne mówią o tej samej części całości.'
  ],
  siatki: [
    'Siatka to bryła rozłożona na płasko.',
    'Sześcian ma 6 takich samych kwadratowych ścian.',
    'Pole całkowite bryły to suma pól wszystkich ścian.'
  ],
  kalendarz: [
    'Tydzień ma 7 dni, więc po 7 dniach wracamy do tego samego dnia.',
    'Do obliczeń kalendarzowych pomagają małe kroki: dzień po dniu.',
    'Najpierw sprawdzamy miesiąc, potem dni tygodnia.'
  ],
  powtorka: [
    'Na końcu wystarczy krótko powiedzieć, co już jest jasne.',
    'Dobre pytanie brzmi: „Jak wytłumaczysz to własnymi słowami?”.',
    'Nie trzeba robić wszystkiego od razu — najpierw rozumienie, potem tempo.'
  ]
}

const roadmap = [
  {
    title: 'Rozgrzewka',
    time: '5 min',
    text: 'Krótki przegląd tematów i spokojne wejście w zadania.'
  },
  {
    title: 'Pola figur',
    time: '15 min',
    text: 'Liczenie kratek, wzory i proste przykłady z kwadratem, prostokątem i trójkątem.'
  },
  {
    title: 'Ułamki',
    time: '15 min',
    text: 'Ułamki zwykłe i dziesiętne: porównywanie, skracanie, różne mianowniki oraz przykłady z życia.'
  },
  {
    title: 'Siatki i sześcian',
    time: '10 min',
    text: 'Zobaczenie bryły, jej siatki i liczenia pola całkowitego.'
  },
  {
    title: 'Kalendarz',
    time: '10 min',
    text: 'Dni tygodnia, miesiące i krótkie zadania kalendarzowe.'
  },
  {
    title: 'Podsumowanie',
    time: '5 min',
    text: 'Krótka powtórka i zapisanie wyniku pracy.'
  }
]

const fixedQuizzes = {
  pola: [
    {
      id: 'pole-1',
      question: 'Kwadrat ma bok 6 cm. Jakie ma pole?',
      options: ['12 cm²', '36 cm²', '18 cm²'],
      correct: '36 cm²',
      hint: 'Kwadrat liczymy: bok × bok.',
      explanation: '6 × 6 = 36, więc pole kwadratu to 36 cm².'
    },
    {
      id: 'pole-2',
      question: 'Prostokąt ma boki 7 cm i 3 cm. Jakie ma pole?',
      options: ['10 cm²', '21 cm²', '28 cm²'],
      correct: '21 cm²',
      hint: 'Prostokąt liczymy: długość × szerokość.',
      explanation: '7 × 3 = 21, więc pole prostokąta to 21 cm².'
    },
    {
      id: 'pole-3',
      question: 'Trójkąt ma podstawę 8 cm i wysokość 4 cm. Jakie ma pole?',
      options: ['32 cm²', '16 cm²', '12 cm²'],
      correct: '16 cm²',
      hint: 'Najpierw 8 × 4, a potem dzielimy przez 2.',
      explanation: '8 × 4 = 32, a 32 : 2 = 16. Pole trójkąta to 16 cm².'
    },
    {
      id: 'pole-4',
      question: 'Kwadrat ma bok 9 cm. Jakie ma pole?',
      options: ['18 cm²', '81 cm²', '27 cm²'],
      correct: '81 cm²',
      hint: 'Kwadrat to bok razy ten sam bok.',
      explanation: '9 × 9 = 81, więc pole kwadratu to 81 cm².'
    },
    {
      id: 'pole-5',
      question: 'Prostokąt ma boki 5 cm i 6 cm. Jakie ma pole?',
      options: ['11 cm²', '30 cm²', '60 cm²'],
      correct: '30 cm²',
      hint: 'Prostokąt liczymy: a × b.',
      explanation: '5 × 6 = 30, więc pole prostokąta to 30 cm².'
    }
  ],
  ulamki: [
    {
      id: 'dec-1',
      question: '1,5 kg to:',
      options: ['1 kg 5 g', '1 kg 50 g', '1 kg 500 g'],
      correct: '1 kg 500 g',
      hint: '0,5 kg to połowa kilograma.',
      explanation: 'Połowa kilograma to 500 g, więc 1,5 kg = 1 kg 500 g.'
    },
    {
      id: 'dec-2',
      question: '2,75 m to ile centymetrów?',
      options: ['275 cm', '27,5 cm', '2075 cm'],
      correct: '275 cm',
      hint: '1 metr ma 100 cm.',
      explanation: '2,75 m = 2 m i 75 cm, czyli razem 275 cm.'
    },
    {
      id: 'dec-3',
      question: '1,5 godziny to:',
      options: ['1 godzina 5 minut', '1 godzina 30 minut', '1 godzina 50 minut'],
      correct: '1 godzina 30 minut',
      hint: '0,5 godziny to połowa z 60 minut.',
      explanation: 'Połowa godziny to 30 minut, więc 1,5 godziny to 1 godzina 30 minut.'
    },
    {
      id: 'dec-4',
      question: 'Która temperatura jest wyższa?',
      options: ['-2,5°C', '-1,7°C', 'Są takie same'],
      correct: '-1,7°C',
      hint: 'Na liczbach ujemnych bliżej zera znaczy wyżej.',
      explanation: '-1,7°C jest wyżej niż -2,5°C, bo leży bliżej zera.'
    },
    {
      id: 'dec-5',
      question: '0,25 m to ile centymetrów?',
      options: ['25 cm', '2,5 cm', '250 cm'],
      correct: '25 cm',
      hint: '1 metr ma 100 cm.',
      explanation: '0,25 m to 25 setnych metra, czyli 25 cm.'
    },
    {
      id: 'dec-6',
      question: '2,5 godziny to:',
      options: ['2 godziny 5 minut', '2 godziny 30 minut', '2 godziny 50 minut'],
      correct: '2 godziny 30 minut',
      hint: '0,5 godziny to 30 minut.',
      explanation: '2,5 godziny to 2 godziny i jeszcze 30 minut.'
    },
    {
      id: 'frac-1',
      question: 'Który ułamek jest równy 1/2?',
      options: ['2/4', '2/3', '3/5'],
      correct: '2/4',
      hint: 'Rozszerzamy ułamek, mnożąc licznik i mianownik przez tę samą liczbę.',
      explanation: '1/2 = 2/4, bo licznik i mianownik pomnożyliśmy przez 2.'
    },
    {
      id: 'frac-2',
      question: 'Wstaw dobry znak: 3/8 ? 5/8',
      options: ['<', '>', '='],
      correct: '<',
      hint: 'Mianownik jest taki sam, więc porównujemy liczniki.',
      explanation: '3/8 jest mniejsze niż 5/8, bo 3 części to mniej niż 5 części z tej samej całości.'
    },
    {
      id: 'frac-3',
      question: 'Ile to jest 1/2 + 1/4?',
      options: ['2/6', '3/4', '2/4'],
      correct: '3/4',
      hint: 'Najpierw sprowadź do wspólnego mianownika 4.',
      explanation: '1/2 = 2/4, więc 2/4 + 1/4 = 3/4.'
    },
    {
      id: 'frac-4',
      question: 'Ile to jest 5/6 - 1/3?',
      options: ['4/3', '1/2', '2/3'],
      correct: '1/2',
      hint: '1/3 zamień na szóstki.',
      explanation: '1/3 = 2/6, więc 5/6 - 2/6 = 3/6 = 1/2.'
    },
    {
      id: 'frac-5',
      question: 'Skróć ułamek 6/8.',
      options: ['3/4', '4/6', '2/8'],
      correct: '3/4',
      hint: 'Podziel licznik i mianownik przez tę samą liczbę.',
      explanation: '6 i 8 dzielą się przez 2, więc 6/8 = 3/4.'
    }
  ],
  siatki: [
    {
      id: 'net-1',
      question: 'Który rysunek przedstawia siatkę sześcianu?',
      options: ['A', 'B', 'C'],
      correct: 'A',
      hint: 'Szukamy 6 połączonych kwadratów, które można złożyć w sześcian.',
      explanation: 'Opcja A daje układ 6 połączonych kwadratów pasujący do sześcianu.'
    },
    {
      id: 'net-2',
      question: 'Sześcian ma krawędź 2 cm. Jakie jest jego pole całkowite?',
      options: ['8 cm²', '24 cm²', '12 cm²'],
      correct: '24 cm²',
      hint: 'Jedna ściana ma pole 2 × 2, a ścian jest 6.',
      explanation: 'Jedna ściana ma 4 cm², a 6 × 4 = 24 cm².'
    },
    {
      id: 'net-3',
      question: 'Siatka sześcianu składa się z:',
      options: ['4 trójkątów', '6 jednakowych kwadratów', '8 prostokątów'],
      correct: '6 jednakowych kwadratów',
      hint: 'Pomyśl o liczbie ścian sześcianu.',
      explanation: 'Sześcian ma 6 ścian i każda z nich jest kwadratem.'
    },
    {
      id: 'net-4',
      question: 'Sześcian ma krawędź 3 cm. Jakie jest pole jednej ściany?',
      options: ['6 cm²', '9 cm²', '12 cm²'],
      correct: '9 cm²',
      hint: 'Jedna ściana jest kwadratem.',
      explanation: '3 × 3 = 9, więc jedna ściana ma pole 9 cm².'
    },
    {
      id: 'net-5',
      question: 'Każda ściana sześcianu ma pole 16 cm². Jakie jest pole całkowite?',
      options: ['64 cm²', '80 cm²', '96 cm²'],
      correct: '96 cm²',
      hint: 'Sześcian ma 6 ścian.',
      explanation: '6 × 16 = 96, więc pole całkowite to 96 cm².'
    }
  ],
  kalendarz: [
    {
      id: 'cal-1',
      question: 'Jeśli dziś jest poniedziałek, to za 7 dni będzie:',
      options: ['Wtorek', 'Poniedziałek', 'Niedziela'],
      correct: 'Poniedziałek',
      hint: 'Tydzień ma dokładnie 7 dni.',
      explanation: 'Po pełnym tygodniu wracamy do tego samego dnia tygodnia.'
    },
    {
      id: 'cal-2',
      question: 'Jaki dzień tygodnia wypada 18 maja 2026?',
      options: ['Poniedziałek', 'Środa', 'Piątek'],
      correct: 'Poniedziałek',
      hint: 'Sprawdź kolumnę z liczbą 18 w kalendarzu.',
      explanation: '18 maja 2026 wypada w poniedziałek.'
    },
    {
      id: 'cal-3',
      question: 'Które miesiące mają po 30 dni?',
      options: [
        'Styczeń, marzec, maj, lipiec',
        'Kwiecień, czerwiec, wrzesień, listopad',
        'Luty, sierpień, październik, grudzień'
      ],
      correct: 'Kwiecień, czerwiec, wrzesień, listopad',
      hint: 'To cztery miesiące z 30 dniami.',
      explanation: '30 dni mają: kwiecień, czerwiec, wrzesień i listopad.'
    },
    {
      id: 'cal-4',
      question: 'Ile dni minie od 28 maja do 1 czerwca?',
      options: ['3 dni', '4 dni', '5 dni'],
      correct: '4 dni',
      hint: 'Policz kolejno: 29, 30, 31 maja i 1 czerwca.',
      explanation: 'Od 28 maja do 1 czerwca mijają 4 dni.'
    },
    {
      id: 'cal-5',
      question: 'Jeśli dziś jest piątek, to za 14 dni będzie:',
      options: ['Środa', 'Piątek', 'Sobota'],
      correct: 'Piątek',
      hint: '14 dni to 2 pełne tygodnie.',
      explanation: 'Po 14 dniach wracamy do tego samego dnia tygodnia, czyli do piątku.'
    },
    {
      id: 'cal-6',
      question: 'Ile dni ma luty w zwykłym roku?',
      options: ['28 dni', '29 dni', '30 dni'],
      correct: '28 dni',
      hint: 'Nie chodzi o rok przestępny.',
      explanation: 'W zwykłym roku luty ma 28 dni.'
    }
  ]
}

const cubePatterns = [
  {
    value: 'A',
    cells: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
      [1, 3]
    ]
  },
  {
    value: 'B',
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [1, 2]
    ]
  },
  {
    value: 'C',
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [2, 1],
      [4, 1]
    ]
  }
]

const recapPrompts = [
  'Co to jest pole figury?',
  'Jak powiedzieć inaczej, czym jest 1,5 kg?',
  'Ile ścian ma sześcian i z czego składa się jego siatka?',
  'Co dzieje się z dniem tygodnia po 7 dniach?',
  'Który temat dziś wydawał się najłatwiejszy?'
]

const emptyPracticeStats = {
  pola: { attempts: 0, correct: 0 },
  ulamki: { attempts: 0, correct: 0 },
  siatki: { attempts: 0, correct: 0 },
  kalendarz: { attempts: 0, correct: 0 }
}

const taskIdsBySection = Object.fromEntries(
  Object.entries(fixedQuizzes).map(([sectionId, quizzes]) => [
    sectionId,
    quizzes.map((quiz) => quiz.id)
  ])
)

const fixedAnswerKey = Object.fromEntries(
  Object.values(fixedQuizzes)
    .flat()
    .map((quiz) => [quiz.id, quiz.correct])
)

function App() {
  const [activeSection, setActiveSection] = useState(() => readStorage(STORAGE_KEYS.section, 'start'))
  const [answers, setAnswers] = useState(() => readStorage(STORAGE_KEYS.answers, {}))
  const [practiceStats, setPracticeStats] = useState(() =>
    mergePracticeStats(readStorage(STORAGE_KEYS.practice, emptyPracticeStats))
  )
  const [isFullscreen, setIsFullscreen] = useState(() =>
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  )

  useEffect(() => {
    writeStorage(STORAGE_KEYS.section, activeSection)
  }, [activeSection])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.answers, answers)
  }, [answers])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.practice, practiceStats)
  }, [practiceStats])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined
    }

    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)

    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const fixedTaskIds = useMemo(() => Object.values(taskIdsBySection).flat(), [])
  const fixedCorrectCount = fixedTaskIds.filter((id) => answers[id] === fixedAnswerKey[id]).length
  const fixedAttemptedCount = fixedTaskIds.filter((id) => Boolean(answers[id])).length
  const progress = Math.round((fixedCorrectCount / fixedTaskIds.length) * 100)

  const practiceTotals = Object.values(practiceStats).reduce(
    (acc, stat) => ({
      attempts: acc.attempts + stat.attempts,
      correct: acc.correct + stat.correct
    }),
    { attempts: 0, correct: 0 }
  )

  const totalAttempts = fixedAttemptedCount + practiceTotals.attempts
  const totalCorrect = fixedCorrectCount + practiceTotals.correct
  const accuracy = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  const currentIndex = sections.findIndex((section) => section.id === activeSection)
  const currentTips = lessonTips[activeSection] ?? lessonTips.start

  const sectionStats = useMemo(() => {
    return Object.fromEntries(
      Object.entries(taskIdsBySection).map(([sectionId, ids]) => [
        sectionId,
        {
          done: ids.filter((id) => answers[id] === fixedAnswerKey[id]).length,
          total: ids.length
        }
      ])
    )
  }, [answers])

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const registerPracticeResult = (topicKey, wasCorrect) => {
    setPracticeStats((prev) => ({
      ...prev,
      [topicKey]: {
        attempts: prev[topicKey].attempts + 1,
        correct: prev[topicKey].correct + (wasCorrect ? 1 : 0)
      }
    }))
  }

  const goToSection = (id) => setActiveSection(id)
  const goNext = () => setActiveSection(sections[Math.min(currentIndex + 1, sections.length - 1)].id)
  const goPrev = () => setActiveSection(sections[Math.max(currentIndex - 1, 0)].id)

  const toggleFullscreen = async () => {
    if (typeof document === 'undefined') {
      return
    }

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  const printPage = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const resetProgress = () => {
    if (typeof window !== 'undefined') {
      const shouldReset = window.confirm('Wyczyścić zapisane odpowiedzi i wyniki?')
      if (!shouldReset) {
        return
      }
    }

    setAnswers({})
    setPracticeStats(emptyPracticeStats)
    setActiveSection('start')
    clearStorage(STORAGE_KEYS.answers)
    clearStorage(STORAGE_KEYS.practice)
    clearStorage(STORAGE_KEYS.section)
  }

  return (
    <div className={`page-shell ${isFullscreen ? 'page-shell--fullscreen' : ''}`}>
      <header className="hero-card clay-card">
        <span className="hero-blob hero-blob--one" aria-hidden="true" />
        <span className="hero-blob hero-blob--two" aria-hidden="true" />
        <span className="hero-blob hero-blob--three" aria-hidden="true" />

        <div className="hero-copy">
          <span className="eyebrow">Interaktywne materiały na 60 minut</span>
          <h1>Matematyka bez stresu</h1>
          <p>
            Pola figur, ułamki zwykłe i dziesiętne, siatki brył i kalendarz — z prostymi
            wizualizacjami, generatorem ćwiczeń i natychmiastowym wyjaśnieniem.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={() => goToSection('start')}>
              Zaczynamy
            </button>
            <button type="button" className="secondary-button" onClick={toggleFullscreen}>
              {isFullscreen ? 'Zamknij pełny ekran' : 'Pełny ekran'}
            </button>
            <button type="button" className="secondary-button" onClick={printPage}>
              Drukuj / PDF
            </button>
            <button type="button" className="ghost-button" onClick={resetProgress}>
              Wyczyść zapis
            </button>
          </div>

          <div className="hero-badges">
            <div className="stat-pill">
              <StarIcon />
              <span>{fixedCorrectCount} / {fixedTaskIds.length} zadań podstawowych poprawnie</span>
            </div>
            <div className="stat-pill stat-pill--soft">
              <SparkIcon />
              <span>Wyniki zapisują się automatycznie na tym urządzeniu</span>
            </div>
          </div>
        </div>

        <div className="hero-side">
          <div className="mini-progress clay-card">
            <div className="mini-progress__label">
              <span>Postęp materiału</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p>To postęp w zadaniach bazowych. Generatory pozwalają ćwiczyć dalej bez limitu.</p>
          </div>

          <div className="score-card clay-card">
            <h2>Twój zapis wyników</h2>
            <div className="score-grid">
              <div>
                <span>Wszystkie próby</span>
                <strong>{totalAttempts}</strong>
              </div>
              <div>
                <span>Poprawne</span>
                <strong>{totalCorrect}</strong>
              </div>
              <div>
                <span>Skuteczność</span>
                <strong>{accuracy}%</strong>
              </div>
              <div>
                <span>Generator</span>
                <strong>{practiceTotals.correct}</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar clay-card">
          <div className="sidebar-block">
            <h2>Plan lekcji</h2>
            <nav className="sidebar-nav" aria-label="Nawigacja po lekcji">
              {sections.map((section) => {
                const Icon = section.icon
                const stat = sectionStats[section.id]

                return (
                  <button
                    key={section.id}
                    type="button"
                    className={`nav-button ${activeSection === section.id ? 'nav-button--active' : ''}`}
                    onClick={() => goToSection(section.id)}
                  >
                    <span className="nav-button__icon">
                      <Icon />
                    </span>
                    <span className="nav-button__text">
                      <strong>{section.title}</strong>
                      <small>{section.minutes}</small>
                    </span>
                    {stat ? <span className="nav-button__count">{stat.done}/{stat.total}</span> : null}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="sidebar-block">
            <h2>Powiedz to prosto</h2>
            <ul className="tips-list">
              {currentTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="content-panel">
          {activeSection === 'start' && <StartSection onStart={() => goToSection('pola')} onPrint={printPage} />}
          {activeSection === 'pola' && (
            <AreaSection
              answers={answers}
              onAnswer={handleAnswer}
              onPracticeResult={registerPracticeResult}
              onNext={() => goToSection('ulamki')}
            />
          )}
          {activeSection === 'ulamki' && (
            <DecimalsSection
              answers={answers}
              onAnswer={handleAnswer}
              onPracticeResult={registerPracticeResult}
              onNext={() => goToSection('siatki')}
            />
          )}
          {activeSection === 'siatki' && (
            <NetsSection
              answers={answers}
              onAnswer={handleAnswer}
              onPracticeResult={registerPracticeResult}
              onNext={() => goToSection('kalendarz')}
            />
          )}
          {activeSection === 'kalendarz' && (
            <CalendarSection
              answers={answers}
              onAnswer={handleAnswer}
              onPracticeResult={registerPracticeResult}
              onNext={() => goToSection('powtorka')}
            />
          )}
          {activeSection === 'powtorka' && (
            <RecapSection
              fixedCorrectCount={fixedCorrectCount}
              fixedTotal={fixedTaskIds.length}
              totalAttempts={totalAttempts}
              totalCorrect={totalCorrect}
              accuracy={accuracy}
              onPrint={printPage}
            />
          )}

          <div className="section-footer">
            <button type="button" className="secondary-button" onClick={goPrev} disabled={currentIndex === 0}>
              Wstecz
            </button>
            <button
              type="button"
              className="secondary-button secondary-button--accent"
              onClick={goNext}
              disabled={currentIndex === sections.length - 1}
            >
              Dalej
            </button>
          </div>
        </main>
      </div>

      <footer className="page-footer clay-card">Autorstwa Magdalena Sobczak</footer>
      <PrintPack />
    </div>
  )
}

function StartSection({ onStart, onPrint }) {
  return (
    <SectionCard
      title="Plan na całą godzinę"
      subtitle="Każdy temat ma prosty wstęp, wizualizację, ćwiczenia podstawowe i generator kolejnych zadań."
    >
      <div className="roadmap-grid">
        {roadmap.map((item) => (
          <article key={item.title} className="lesson-step clay-card">
            <span className="lesson-step__time">{item.time}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="two-column">
        <article className="info-card">
          <h3>Jak pracować z materiałem?</h3>
          <ul className="plain-list">
            <li>Najpierw obejrzyj wizualizację.</li>
            <li>Potem policz prosty przykład.</li>
            <li>Na końcu sprawdź się w generatorze zadań.</li>
          </ul>
        </article>

        <article className="info-card">
          <h3>Masz do dyspozycji</h3>
          <ul className="plain-list">
            <li>Tryb pełnoekranowy do wspólnego tłumaczenia.</li>
            <li>Automatyczny zapis wyników.</li>
            <li>Wersję do druku / PDF z zadaniami.</li>
          </ul>
        </article>
      </div>

      <div className="cta-row">
        <button type="button" className="primary-button" onClick={onStart}>
          Przejdź do pierwszego tematu
        </button>
        <button type="button" className="secondary-button" onClick={onPrint}>
          Otwórz wersję do druku
        </button>
      </div>
    </SectionCard>
  )
}

function AreaSection({ answers, onAnswer, onPracticeResult, onNext }) {
  return (
    <SectionCard
      title="Pola figur płaskich"
      subtitle="Pole pokazuje, ile miejsca zajmuje figura. Najłatwiej zobaczyć to na kratkach."
    >
      <AreaVisualShowcase />
      <AreaPlayground />
      <TrianglePlayground />

      <div className="quiz-stack">
        {fixedQuizzes.pola.map((quiz) => (
          <ChoiceQuiz
            key={quiz.id}
            {...quiz}
            selected={answers[quiz.id]}
            onAnswer={(value) => onAnswer(quiz.id, value)}
          />
        ))}
      </div>

      <GeneratedNumericPractice
        title="Generator ćwiczeń: pola figur"
        description="Losuj kolejne przykłady i sprawdzaj wynik krok po kroku."
        buildTask={createAreaGeneratorTask}
        topicKey="pola"
        onPracticeResult={onPracticeResult}
      />

      <div className="cta-row">
        <button type="button" className="primary-button" onClick={onNext}>
          Dalej: ułamki
        </button>
      </div>
    </SectionCard>
  )
}

function DecimalsSection({ answers, onAnswer, onPracticeResult, onNext }) {
  return (
    <SectionCard
      title="Ułamki zwykłe i dziesiętne"
      subtitle="Tu ćwiczymy podstawy: porównywanie, skracanie, dodawanie i odejmowanie oraz zamianę na zapis dziesiętny."
    >
      <FractionBridgeVisual />
      <FractionBasicsGrid />
      <FractionOperationsLab />
      <ConversionLab />
      <TemperatureLab />

      <div className="quiz-stack">
        {fixedQuizzes.ulamki.map((quiz) => (
          <ChoiceQuiz
            key={quiz.id}
            {...quiz}
            selected={answers[quiz.id]}
            onAnswer={(value) => onAnswer(quiz.id, value)}
          />
        ))}
      </div>

      <GeneratedFractionChoicePractice
        topicKey="ulamki"
        onPracticeResult={onPracticeResult}
      />

      <GeneratedNumericPractice
        title="Generator ćwiczeń: ułamki dziesiętne w życiu"
        description="Losuj zadania z metrów, gramów i czasu. Przy błędzie dostajesz krótkie wyjaśnienie."
        buildTask={createDecimalGeneratorTask}
        topicKey="ulamki"
        onPracticeResult={onPracticeResult}
      />

      <div className="cta-row">
        <button type="button" className="primary-button" onClick={onNext}>
          Dalej: siatki i bryły
        </button>
      </div>
    </SectionCard>
  )
}

function FractionBridgeVisual() {
  const examples = [
    {
      id: 'half',
      top: 1,
      bottom: 2,
      decimal: '0,5',
      altDecimal: '0.5',
      filled: 1,
      parts: 2,
      description: 'Bierzemy 1 z 2 równych części, czyli połowę.'
    },
    {
      id: 'quarter',
      top: 1,
      bottom: 4,
      decimal: '0,25',
      altDecimal: '0.25',
      filled: 1,
      parts: 4,
      description: 'Bierzemy 1 z 4 równych części, czyli jedną ćwiartkę.'
    },
    {
      id: 'three-quarters',
      top: 3,
      bottom: 4,
      decimal: '0,75',
      altDecimal: '0.75',
      filled: 3,
      parts: 4,
      description: 'Bierzemy 3 z 4 równych części, czyli prawie całość.'
    }
  ]
  const [whole, setWhole] = useState(2)
  const [top, setTop] = useState(3)
  const [bottom, setBottom] = useState(4)

  const safeTop = Math.min(top, bottom - 1)
  const improperTop = whole * bottom + safeTop
  const decimalValue = improperTop / bottom
  const decimalLabel = formatPolishDecimal(decimalValue)
  const mixedParts = Array.from({ length: whole + 1 }, (_, index) =>
    index < whole ? 1 : safeTop / bottom
  )

  return (
    <section className="fraction-lesson clay-card">
      <div className="fraction-lesson__header">
        <div>
          <h3>Jak to czytać?</h3>
          <p>
            To, co jest <strong>nad kreską</strong>, mówi ile części bierzemy.
            To, co jest <strong>pod kreską</strong>, mówi na ile równych części dzielimy całość.
          </p>
        </div>
      </div>

      <div className="fraction-legend">
        <div className="fraction-legend__card">
          <span className="fraction-legend__label">Nad kreską</span>
          <span className="math-fraction math-fraction--big">
            <span className="math-fraction__top math-fraction__top--accent">1</span>
            <span className="math-fraction__bottom math-fraction__bottom--base">4</span>
          </span>
          <p><strong>Licznik</strong> — ile części bierzemy.</p>
        </div>

        <div className="fraction-legend__card">
          <span className="fraction-legend__label">Pod kreską</span>
          <span className="math-fraction math-fraction--big">
            <span className="math-fraction__top math-fraction__top--accent">1</span>
            <span className="math-fraction__bottom math-fraction__bottom--base">4</span>
          </span>
          <p><strong>Mianownik</strong> — na ile części dzielimy całość.</p>
        </div>
      </div>

      <div className="fraction-example-grid">
        {examples.map((example) => (
          <article key={example.id} className="fraction-example">
            <div className="equation-line">
              <span>{example.top} ÷ {example.bottom}</span>
              <strong>=</strong>
              <span className="math-fraction math-fraction--big">
                <span className="math-fraction__top math-fraction__top--accent">{example.top}</span>
                <span className="math-fraction__bottom math-fraction__bottom--base">{example.bottom}</span>
              </span>
              <strong>=</strong>
              <span>{example.decimal}</span>
            </div>

            <div className="fraction-bar" style={{ '--parts': example.parts }}>
              {Array.from({ length: example.parts }, (_, index) => (
                <span
                  key={`${example.id}-${index}`}
                  className={`fraction-bar__piece ${index < example.filled ? 'fraction-bar__piece--filled' : ''}`}
                />
              ))}
            </div>

            <p>{example.description}</p>
            <small>Na kalkulatorze możesz też zobaczyć zapis: {example.altDecimal}</small>
          </article>
        ))}
      </div>

      <div className="mixed-fraction-lab">
        <div className="mixed-fraction-lab__header">
          <div>
            <h3>Liczba mieszana — zrób to sam</h3>
            <p>
              Tu możesz zobaczyć, że na przykład <strong>2 3/4</strong> można zamienić
              na ułamek niewłaściwy i na zapis dziesiętny.
            </p>
          </div>

          <div className="mode-switch" role="group" aria-label="Wybór mianownika">
            {[2, 4, 10].map((value) => (
              <button
                key={value}
                type="button"
                className={`mode-button ${bottom === value ? 'mode-button--active' : ''}`}
                onClick={() => {
                  setBottom(value)
                  setTop((prev) => Math.min(prev, value - 1))
                }}
              >
                /{value}
              </button>
            ))}
          </div>
        </div>

        <div className="mixed-fraction-lab__controls">
          <label className="range-control" htmlFor="whole-range">
            <span>Całe części: <strong>{whole}</strong></span>
            <input
              id="whole-range"
              type="range"
              min="0"
              max="4"
              value={whole}
              onChange={(event) => setWhole(Number(event.target.value))}
            />
          </label>

          <label className="range-control" htmlFor="top-range">
            <span>Licznik: <strong>{safeTop}</strong></span>
            <input
              id="top-range"
              type="range"
              min="0"
              max={bottom - 1}
              value={safeTop}
              onChange={(event) => setTop(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="mixed-equation">
          <div className="mixed-number">
            <span className="mixed-number__whole">{whole}</span>
            <span className="math-fraction math-fraction--big">
              <span className="math-fraction__top math-fraction__top--accent">{safeTop}</span>
              <span className="math-fraction__bottom math-fraction__bottom--base">{bottom}</span>
            </span>
          </div>

          <span className="mixed-equation__equals">=</span>

          <div className="math-fraction math-fraction--big">
            <span className="math-fraction__top math-fraction__top--accent">{improperTop}</span>
            <span className="math-fraction__bottom math-fraction__bottom--base">{bottom}</span>
          </div>

          <span className="mixed-equation__equals">=</span>
          <strong className="mixed-equation__decimal">{decimalLabel}</strong>
        </div>

        <div className="formula-card mixed-equation__explanation">
          <strong>Krok po kroku:</strong> {whole} × {bottom} + {safeTop} = {improperTop}, więc
          {' '}
          {whole}{' '}
          <span className="math-fraction">
            <span className="math-fraction__top math-fraction__top--accent">{safeTop}</span>
            <span className="math-fraction__bottom math-fraction__bottom--base">{bottom}</span>
          </span>
          {' = '}
          <span className="math-fraction">
            <span className="math-fraction__top math-fraction__top--accent">{improperTop}</span>
            <span className="math-fraction__bottom math-fraction__bottom--base">{bottom}</span>
          </span>
          {' = '}
          {decimalLabel}
        </div>

        <div className="mixed-visual-row">
          {mixedParts.map((fill, index) => (
            <div key={`whole-part-${index}`} className="mixed-visual-box">
              <div className="fraction-bar fraction-bar--tight" style={{ '--parts': bottom }}>
                {Array.from({ length: bottom }, (_, pieceIndex) => (
                  <span
                    key={`${index}-${pieceIndex}`}
                    className={`fraction-bar__piece ${
                      pieceIndex < Math.round(fill * bottom) ? 'fraction-bar__piece--filled' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FractionBasicsGrid() {
  const basics = [
    {
      title: 'Rozszerzanie ułamków',
      example: '1/2 = 2/4 = 3/6',
      text: 'Mnożymy licznik i mianownik przez tę samą liczbę. Wartość ułamka się nie zmienia.'
    },
    {
      title: 'Skracanie ułamków',
      example: '6/8 = 3/4',
      text: 'Dzielimy licznik i mianownik przez tę samą liczbę. Dzięki temu zapis jest prostszy.'
    },
    {
      title: 'Porównywanie',
      example: '3/8 < 5/8',
      text: 'Gdy mianownik jest taki sam, większy licznik oznacza większy ułamek.'
    },
    {
      title: 'Różne mianowniki',
      example: '1/2 + 1/3 = 3/6 + 2/6 = 5/6',
      text: 'Najpierw szukamy wspólnego mianownika, a dopiero potem dodajemy lub odejmujemy.'
    }
  ]

  return (
    <div className="visual-grid fraction-basics-grid">
      {basics.map((item) => (
        <article key={item.title} className="info-card">
          <h3>{item.title}</h3>
          <div className="formula-chip">{item.example}</div>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  )
}

function FractionOperationsLab() {
  const examples = [
    {
      title: 'Dodawanie przy różnych mianownikach',
      prompt: '1/2 + 1/3',
      common: '3/6 + 2/6',
      answer: '5/6',
      steps: [
        'Szukamy wspólnego mianownika. Dla 2 i 3 pasuje 6.',
        'Zmieniamy 1/2 na 3/6 i 1/3 na 2/6.',
        'Dodajemy liczniki: 3 + 2 = 5, więc wynik to 5/6.'
      ]
    },
    {
      title: 'Odejmowanie przy różnych mianownikach',
      prompt: '5/6 - 1/3',
      common: '5/6 - 2/6',
      answer: '3/6 = 1/2',
      steps: [
        'Zostawiamy 5/6, a 1/3 zamieniamy na 2/6.',
        'Odejmujemy tylko liczniki: 5 - 2 = 3.',
        'Dostajemy 3/6, a po skróceniu 1/2.'
      ]
    }
  ]

  return (
    <div className="two-column">
      {examples.map((example) => (
        <article key={example.title} className="info-card info-card--accent">
          <h3>{example.title}</h3>
          <div className="equation-line">
            <span>{example.prompt}</span>
            <strong>→</strong>
            <span>{example.common}</span>
            <strong>→</strong>
            <span>{example.answer}</span>
          </div>
          <ol className="steps-list">
            {example.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  )
}

function NetsSection({ answers, onAnswer, onPracticeResult, onNext }) {
  return (
    <SectionCard
      title="Siatki figur geometrycznych"
      subtitle="Sześcian można zobaczyć jako bryłę, a potem rozłożyć na siatkę z 6 kwadratów."
    >
      <div className="two-column">
        <CubeFoldShowcase />
        <CubePlayground />
      </div>

      <NetQuiz selected={answers['net-1']} onAnswer={(value) => onAnswer('net-1', value)} />

      <div className="quiz-stack">
        {fixedQuizzes.siatki
          .filter((quiz) => quiz.id !== 'net-1')
          .map((quiz) => (
            <ChoiceQuiz
              key={quiz.id}
              {...quiz}
              selected={answers[quiz.id]}
              onAnswer={(value) => onAnswer(quiz.id, value)}
            />
          ))}
      </div>

      <GeneratedNumericPractice
        title="Generator ćwiczeń: sześcian"
        description="Losuj nowe sześciany i ćwicz liczenie pola całkowitego tyle razy, ile chcesz."
        buildTask={createCubeGeneratorTask}
        topicKey="siatki"
        onPracticeResult={onPracticeResult}
      />

      <div className="cta-row">
        <button type="button" className="primary-button" onClick={onNext}>
          Dalej: kalendarz
        </button>
      </div>
    </SectionCard>
  )
}

function CalendarSection({ answers, onAnswer, onPracticeResult, onNext }) {
  return (
    <SectionCard
      title="Kalendarz i ćwiczenia"
      subtitle="Liczymy dni małymi krokami: tydzień ma 7 dni, a miesiące mają różną długość."
    >
      <div className="two-column">
        <CalendarFlowLab />
        <TrainingCalendar initialYear={2026} initialMonthIndex={4} />
      </div>

      <MonthLengthVisual />

      <div className="quiz-stack">
        {fixedQuizzes.kalendarz.map((quiz) => (
          <ChoiceQuiz
            key={quiz.id}
            {...quiz}
            selected={answers[quiz.id]}
            onAnswer={(value) => onAnswer(quiz.id, value)}
          />
        ))}
      </div>

      <GeneratedCalendarPractice topicKey="kalendarz" onPracticeResult={onPracticeResult} />

      <div className="cta-row">
        <button type="button" className="primary-button" onClick={onNext}>
          Dalej: podsumowanie
        </button>
      </div>
    </SectionCard>
  )
}

function RecapSection({ fixedCorrectCount, fixedTotal, totalAttempts, totalCorrect, accuracy, onPrint }) {
  return (
    <SectionCard
      title="Podsumowanie"
      subtitle="Na końcu porządkujemy to, co już udało się zrozumieć i zapisujemy wynik pracy."
    >
      <div className="recap-banner clay-card">
        <h3>Wynik zapisany</h3>
        <p>
          Zadania podstawowe: <strong>{fixedCorrectCount} / {fixedTotal}</strong>
        </p>
        <p>
          Wszystkie próby: <strong>{totalCorrect} / {totalAttempts || 0}</strong> • skuteczność <strong>{accuracy}%</strong>
        </p>
      </div>

      <div className="two-column">
        <article className="info-card">
          <h3>Najważniejsze 4 rzeczy</h3>
          <ul className="plain-list">
            <li>Pole to ilość miejsca zajmowanego przez figurę.</li>
            <li>Ułamki można porównywać, skracać i sprowadzać do wspólnego mianownika.</li>
            <li>Siatka to bryła rozłożona na płasko.</li>
            <li>Po 7 dniach wracamy do tego samego dnia tygodnia.</li>
          </ul>
        </article>

        <article className="info-card">
          <h3>Pytania końcowe</h3>
          <ul className="plain-list">
            {recapPrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="cta-row">
        <button type="button" className="secondary-button" onClick={onPrint}>
          Drukuj / PDF
        </button>
      </div>
    </SectionCard>
  )
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="section-card clay-card">
      <div className="section-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function ChoiceQuiz({ id, question, options, correct, hint, explanation, selected, onAnswer }) {
  const [showHint, setShowHint] = useState(false)
  const hasAnswer = Boolean(selected)
  const isCorrect = selected === correct

  return (
    <article className="quiz-card">
      <div className="quiz-card__header">
        <h3>{question}</h3>
        <button type="button" className="ghost-button" onClick={() => setShowHint((prev) => !prev)}>
          {showHint ? 'Ukryj podpowiedź' : 'Pokaż podpowiedź'}
        </button>
      </div>

      {showHint ? <p className="quiz-hint">{hint}</p> : null}

      <div className="quiz-options">
        {options.map((option) => {
          const isSelected = selected === option
          const isWrongSelected = isSelected && !isCorrect
          const shouldGlowCorrect = hasAnswer && option === correct

          return (
            <button
              key={option}
              type="button"
              className={`option-button ${isSelected ? 'option-button--selected' : ''} ${
                isWrongSelected ? 'option-button--wrong' : ''
              } ${shouldGlowCorrect ? 'option-button--correct' : ''}`}
              onClick={() => onAnswer(option)}
            >
              {option}
            </button>
          )
        })}
      </div>

      <div className={`feedback ${isCorrect ? 'feedback--success' : hasAnswer ? 'feedback--warning' : ''}`} aria-live="polite">
        {!hasAnswer && <span>Wybierz odpowiedź i sprawdź, czy pasuje.</span>}
        {hasAnswer && !isCorrect && <span>Jeszcze nie. {explanation}</span>}
        {isCorrect && <span>{explanation}</span>}
      </div>

      <span className="sr-only">Id zadania: {id}</span>
    </article>
  )
}

function GeneratedNumericPractice({ title, description, buildTask, topicKey, onPracticeResult }) {
  const [difficulty, setDifficulty] = useState('easy')
  const [task, setTask] = useState(() => buildTask('easy'))
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [lastSubmissionKey, setLastSubmissionKey] = useState('')

  const normalized = normalizeDecimal(answer)
  const hasAnswer = answer.trim() !== ''
  const isCorrect = hasAnswer && Number.isFinite(normalized) && Math.abs(normalized - task.answer) < 0.0001

  const regenerate = (nextDifficulty = difficulty) => {
    setTask(buildTask(nextDifficulty))
    setAnswer('')
    setChecked(false)
    setLastSubmissionKey('')
  }

  const handleDifficulty = (nextDifficulty) => {
    setDifficulty(nextDifficulty)
    regenerate(nextDifficulty)
  }

  const handleCheck = () => {
    setChecked(true)

    if (!hasAnswer) {
      return
    }

    const submissionKey = `${task.id}:${answer.trim()}`
    if (submissionKey !== lastSubmissionKey) {
      onPracticeResult(topicKey, isCorrect)
      setLastSubmissionKey(submissionKey)
    }
  }

  return (
    <article className="generator-card clay-card">
      <div className="generator-card__header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <div className="difficulty-switch" role="group" aria-label="Wybór poziomu trudności">
          <button
            type="button"
            className={`difficulty-button ${difficulty === 'easy' ? 'difficulty-button--active' : ''}`}
            onClick={() => handleDifficulty('easy')}
          >
            Łatwe
          </button>
          <button
            type="button"
            className={`difficulty-button ${difficulty === 'medium' ? 'difficulty-button--active' : ''}`}
            onClick={() => handleDifficulty('medium')}
          >
            Trochę trudniejsze
          </button>
        </div>
      </div>

      <div className="generator-card__body">
        <p className="generator-prompt">{task.prompt}</p>

        <div className="answer-row">
          <label className="generator-input" htmlFor={`${topicKey}-${title}-answer`}>
            <span>Wpisz wynik</span>
            <div className="generator-input__wrap">
              <input
                id={`${topicKey}-${title}-answer`}
                type="text"
                inputMode="decimal"
                value={answer}
                onChange={(event) => {
                  setAnswer(event.target.value)
                  setChecked(false)
                }}
                placeholder={task.placeholder ?? 'np. 24'}
              />
              {task.unit ? <strong>{task.unit}</strong> : null}
            </div>
          </label>

          <div className="generator-actions">
            <button type="button" className="primary-button" onClick={handleCheck}>
              Sprawdź
            </button>
            <button type="button" className="ghost-button" onClick={() => regenerate()}>
              Wylosuj nowe
            </button>
          </div>
        </div>

        <div className={`feedback ${isCorrect && checked ? 'feedback--success' : checked ? 'feedback--warning' : ''}`} aria-live="polite">
          {!checked && <span>Wpisz odpowiedź i kliknij „Sprawdź”.</span>}
          {checked && !hasAnswer && <span>Najpierw wpisz odpowiedź.</span>}
          {checked && hasAnswer && !isCorrect && (
            <span>
              Jeszcze nie. Dobra odpowiedź to <strong>{task.answerDisplay}</strong>. {task.explanation}
            </span>
          )}
          {checked && isCorrect && <span>Świetnie. {task.explanation}</span>}
        </div>

        {checked && hasAnswer ? (
          <ol className="steps-list">
            {task.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
      </div>
    </article>
  )
}

function GeneratedFractionChoicePractice({ topicKey, onPracticeResult }) {
  const [difficulty, setDifficulty] = useState('easy')
  const [task, setTask] = useState(() => createFractionChoiceTask('easy'))
  const [selected, setSelected] = useState(null)
  const [lastSubmissionKey, setLastSubmissionKey] = useState('')

  const regenerate = (nextDifficulty = difficulty) => {
    setTask(createFractionChoiceTask(nextDifficulty))
    setSelected(null)
    setLastSubmissionKey('')
  }

  const handleDifficulty = (nextDifficulty) => {
    setDifficulty(nextDifficulty)
    regenerate(nextDifficulty)
  }

  const handleSelect = (option) => {
    setSelected(option)

    const submissionKey = `${task.id}:${option}`
    if (submissionKey !== lastSubmissionKey) {
      onPracticeResult(topicKey, option === task.correct)
      setLastSubmissionKey(submissionKey)
    }
  }

  const hasAnswer = Boolean(selected)
  const isCorrect = selected === task.correct

  return (
    <article className="generator-card clay-card">
      <div className="generator-card__header">
        <div>
          <h3>Generator ćwiczeń: ułamki zwykłe</h3>
          <p>Ćwicz skracanie, porównywanie oraz działania z różnymi mianownikami.</p>
        </div>

        <div className="difficulty-switch" role="group" aria-label="Wybór poziomu trudności generatora ułamków">
          <button
            type="button"
            className={`difficulty-button ${difficulty === 'easy' ? 'difficulty-button--active' : ''}`}
            onClick={() => handleDifficulty('easy')}
          >
            Łatwe
          </button>
          <button
            type="button"
            className={`difficulty-button ${difficulty === 'medium' ? 'difficulty-button--active' : ''}`}
            onClick={() => handleDifficulty('medium')}
          >
            Trochę trudniejsze
          </button>
        </div>
      </div>

      <p className="generator-prompt">{task.prompt}</p>

      <div className="quiz-options">
        {task.options.map((option) => {
          const isSelected = selected === option
          const isWrongSelected = isSelected && !isCorrect
          const shouldGlowCorrect = hasAnswer && option === task.correct

          return (
            <button
              key={option}
              type="button"
              className={`option-button ${isSelected ? 'option-button--selected' : ''} ${
                isWrongSelected ? 'option-button--wrong' : ''
              } ${shouldGlowCorrect ? 'option-button--correct' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          )
        })}
      </div>

      <div className="generator-actions generator-actions--inline">
        <button type="button" className="ghost-button" onClick={() => regenerate()}>
          Wylosuj nowe
        </button>
      </div>

      <div className={`feedback ${isCorrect ? 'feedback--success' : hasAnswer ? 'feedback--warning' : ''}`} aria-live="polite">
        {!hasAnswer && <span>Wybierz odpowiedź. Strona od razu pokaże wyjaśnienie.</span>}
        {hasAnswer && !isCorrect && (
          <span>
            Jeszcze nie. Dobra odpowiedź to <strong>{task.correct}</strong>. {task.explanation}
          </span>
        )}
        {isCorrect && <span>Super. {task.explanation}</span>}
      </div>

      {hasAnswer ? (
        <ol className="steps-list">
          {task.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
    </article>
  )
}

function GeneratedCalendarPractice({ topicKey, onPracticeResult }) {
  const [difficulty, setDifficulty] = useState('easy')
  const [task, setTask] = useState(() => createCalendarGeneratorTask('easy'))
  const [selected, setSelected] = useState(null)
  const [lastSubmissionKey, setLastSubmissionKey] = useState('')

  const regenerate = (nextDifficulty = difficulty) => {
    setTask(createCalendarGeneratorTask(nextDifficulty))
    setSelected(null)
    setLastSubmissionKey('')
  }

  const handleDifficulty = (nextDifficulty) => {
    setDifficulty(nextDifficulty)
    regenerate(nextDifficulty)
  }

  const handleSelect = (option) => {
    setSelected(option)

    const submissionKey = `${task.id}:${option}`
    if (submissionKey !== lastSubmissionKey) {
      onPracticeResult(topicKey, option === task.correct)
      setLastSubmissionKey(submissionKey)
    }
  }

  const hasAnswer = Boolean(selected)
  const isCorrect = selected === task.correct

  return (
    <article className="generator-card clay-card">
      <div className="generator-card__header">
        <div>
          <h3>Generator ćwiczeń: kalendarz</h3>
          <p>Losuj nowe pytania o dni tygodnia i licz małymi krokami.</p>
        </div>

        <div className="difficulty-switch" role="group" aria-label="Wybór poziomu trudności generatora kalendarza">
          <button
            type="button"
            className={`difficulty-button ${difficulty === 'easy' ? 'difficulty-button--active' : ''}`}
            onClick={() => handleDifficulty('easy')}
          >
            Łatwe
          </button>
          <button
            type="button"
            className={`difficulty-button ${difficulty === 'medium' ? 'difficulty-button--active' : ''}`}
            onClick={() => handleDifficulty('medium')}
          >
            Trochę trudniejsze
          </button>
        </div>
      </div>

      <p className="generator-prompt">{task.prompt}</p>

      <div className="quiz-options">
        {task.options.map((option) => {
          const isSelected = selected === option
          const isWrongSelected = isSelected && !isCorrect
          const shouldGlowCorrect = hasAnswer && option === task.correct

          return (
            <button
              key={option}
              type="button"
              className={`option-button ${isSelected ? 'option-button--selected' : ''} ${
                isWrongSelected ? 'option-button--wrong' : ''
              } ${shouldGlowCorrect ? 'option-button--correct' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          )
        })}
      </div>

      <div className="generator-actions generator-actions--inline">
        <button type="button" className="ghost-button" onClick={() => regenerate()}>
          Wylosuj nowe
        </button>
      </div>

      <div className={`feedback ${isCorrect ? 'feedback--success' : hasAnswer ? 'feedback--warning' : ''}`} aria-live="polite">
        {!hasAnswer && <span>Wybierz odpowiedź. Strona od razu pokaże wyjaśnienie.</span>}
        {hasAnswer && !isCorrect && (
          <span>
            Jeszcze nie. Dobra odpowiedź to <strong>{task.correct}</strong>. {task.explanation}
          </span>
        )}
        {isCorrect && <span>Super. {task.explanation}</span>}
      </div>
    </article>
  )
}

function AreaVisualShowcase() {
  return (
    <div className="visual-grid visual-grid--3">
      <article className="visual-card">
        <div className="shape-box">
          <svg viewBox="0 0 120 120" className="shape-svg" aria-hidden="true">
            <rect x="22" y="22" width="76" height="76" rx="12" />
            <text x="60" y="112" textAnchor="middle">bok</text>
          </svg>
        </div>
        <h3>Kwadrat</h3>
        <p>Wszystkie boki są równe.</p>
        <div className="formula-chip">pole = bok × bok</div>
      </article>

      <article className="visual-card">
        <div className="shape-box">
          <svg viewBox="0 0 140 120" className="shape-svg" aria-hidden="true">
            <rect x="18" y="30" width="104" height="60" rx="12" />
            <text x="70" y="110" textAnchor="middle">długość × szerokość</text>
          </svg>
        </div>
        <h3>Prostokąt</h3>
        <p>Dwa boki mogą być dłuższe, dwa krótsze.</p>
        <div className="formula-chip">pole = a × b</div>
      </article>

      <article className="visual-card">
        <div className="shape-box">
          <svg viewBox="0 0 140 120" className="shape-svg" aria-hidden="true">
            <path d="M20 92 120 92 70 24Z" />
            <line x1="70" y1="24" x2="70" y2="92" strokeDasharray="6 6" />
            <text x="70" y="110" textAnchor="middle">podstawa i wysokość</text>
          </svg>
        </div>
        <h3>Trójkąt</h3>
        <p>Liczymy połowę prostokąta z tymi samymi wymiarami.</p>
        <div className="formula-chip formula-chip--fraction">
          <span>pole =</span>
          <span className="math-fraction" aria-label="a razy h przez 2">
            <span className="math-fraction__top">a × h</span>
            <span className="math-fraction__bottom">2</span>
          </span>
        </div>
      </article>
    </div>
  )
}

function AreaPlayground() {
  const [width, setWidth] = useState(4)
  const [height, setHeight] = useState(3)
  const total = width * height
  const cells = Array.from({ length: total }, (_, index) => index)

  return (
    <section className="playground-card">
      <div className="playground-card__copy">
        <h3>Zobacz pole na kratkach</h3>
        <p>
          Zmieniaj boki prostokąta i patrz, jak zmienia się liczba kratek. To najprostszy obraz pola.
        </p>

        <label className="range-control" htmlFor="width-range">
          <span>Długość: <strong>{width}</strong></span>
          <input id="width-range" type="range" min="2" max="8" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
        </label>

        <label className="range-control" htmlFor="height-range">
          <span>Szerokość: <strong>{height}</strong></span>
          <input id="height-range" type="range" min="2" max="6" value={height} onChange={(event) => setHeight(Number(event.target.value))} />
        </label>

        <div className="formula-card" aria-live="polite">
          Pole = {width} × {height} = <strong>{total}</strong>
        </div>
      </div>

      <div className="grid-stage">
        <div className="grid-board" style={{ '--columns': width }}>
          {cells.map((cell) => (
            <span key={cell} className="grid-cell" />
          ))}
        </div>
      </div>
    </section>
  )
}

function TrianglePlayground() {
  const [base, setBase] = useState(8)
  const [height, setHeight] = useState(4)
  const area = (base * height) / 2

  const baseWidth = 60 + base * 18
  const triangleHeight = 40 + height * 18
  const leftX = 32
  const rightX = leftX + baseWidth
  const topX = leftX + baseWidth / 2
  const bottomY = 180
  const topY = bottomY - triangleHeight

  return (
    <section className="playground-card playground-card--triangle">
      <div className="playground-card__copy">
        <h3>Wizualizacja pola trójkąta</h3>
        <p>
          Zmieniaj podstawę i wysokość. Trójkąt zajmuje połowę prostokąta o tych samych wymiarach.
        </p>

        <label className="range-control" htmlFor="triangle-base-range">
          <span>Podstawa a: <strong>{base}</strong></span>
          <input
            id="triangle-base-range"
            type="range"
            min="2"
            max="12"
            value={base}
            onChange={(event) => setBase(Number(event.target.value))}
          />
        </label>

        <label className="range-control" htmlFor="triangle-height-range">
          <span>Wysokość h: <strong>{height}</strong></span>
          <input
            id="triangle-height-range"
            type="range"
            min="2"
            max="8"
            value={height}
            onChange={(event) => setHeight(Number(event.target.value))}
          />
        </label>

        <div className="formula-card formula-card--fraction" aria-live="polite">
          <span>Pole</span>
          <strong>=</strong>
          <span className="math-fraction" aria-label={`a razy h przez 2, czyli ${area}`}>
            <span className="math-fraction__top">a × h</span>
            <span className="math-fraction__bottom">2</span>
          </span>
          <strong>=</strong>
          <span className="math-fraction">
            <span className="math-fraction__top">{base} × {height}</span>
            <span className="math-fraction__bottom">2</span>
          </span>
          <strong>= {area} cm²</strong>
        </div>
      </div>

      <div className="triangle-stage">
        <svg viewBox="0 0 300 210" className="triangle-svg" aria-hidden="true">
          <rect
            x={leftX}
            y={topY}
            width={baseWidth}
            height={triangleHeight}
            rx="12"
            className="triangle-svg__rect"
          />
          <path
            d={`M ${leftX} ${bottomY} L ${rightX} ${bottomY} L ${topX} ${topY} Z`}
            className="triangle-svg__shape"
          />
          <line
            x1={topX}
            y1={topY}
            x2={topX}
            y2={bottomY}
            className="triangle-svg__height"
          />
          <text x={(leftX + rightX) / 2} y={200} textAnchor="middle" className="triangle-svg__label">
            a = {base}
          </text>
          <text x={topX + 16} y={(topY + bottomY) / 2} className="triangle-svg__label">
            h = {height}
          </text>
        </svg>

        <div className="triangle-note">
          <div className="triangle-note__swatch triangle-note__swatch--triangle" />
          <span>to pole trójkąta</span>
        </div>
        <div className="triangle-note">
          <div className="triangle-note__swatch triangle-note__swatch--rect" />
          <span>to cały prostokąt o bokach a i h</span>
        </div>
      </div>
    </section>
  )
}

function ConversionLab() {
  const [mode, setMode] = useState('length')
  const [value, setValue] = useState(1.5)

  const modeMap = {
    length: {
      label: 'Metry',
      unit: 'm',
      result: `${value * 100} cm`,
      explanation: `${formatDecimal(value)} m to ${value * 100} cm.`
    },
    weight: {
      label: 'Kilogramy',
      unit: 'kg',
      result: `${value * 1000} g`,
      explanation: `${formatDecimal(value)} kg to ${value * 1000} g.`
    },
    time: {
      label: 'Godziny',
      unit: 'h',
      result: `${value * 60} min`,
      explanation: `${formatDecimal(value)} godziny to ${value * 60} minut.`
    }
  }

  const config = modeMap[mode]
  const ratio = value / 4

  return (
    <section className="conversion-lab clay-card">
      <div className="conversion-lab__header">
        <div>
          <h3>Wizualny przelicznik</h3>
          <p>Przesuwaj suwak i obserwuj, jak jedna liczba zmienia się w centymetry, gramy albo minuty.</p>
        </div>

        <div className="mode-switch" role="group" aria-label="Typ wizualizacji">
          <button type="button" className={`mode-button ${mode === 'length' ? 'mode-button--active' : ''}`} onClick={() => setMode('length')}>Metry</button>
          <button type="button" className={`mode-button ${mode === 'weight' ? 'mode-button--active' : ''}`} onClick={() => setMode('weight')}>Kilogramy</button>
          <button type="button" className={`mode-button ${mode === 'time' ? 'mode-button--active' : ''}`} onClick={() => setMode('time')}>Czas</button>
        </div>
      </div>

      <div className="two-column two-column--tight">
        <div>
          <label className="range-control" htmlFor="conversion-range">
            <span>{config.label}: <strong>{formatDecimal(value)} {config.unit}</strong></span>
            <input
              id="conversion-range"
              type="range"
              min="0.5"
              max="4"
              step="0.25"
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
            />
          </label>

          <div className="formula-card" aria-live="polite">
            {config.explanation}
          </div>
        </div>

        <div className="visual-stage">
          {mode === 'length' ? <MeterVisual ratio={ratio} value={value} /> : null}
          {mode === 'weight' ? <WeightVisual value={value} /> : null}
          {mode === 'time' ? <ClockVisual minutes={value * 60} /> : null}
          <p className="visual-note">Wynik: <strong>{config.result}</strong></p>
        </div>
      </div>
    </section>
  )
}

function MeterVisual({ ratio, value }) {
  return (
    <div className="meter-visual">
      <div className="meter-track meter-track--large">
        <div className="meter-fill" style={{ width: `${ratio * 100}%` }} />
      </div>
      <div className="meter-marks">
        {[0, 1, 2, 3, 4].map((mark) => (
          <span key={mark}>{mark} m</span>
        ))}
      </div>
      <div className="meter-badge">{formatDecimal(value)} m</div>
    </div>
  )
}

function WeightVisual({ value }) {
  const fullBlocks = Math.floor(value)
  const partial = Number((value - fullBlocks).toFixed(2))

  return (
    <div className="weight-visual">
      {[0, 1, 2, 3].map((index) => {
        let fill = 0

        if (index < fullBlocks) {
          fill = 100
        } else if (index === fullBlocks) {
          fill = partial * 100
        }

        return (
          <div key={index} className="weight-block">
            <div className="weight-block__fill" style={{ height: `${fill}%` }} />
            <span>{index + 1} kg</span>
          </div>
        )
      })}
    </div>
  )
}

function ClockVisual({ minutes }) {
  const minuteAngle = (minutes % 60) * 6
  const hourAngle = ((minutes / 60) % 12) * 30

  return (
    <div className="clock-card">
      <div className="clock-face">
        {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => (
          <span key={hour} className={`clock-number clock-number--${hour}`}>{hour}</span>
        ))}
        <span className="clock-hand clock-hand--hour" style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
        <span className="clock-hand clock-hand--minute" style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
        <span className="clock-center" />
      </div>
      <div className="clock-readout">{minutes} minut</div>
    </div>
  )
}

function TemperatureLab() {
  const [temperature, setTemperature] = useState(-1.7)
  const percentage = ((temperature + 5) / 13) * 100
  const scaleLabels = [8, 4, 0, -2, -5]

  return (
    <section className="temperature-lab clay-card">
      <div className="temperature-lab__header">
        <div>
          <h3>Temperatura na osi</h3>
          <p>Przy liczbach ujemnych bliżej zera oznacza wyższą temperaturę.</p>
        </div>
      </div>

      <div className="two-column two-column--tight">
        <div>
          <label className="range-control" htmlFor="temperature-range">
            <span>Temperatura: <strong>{formatDecimal(temperature)}°C</strong></span>
            <input
              id="temperature-range"
              type="range"
              min="-5"
              max="8"
              step="0.1"
              value={temperature}
              onChange={(event) => setTemperature(Number(event.target.value))}
            />
          </label>

          <div className="formula-card">
            Im bardziej w prawo na osi liczbowej, tym temperatura jest wyższa.
          </div>
        </div>

        <div className="temperature-stage">
          <div className="thermo-shell">
            <div className="thermo-column">
              <div className="thermo-fill" style={{ height: `${percentage}%` }} />
              <div className="thermo-marker" style={{ bottom: `${percentage}%` }} />
            </div>
            <div className="thermo-bulb" />
          </div>
          <div className="temperature-scale">
            {scaleLabels.map((label) => (
              <span
                key={label}
                className="temperature-scale__label"
                style={{ bottom: `${((label + 5) / 13) * 100}%` }}
              >
                {label}°C
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CubeFoldShowcase() {
  const [view, setView] = useState('cube')

  return (
    <article className="info-card info-card--accent">
      <div className="cube-showcase__header">
        <div>
          <h3>Bryła i siatka</h3>
          <p>Przełączaj widok i zobacz, że siatka to ten sam sześcian rozłożony na płasko.</p>
        </div>

        <div className="mode-switch" role="group" aria-label="Widok bryły">
          <button type="button" className={`mode-button ${view === 'cube' ? 'mode-button--active' : ''}`} onClick={() => setView('cube')}>Bryła</button>
          <button type="button" className={`mode-button ${view === 'net' ? 'mode-button--active' : ''}`} onClick={() => setView('net')}>Siatka</button>
        </div>
      </div>

      {view === 'cube' ? <CubeScene /> : <NetScene />}

      <div className="formula-card">
        Sześcian ma 6 jednakowych ścian. Gdy rozłożysz go na płasko, dostajesz siatkę z 6 kwadratów.
      </div>
    </article>
  )
}

function CubeScene() {
  return (
    <div className="cube-stage">
      <div className="cube-3d">
        <span className="cube-face cube-face--front">1</span>
        <span className="cube-face cube-face--back">2</span>
        <span className="cube-face cube-face--right">3</span>
        <span className="cube-face cube-face--left">4</span>
        <span className="cube-face cube-face--top">5</span>
        <span className="cube-face cube-face--bottom">6</span>
      </div>
    </div>
  )
}

function NetScene() {
  const pattern = cubePatterns[0]
  return (
    <div className="net-scene">
      <NetShape cells={pattern.cells} label="A" large />
    </div>
  )
}

function CubePlayground() {
  const [edge, setEdge] = useState(2)
  const faceArea = edge * edge
  const totalArea = faceArea * 6
  const tileSize = 28 + edge * 6
  const netCells = [
    { id: 'top', col: 2, row: 1 },
    { id: 'left', col: 1, row: 2 },
    { id: 'front', col: 2, row: 2 },
    { id: 'right', col: 3, row: 2 },
    { id: 'bottom', col: 2, row: 3 },
    { id: 'back', col: 2, row: 4 }
  ]

  return (
    <article className="info-card">
      <h3>Licznik pola sześcianu</h3>
      <label className="range-control" htmlFor="cube-range">
        <span>Krawędź: <strong>{edge} cm</strong></span>
        <input id="cube-range" type="range" min="1" max="6" value={edge} onChange={(event) => setEdge(Number(event.target.value))} />
      </label>

      <div className="mini-math" aria-live="polite">
        <p>Jedna ściana: {edge} × {edge} = <strong>{faceArea} cm²</strong></p>
        <p>Sześć ścian: 6 × {faceArea} = <strong>{totalArea} cm²</strong></p>
      </div>

      <div className="cube-net-grid" style={{ '--cube-face-size': `${tileSize}px` }} aria-hidden="true">
        {netCells.map((cell) => (
          <span
            key={cell.id}
            className="cube-face-tile cube-face-tile--net"
            style={{ gridColumn: cell.col, gridRow: cell.row }}
          >
            <strong>{faceArea}</strong>
            <small>cm²</small>
          </span>
        ))}
      </div>

      <p className="cube-visual-note">
        To jest siatka sześcianu: 6 kwadratów połączonych tak, że po złożeniu tworzą bryłę.
      </p>
    </article>
  )
}

function NetQuiz({ selected, onAnswer }) {
  const correct = 'A'
  const isCorrect = selected === correct
  const hasAnswer = Boolean(selected)

  return (
    <article className="quiz-card">
      <div className="quiz-card__header">
        <h3>Który rysunek najbardziej przypomina siatkę sześcianu?</h3>
      </div>

      <div className="net-options">
        {cubePatterns.map((pattern) => {
          const isSelected = selected === pattern.value
          const isWrongSelected = isSelected && !isCorrect
          const shouldGlowCorrect = hasAnswer && pattern.value === correct

          return (
            <button
              key={pattern.value}
              type="button"
              className={`net-option ${isSelected ? 'net-option--selected' : ''} ${
                isWrongSelected ? 'net-option--wrong' : ''
              } ${shouldGlowCorrect ? 'net-option--correct' : ''}`}
              onClick={() => onAnswer(pattern.value)}
            >
              <NetShape cells={pattern.cells} label={pattern.value} />
            </button>
          )
        })}
      </div>

      <div className={`feedback ${isCorrect ? 'feedback--success' : hasAnswer ? 'feedback--warning' : ''}`} aria-live="polite">
        {!hasAnswer && <span>Wybierz jedną z siatek.</span>}
        {hasAnswer && !isCorrect && <span>Dobra siatka musi mieć 6 połączonych kwadratów, które można złożyć w bryłę.</span>}
        {isCorrect && <span>Tak. Ta siatka składa się z 6 połączonych kwadratów i pasuje do sześcianu.</span>}
      </div>
    </article>
  )
}

function NetShape({ cells, label, large = false }) {
  const minX = Math.min(...cells.map(([x]) => x))
  const maxX = Math.max(...cells.map(([x]) => x))
  const minY = Math.min(...cells.map(([, y]) => y))
  const maxY = Math.max(...cells.map(([, y]) => y))
  const columns = maxX - minX + 1
  const rows = maxY - minY + 1

  return (
    <div className={`net-shape ${large ? 'net-shape--large' : ''}`}>
      <div className="net-grid" style={{ '--columns': columns, '--rows': rows }}>
        {cells.map(([x, y], index) => (
          <span
            key={`${label}-${index}`}
            className="net-square"
            style={{ gridColumn: x - minX + 1, gridRow: y - minY + 1 }}
          />
        ))}
      </div>
      <span className="net-label">Opcja {label}</span>
    </div>
  )
}

function CalendarFlowLab() {
  const weekdays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz']
  const [startIndex, setStartIndex] = useState(0)
  const [shift, setShift] = useState(9)

  const rest = shift % 7
  const targetIndex = (startIndex + rest) % 7

  return (
    <article className="info-card info-card--accent">
      <h3>Skok po dniach tygodnia</h3>
      <p>Wybierz dzień startowy i zobacz, dokąd dojdziesz po kilku dniach.</p>

      <div className="week-chip-row">
        {weekdays.map((day, index) => (
          <button
            key={day}
            type="button"
            className={`week-chip ${index === startIndex ? 'week-chip--active' : ''} ${index === targetIndex ? 'week-chip--target' : ''}`}
            onClick={() => setStartIndex(index)}
          >
            {day}
          </button>
        ))}
      </div>

      <label className="range-control" htmlFor="shift-range">
        <span>Ile dni do przodu? <strong>{shift}</strong></span>
        <input id="shift-range" type="range" min="1" max="20" value={shift} onChange={(event) => setShift(Number(event.target.value))} />
      </label>

      <div className="formula-card">
        {shift} dni to {Math.floor(shift / 7)} pełnych tygodni i jeszcze {rest} dni. Wynik: <strong>{weekdays[targetIndex]}</strong>
      </div>

      <div className="step-dots" aria-hidden="true">
        {Array.from({ length: rest || 7 }, (_, index) => (
          <span key={index} className="step-dot" />
        ))}
      </div>
    </article>
  )
}

function TrainingCalendar({ initialYear, initialMonthIndex }) {
  const [currentDate, setCurrentDate] = useState(() => new Date(initialYear, initialMonthIndex, 1))
  const year = currentDate.getFullYear()
  const monthIndex = currentDate.getMonth()

  const monthName = new Date(year, monthIndex, 1).toLocaleDateString('pl-PL', {
    month: 'long',
    year: 'numeric'
  })

  const calendarCells = buildCalendar(year, monthIndex)
  const weekdays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz']

  const changeMonth = (delta) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  return (
    <article className="calendar-card">
      <div className="calendar-card__header">
        <h3>Kalendarz treningowy</h3>
        <div className="calendar-nav">
          <button type="button" className="calendar-nav__button" onClick={() => changeMonth(-1)}>
            ←
          </button>
          <p className="calendar-title">{capitalize(monthName)}</p>
          <button type="button" className="calendar-nav__button" onClick={() => changeMonth(1)}>
            →
          </button>
        </div>
      </div>
      <div className="calendar-grid calendar-grid--labels">
        {weekdays.map((day) => (
          <span key={day} className="calendar-label">{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {calendarCells.map((day, index) => (
          <span
            key={`${day ?? 'empty'}-${index}`}
            className={`calendar-cell ${day === 18 ? 'calendar-cell--highlight' : ''} ${day === 28 ? 'calendar-cell--soft' : ''}`}
          >
            {day ?? ''}
          </span>
        ))}
      </div>
    </article>
  )
}

function MonthLengthVisual() {
  const months = [
    { name: 'Kwiecień', days: 30 },
    { name: 'Maj', days: 31 },
    { name: 'Czerwiec', days: 30 },
    { name: 'Lipiec', days: 31 },
    { name: 'Luty', days: 28 }
  ]

  return (
    <div className="month-strip">
      {months.map((month) => (
        <article key={month.name} className="month-card">
          <strong>{month.name}</strong>
          <span>{month.days} dni</span>
        </article>
      ))}
    </div>
  )
}

function PrintPack() {
  return (
    <section className="print-pack">
      <h1>Matematyka bez stresu</h1>
      <p>Wersja do druku / PDF</p>

      <div className="print-pack__section">
        <h2>Pola figur płaskich</h2>
        <ul>
          <li>Kwadrat: pole = bok × bok</li>
          <li>Prostokąt: pole = długość × szerokość</li>
          <li>Trójkąt: pole = (podstawa × wysokość) / 2</li>
        </ul>
        <ol>
          <li>Kwadrat ma bok 5 cm. Oblicz pole.</li>
          <li>Prostokąt ma boki 8 cm i 4 cm. Oblicz pole.</li>
          <li>Trójkąt ma podstawę 10 cm i wysokość 6 cm. Oblicz pole.</li>
        </ol>
      </div>

      <div className="print-pack__section">
        <h2>Ułamki zwykłe i dziesiętne</h2>
        <ul>
          <li>Gdy mianowniki są różne, sprowadź ułamki do wspólnego mianownika.</li>
          <li>Rozszerzanie: mnożymy licznik i mianownik przez tę samą liczbę.</li>
          <li>Skracanie: dzielimy licznik i mianownik przez tę samą liczbę.</li>
        </ul>
        <ol>
          <li>Oblicz: 1/2 + 1/4.</li>
          <li>Oblicz: 5/6 - 1/3.</li>
          <li>Skróć ułamek 6/8.</li>
          <li>2,5 m zamień na centymetry.</li>
          <li>1,75 kg zamień na gramy.</li>
          <li>1,5 godziny zamień na minuty.</li>
          <li>Która temperatura jest wyższa: -2,3°C czy -1,6°C?</li>
        </ol>
      </div>

      <div className="print-pack__section">
        <h2>Siatki i sześcian</h2>
        <ol>
          <li>Z ilu kwadratów składa się siatka sześcianu?</li>
          <li>Sześcian ma krawędź 3 cm. Oblicz pole jednej ściany.</li>
          <li>Sześcian ma krawędź 3 cm. Oblicz pole całkowite.</li>
        </ol>
      </div>

      <div className="print-pack__section">
        <h2>Kalendarz</h2>
        <ol>
          <li>Jeśli dziś jest środa, to jaki dzień będzie za 7 dni?</li>
          <li>Ile dni mają: kwiecień, czerwiec, wrzesień i listopad?</li>
          <li>Ile dni mija od 29 maja do 2 czerwca?</li>
        </ol>
      </div>

      <footer>Autorstwa Magdalena Sobczak</footer>
    </section>
  )
}

function buildCalendar(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const mondayIndex = (firstDay + 6) % 7
  const totalDays = new Date(year, monthIndex + 1, 0).getDate()
  const cells = []

  for (let index = 0; index < mondayIndex; index += 1) {
    cells.push(null)
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(day)
  }

  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  return cells
}

function createAreaGeneratorTask(difficulty) {
  const shapes = difficulty === 'easy' ? ['square', 'rectangle'] : ['square', 'rectangle', 'triangle']
  const shape = randomFrom(shapes)
  const taskId = createTaskId('area')

  if (shape === 'square') {
    const side = randomInt(difficulty === 'easy' ? 2 : 4, difficulty === 'easy' ? 8 : 10)
    const answer = side * side

    return {
      id: taskId,
      prompt: `Kwadrat ma bok ${side} cm. Jakie jest jego pole?`,
      answer,
      answerDisplay: `${answer} cm²`,
      explanation: `Pole kwadratu liczymy: ${side} × ${side} = ${answer}.`,
      steps: [
        'Spójrz, jaki jest bok kwadratu.',
        `Pomnóż bok przez ten sam bok: ${side} × ${side}.`,
        `Otrzymujesz ${answer} cm².`
      ],
      unit: 'cm²',
      placeholder: 'np. 36'
    }
  }

  if (shape === 'rectangle') {
    const width = randomInt(2, difficulty === 'easy' ? 7 : 10)
    const height = randomInt(2, difficulty === 'easy' ? 6 : 8)
    const answer = width * height

    return {
      id: taskId,
      prompt: `Prostokąt ma boki ${width} cm i ${height} cm. Jakie jest jego pole?`,
      answer,
      answerDisplay: `${answer} cm²`,
      explanation: `Pole prostokąta liczymy: ${width} × ${height} = ${answer}.`,
      steps: [
        'Znajdź długość i szerokość.',
        `Pomnóż ${width} × ${height}.`,
        `Wynik to ${answer} cm².`
      ],
      unit: 'cm²',
      placeholder: 'np. 24'
    }
  }

  const base = randomEvenInt(4, 12)
  const height = randomInt(2, 8)
  const answer = (base * height) / 2

  return {
    id: taskId,
    prompt: `Trójkąt ma podstawę ${base} cm i wysokość ${height} cm. Jakie jest jego pole?`,
    answer,
    answerDisplay: `${answer} cm²`,
    explanation: `Najpierw ${base} × ${height} = ${base * height}, potem dzielimy przez 2 i dostajemy ${answer}.`,
    steps: [
      `Pomnóż podstawę i wysokość: ${base} × ${height} = ${base * height}.`,
      'Podziel wynik przez 2.',
      `Otrzymujesz ${answer} cm².`
    ],
    unit: 'cm²',
    placeholder: 'np. 16'
  }
}

function createFractionChoiceTask(difficulty) {
  const easyTasks = [
    () => {
      const task = randomFrom([
        { baseTop: 1, baseBottom: 2, factor: 2, wrongA: '2/3', wrongB: '3/5' },
        { baseTop: 1, baseBottom: 3, factor: 2, wrongA: '2/5', wrongB: '3/4' },
        { baseTop: 2, baseBottom: 3, factor: 2, wrongA: '3/5', wrongB: '4/5' },
        { baseTop: 3, baseBottom: 4, factor: 2, wrongA: '4/6', wrongB: '5/8' }
      ])
      const correct = formatFraction(task.baseTop * task.factor, task.baseBottom * task.factor)

      return {
        id: createTaskId('fraction'),
        prompt: `Który ułamek jest równy ${formatFraction(task.baseTop, task.baseBottom)}?`,
        correct,
        options: buildFractionOptions(correct, [task.wrongA, task.wrongB]),
        explanation: 'Rozszerzamy ułamek, mnożąc licznik i mianownik przez tę samą liczbę.',
        steps: [
          `Startujemy od ${formatFraction(task.baseTop, task.baseBottom)}.`,
          `Mnożymy licznik i mianownik przez ${task.factor}.`,
          `Dostajemy ${correct}.`
        ]
      }
    },
    () => {
      const task = randomFrom([
        { left: 3, right: 5, bottom: 8, correct: '<' },
        { left: 4, right: 1, bottom: 7, correct: '>' },
        { left: 5, right: 5, bottom: 9, correct: '=' }
      ])

      return {
        id: createTaskId('fraction'),
        prompt: `Wstaw dobry znak: ${formatFraction(task.left, task.bottom)} ? ${formatFraction(task.right, task.bottom)}`,
        correct: task.correct,
        options: ['<', '>', '='],
        explanation: 'Przy tym samym mianowniku porównujemy liczniki.',
        steps: [
          `Oba ułamki mają mianownik ${task.bottom}.`,
          `Porównujemy tylko liczniki: ${task.left} i ${task.right}.`,
          `Pasujący znak to ${task.correct}.`
        ]
      }
    },
    () => {
      const task = randomFrom([
        { left: 1, right: 2, bottom: 5 },
        { left: 2, right: 1, bottom: 6 },
        { left: 3, right: 2, bottom: 8 }
      ])
      const correct = formatFraction(task.left + task.right, task.bottom)

      return {
        id: createTaskId('fraction'),
        prompt: `Ile to jest ${formatFraction(task.left, task.bottom)} + ${formatFraction(task.right, task.bottom)}?`,
        correct,
        options: buildFractionOptions(correct, [
          correct,
          formatFraction(task.left + task.right + 1, task.bottom),
          formatFraction(Math.max(1, task.left + task.right - 1), task.bottom)
        ]),
        explanation: 'Gdy mianowniki są takie same, dodajemy tylko liczniki.',
        steps: [
          `Mianownik zostaje ${task.bottom}.`,
          `Dodajemy liczniki: ${task.left} + ${task.right} = ${task.left + task.right}.`,
          `Wynik to ${correct}.`
        ]
      }
    },
    () => {
      const task = randomFrom([
        { top: 6, bottom: 8, divisor: 2 },
        { top: 4, bottom: 10, divisor: 2 },
        { top: 9, bottom: 12, divisor: 3 }
      ])
      const correct = formatFraction(task.top / task.divisor, task.bottom / task.divisor)

      return {
        id: createTaskId('fraction'),
        prompt: `Skróć ułamek ${formatFraction(task.top, task.bottom)}.`,
        correct,
        options: buildFractionOptions(correct, [
          correct,
          formatFraction(task.top - task.divisor, task.bottom - task.divisor),
          formatFraction(task.divisor, task.bottom / task.divisor)
        ]),
        explanation: 'Skracamy, dzieląc licznik i mianownik przez tę samą liczbę.',
        steps: [
          `Sprawdź, przez jaką liczbę dzielą się ${task.top} i ${task.bottom}.`,
          `Tu dzielimy obie liczby przez ${task.divisor}.`,
          `Wynik po skróceniu to ${correct}.`
        ]
      }
    }
  ]

  const mediumTasks = [
    () => {
      const task = randomFrom([
        { leftTop: 1, leftBottom: 2, rightTop: 1, rightBottom: 3 },
        { leftTop: 1, leftBottom: 4, rightTop: 1, rightBottom: 2 },
        { leftTop: 2, leftBottom: 3, rightTop: 1, rightBottom: 6 }
      ])
      const commonBottom = leastCommonMultiple(task.leftBottom, task.rightBottom)
      const leftExpanded = task.leftTop * (commonBottom / task.leftBottom)
      const rightExpanded = task.rightTop * (commonBottom / task.rightBottom)
      const simplified = simplifyFraction(leftExpanded + rightExpanded, commonBottom)
      const correct = formatFraction(simplified.top, simplified.bottom)

      return {
        id: createTaskId('fraction'),
        prompt: `Ile to jest ${formatFraction(task.leftTop, task.leftBottom)} + ${formatFraction(task.rightTop, task.rightBottom)}?`,
        correct,
        options: buildFractionOptions(correct, [
          correct,
          formatFraction(Math.max(1, simplified.top - 1), simplified.bottom),
          formatFraction(Math.min(simplified.bottom, simplified.top + 1), simplified.bottom)
        ]),
        explanation: `Najpierw sprowadzamy oba ułamki do mianownika ${commonBottom}, a potem dodajemy liczniki.`,
        steps: [
          `Wspólny mianownik dla ${task.leftBottom} i ${task.rightBottom} to ${commonBottom}.`,
          `${formatFraction(task.leftTop, task.leftBottom)} = ${formatFraction(leftExpanded, commonBottom)}, a ${formatFraction(task.rightTop, task.rightBottom)} = ${formatFraction(rightExpanded, commonBottom)}.`,
          `Dodajemy: ${leftExpanded}/${commonBottom} + ${rightExpanded}/${commonBottom} = ${formatFraction(leftExpanded + rightExpanded, commonBottom)} = ${correct}.`
        ]
      }
    },
    () => {
      const task = randomFrom([
        { leftTop: 5, leftBottom: 6, rightTop: 1, rightBottom: 3 },
        { leftTop: 3, leftBottom: 4, rightTop: 1, rightBottom: 6 },
        { leftTop: 7, leftBottom: 10, rightTop: 1, rightBottom: 5 }
      ])
      const commonBottom = leastCommonMultiple(task.leftBottom, task.rightBottom)
      const leftExpanded = task.leftTop * (commonBottom / task.leftBottom)
      const rightExpanded = task.rightTop * (commonBottom / task.rightBottom)
      const simplified = simplifyFraction(leftExpanded - rightExpanded, commonBottom)
      const correct = formatFraction(simplified.top, simplified.bottom)

      return {
        id: createTaskId('fraction'),
        prompt: `Ile to jest ${formatFraction(task.leftTop, task.leftBottom)} - ${formatFraction(task.rightTop, task.rightBottom)}?`,
        correct,
        options: buildFractionOptions(correct, [
          correct,
          formatFraction(Math.max(1, simplified.top + 1), simplified.bottom),
          formatFraction(Math.max(1, leftExpanded - rightExpanded), commonBottom)
        ]),
        explanation: `Najpierw sprowadzamy oba ułamki do mianownika ${commonBottom}, a potem odejmujemy liczniki.`,
        steps: [
          `Wspólny mianownik dla ${task.leftBottom} i ${task.rightBottom} to ${commonBottom}.`,
          `${formatFraction(task.leftTop, task.leftBottom)} = ${formatFraction(leftExpanded, commonBottom)}, a ${formatFraction(task.rightTop, task.rightBottom)} = ${formatFraction(rightExpanded, commonBottom)}.`,
          `Odejmujemy: ${leftExpanded}/${commonBottom} - ${rightExpanded}/${commonBottom} = ${formatFraction(leftExpanded - rightExpanded, commonBottom)} = ${correct}.`
        ]
      }
    },
    () => {
      const task = randomFrom([
        { leftTop: 2, leftBottom: 3, rightTop: 3, rightBottom: 5, correct: '>' },
        { leftTop: 3, leftBottom: 4, rightTop: 5, rightBottom: 6, correct: '<' },
        { leftTop: 1, leftBottom: 2, rightTop: 4, rightBottom: 8, correct: '=' }
      ])
      const commonBottom = leastCommonMultiple(task.leftBottom, task.rightBottom)
      const leftExpanded = task.leftTop * (commonBottom / task.leftBottom)
      const rightExpanded = task.rightTop * (commonBottom / task.rightBottom)

      return {
        id: createTaskId('fraction'),
        prompt: `Wstaw dobry znak: ${formatFraction(task.leftTop, task.leftBottom)} ? ${formatFraction(task.rightTop, task.rightBottom)}`,
        correct: task.correct,
        options: ['<', '>', '='],
        explanation: `Porównujemy ułamki po sprowadzeniu do wspólnego mianownika ${commonBottom}.`,
        steps: [
          `${formatFraction(task.leftTop, task.leftBottom)} = ${formatFraction(leftExpanded, commonBottom)}.`,
          `${formatFraction(task.rightTop, task.rightBottom)} = ${formatFraction(rightExpanded, commonBottom)}.`,
          `Porównujemy ${leftExpanded}/${commonBottom} i ${rightExpanded}/${commonBottom}, więc pasuje znak ${task.correct}.`
        ]
      }
    }
  ]

  const taskFactory = randomFrom(difficulty === 'easy' ? easyTasks : mediumTasks)
  return taskFactory()
}

function createDecimalGeneratorTask(difficulty) {
  const taskTypes = difficulty === 'easy' ? ['weight', 'length', 'time'] : ['weight', 'length', 'time', 'quarter']
  const type = randomFrom(taskTypes)
  const taskId = createTaskId('dec')

  if (type === 'weight') {
    const value = randomFrom(difficulty === 'easy' ? [1.5, 2.5, 3.5, 4.5] : [1.25, 2.75, 3.5, 4.25])
    const answer = value * 1000

    return {
      id: taskId,
      prompt: `${formatDecimal(value)} kg to ile gramów?`,
      answer,
      answerDisplay: `${answer} g`,
      explanation: `1 kg to 1000 g, więc ${formatDecimal(value)} × 1000 = ${answer}.`,
      steps: [
        'Zapamiętaj: 1 kg = 1000 g.',
        `Pomnóż ${formatDecimal(value)} przez 1000.`,
        `Wynik to ${answer} g.`
      ],
      unit: 'g',
      placeholder: 'np. 1500'
    }
  }

  if (type === 'length') {
    const value = randomFrom(difficulty === 'easy' ? [1.5, 2.25, 3.75, 4.5] : [1.25, 2.75, 3.5, 5.25])
    const answer = value * 100

    return {
      id: taskId,
      prompt: `${formatDecimal(value)} m to ile centymetrów?`,
      answer,
      answerDisplay: `${answer} cm`,
      explanation: `1 metr to 100 cm, więc ${formatDecimal(value)} × 100 = ${answer}.`,
      steps: [
        'Zapamiętaj: 1 m = 100 cm.',
        `Pomnóż ${formatDecimal(value)} przez 100.`,
        `Wynik to ${answer} cm.`
      ],
      unit: 'cm',
      placeholder: 'np. 275'
    }
  }

  if (type === 'time') {
    const value = randomFrom(difficulty === 'easy' ? [0.5, 1.5, 2.5] : [0.5, 1.5, 2.5, 3.5])
    const answer = value * 60

    return {
      id: taskId,
      prompt: `${formatDecimal(value)} godziny to ile minut?`,
      answer,
      answerDisplay: `${answer} min`,
      explanation: `1 godzina to 60 minut, więc ${formatDecimal(value)} × 60 = ${answer}.`,
      steps: [
        'Zapamiętaj: 1 godzina = 60 minut.',
        `Pomnóż ${formatDecimal(value)} przez 60.`,
        `Wynik to ${answer} minut.`
      ],
      unit: 'min',
      placeholder: 'np. 90'
    }
  }

  const value = randomFrom([1.25, 1.75, 2.25, 2.75])
  const answer = value * 60

  return {
    id: taskId,
    prompt: `${formatDecimal(value)} godziny to ile minut?`,
    answer,
    answerDisplay: `${answer} min`,
    explanation: `0,25 godziny to 15 minut, 0,75 godziny to 45 minut. Tu wynik to ${answer} minut.`,
    steps: [
      'Rozbij liczbę na całe godziny i część po przecinku.',
      'Każdą część godziny zamień na minuty.',
      `Łącznie wychodzi ${answer} minut.`
    ],
    unit: 'min',
    placeholder: 'np. 105'
  }
}

function createCubeGeneratorTask(difficulty) {
  const edge = randomInt(1, difficulty === 'easy' ? 4 : 7)
  const faceArea = edge * edge
  const answer = faceArea * 6

  return {
    id: createTaskId('cube'),
    prompt: `Sześcian ma krawędź ${edge} cm. Jakie jest jego pole całkowite?`,
    answer,
    answerDisplay: `${answer} cm²`,
    explanation: `Jedna ściana ma pole ${edge} × ${edge} = ${faceArea}, a ścian jest 6, więc wynik to ${answer}.`,
    steps: [
      `Oblicz pole jednej ściany: ${edge} × ${edge} = ${faceArea}.`,
      'Pamiętaj, że sześcian ma 6 ścian.',
      `Pomnóż 6 × ${faceArea} = ${answer}.`
    ],
    unit: 'cm²',
    placeholder: 'np. 54'
  }
}

function createCalendarGeneratorTask(difficulty) {
  const weekdays = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']
  const startIndex = randomInt(0, weekdays.length - 1)
  const shift = difficulty === 'easy' ? randomInt(1, 6) : randomInt(8, 20)
  const rest = shift % 7
  const correctIndex = (startIndex + rest) % weekdays.length
  const correct = weekdays[correctIndex]
  const options = shuffleArray([
    correct,
    weekdays[(correctIndex + 1) % weekdays.length],
    weekdays[(correctIndex + 6) % weekdays.length]
  ])

  return {
    id: createTaskId('calendar'),
    prompt: `Jeśli dziś jest ${weekdays[startIndex].toLowerCase()}, to za ${shift} dni będzie:`,
    correct,
    options,
    explanation:
      rest === 0
        ? `${shift} dni to pełne tygodnie, więc dzień tygodnia się nie zmienia.`
        : `${shift} dni to pełne tygodnie i jeszcze ${rest} dni. Przesuwamy się więc o ${rest} dni do przodu.`
  }
}

function readStorage(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore write issues
  }
}

function clearStorage(key) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore clear issues
  }
}

function mergePracticeStats(value) {
  return {
    ...emptyPracticeStats,
    ...value,
    pola: { ...emptyPracticeStats.pola, ...(value?.pola ?? {}) },
    ulamki: { ...emptyPracticeStats.ulamki, ...(value?.ulamki ?? {}) },
    siatki: { ...emptyPracticeStats.siatki, ...(value?.siatki ?? {}) },
    kalendarz: { ...emptyPracticeStats.kalendarz, ...(value?.kalendarz ?? {}) }
  }
}

function createTaskId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function normalizeDecimal(value) {
  return Number(value.replace(',', '.').trim())
}

function formatDecimal(value) {
  return String(value).replace('.', ',')
}

function formatFraction(top, bottom) {
  return `${top}/${bottom}`
}

function buildFractionOptions(correct, candidates) {
  const fallbackOptions = ['1/2', '2/3', '3/4', '4/5', '5/6', '2/5', '3/8']
  const unique = []

  for (const option of [correct, ...candidates, ...fallbackOptions]) {
    if (!unique.includes(option)) {
      unique.push(option)
    }
  }

  return shuffleArray(unique.slice(0, 3))
}

function simplifyFraction(top, bottom) {
  const divisor = greatestCommonDivisor(Math.abs(top), Math.abs(bottom))
  return {
    top: top / divisor,
    bottom: bottom / divisor
  }
}

function formatPolishDecimal(value) {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value)
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomEvenInt(min, max) {
  const numbers = []
  for (let value = min; value <= max; value += 1) {
    if (value % 2 === 0) {
      numbers.push(value)
    }
  }
  return randomFrom(numbers)
}

function greatestCommonDivisor(a, b) {
  let left = Math.abs(a)
  let right = Math.abs(b)

  while (right !== 0) {
    const rest = left % right
    left = right
    right = rest
  }

  return left || 1
}

function leastCommonMultiple(a, b) {
  return Math.abs(a * b) / greatestCommonDivisor(a, b)
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function shuffleArray(list) {
  const copy = [...list]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17.5A2.5 2.5 0 0 0 17.5 17H5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5 4.5V20a2 2 0 0 0 2 2h13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function MeasureIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 14.5 14.5 4l5.5 5.5L9.5 20H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 6.5 17.5 12M8.5 10 14 15.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 2.9 5.88 6.5.94-4.7 4.58 1.1 6.48L12 17.8 6.2 20.88l1.1-6.48-4.7-4.58 6.5-.94L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2ZM5 16l.9 2.1L8 19l-2.1.9L5 22l-.9-2.1L2 19l2.1-.9L5 16Zm14 0 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export default App
