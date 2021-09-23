import { Question } from './Question';
import { shuffleArray } from './utils';

const scaffoldingQuestions = [
  new Question(
    'Quali sono i principi della programmazione generica?',
    [
      { answer: 'Polimorfismo, Incapsulamento e ereditarietà', id: 0 },
      { answer: 'Sequenza, Selezione e Iterazione', id: 1 },
      { answer: 'Comando e risposta', id: 2 },
      { answer: 'Override e Overload', id: 3 },
    ],
    1
  ),
  new Question(
    'Quali sono i principi della programmazione OOP?"',
    [
      { answer: 'Polimorfismo, Incapsulamento e ereditarietà', id: 0 },
      { answer: 'Sequenza, Selezione e Iterazione', id: 1 },
      { answer: 'Comando e risposta', id: 2 },
      { answer: 'Override e Overload', id: 3 },
    ],
    0
  ),
  new Question(
    'Quali sono gli iteratori in java?',
    [
      { answer: 'IF-ELSE IF-ELSE, Switch, Operatore ternario', id: 0 },
      { answer: 'For, While, do-while, foreach', id: 1 },
      { answer: 'AND OR NOT', id: 2 },
      { answer: 'Override e Overload', id: 3 },
    ],
    1
  ),
  new Question(
    'Quali sono i selettori in java?',
    [
      { answer: 'IF-ELSE IF-ELSE, Switch, Operatore ternario', id: 0 },
      { answer: 'For, While, do-while, foreach', id: 1 },
      { answer: 'AND OR NOT', id: 2 },
      { answer: 'Override e Overload', id: 3 },
    ],
    0
  ),
  new Question(
    'Quali sono i principali operatori logici in java?',
    [
      { answer: 'IF-ELSE IF-ELSE, Switch, Operatore ternario', id: 0 },
      { answer: 'For, While, do-while, foreach', id: 1 },
      { answer: 'AND OR NOT', id: 2 },
      { answer: 'Override e Overload', id: 3 },
    ],
    2
  ),
];

export class QuizBrain {
  private questions: Question[] = shuffleArray(scaffoldingQuestions);
  private currentQuestionIndex = 0;
  private _answerStates: AnswerResults[];

  constructor() {
    this._answerStates = this.questions.map((_) => ({
      state: AnswerState.notAnswered,
    }));
  }

  get correctAnswers(): number {
    return this._answerStates.filter(
      (answer) => answer.state === AnswerState.correct
    ).length;
  }

  get answerStates() {
    return this._answerStates;
  }

  get previousIndex() {
    return this.currentIndex - 1;
  }

  get lastQuestion(): Question {
    return this.questions[this.previousIndex];
  }

  answer(index: number) {
    const question = this.questions[this.previousIndex];
    let result: AnswerResults = {
      question: question.question,
      answer: question.answers[index].answer,
      state: AnswerState.notAnswered,
    };
    this._answerStates[this.previousIndex] = result;
    if (this.lastQuestion.isCorrect(index)) {
      result.state = AnswerState.correct;
      return true;
    }
    result.state = AnswerState.wrong;
    return false;
  }

  get currentIndex() {
    return this.currentQuestionIndex;
  }

  get length(): number {
    return this.questions.length;
  }

  get finished(): boolean {
    return this.currentQuestionIndex >= this.length;
  }

  next(): Question {
    return this.questions[this.currentQuestionIndex++];
  }

  reset() {
    this.currentQuestionIndex = 0;
  }

  toAnswerVisual(): string {
    return this.answerStates
      .map((x) => {
        switch (x.state) {
          case AnswerState.correct:
            return '✅';
          case AnswerState.wrong:
            return '❌';
          default:
            return '';
        }
      })
      .join('  ');
  }

  finalResults(): string {
    return this.answerStates
      .map((x) => {
        switch (x.state) {
          case AnswerState.correct:
            return `✅ ${x.question}\n${x.answer}`;
          case AnswerState.wrong:
            return `❌ ${x.question}\n${x.answer} `;
          default:
            return '';
        }
      })
      .join('\n\n');
  }
}

interface AnswerResults {
  question?: string;
  answer?: string;
  state: AnswerState;
}

export enum AnswerState {
  correct,
  wrong,
  notAnswered,
}
