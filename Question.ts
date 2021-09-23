import { shuffleArray } from './utils';

export class Question {
  constructor(
    public question: string,
    public answers: Answer[] & { 0: Answer; 1: Answer },
    public correctAnswerId: number
  ) {
    this.randomize();
  }

  isCorrect(index: number) {
    return this.answers[index].id == this.correctAnswerId;
  }

  toAnswerOptions(reactionFromIndex: (index: number) => string): string {
    return this.answers
      .map((val, index) => `${reactionFromIndex(index)} ${val.answer}`)
      .join('\n\n');
  }

  randomize() {
    shuffleArray(this.answers);
  }
}

export interface Answer {
  answer: string;
  id: number;
}
