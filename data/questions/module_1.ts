import { Question } from '../../Question';

export const module1Description: {
  id: string;
  name: string;
  content: string[];
} = {
  id: '1',
  name: 'Modulo 1',
  content: ['Variabili', 'Sequenza Selezione - Iterazione', 'Oggetti'],
};

export const module1Questions: Question[] = [
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
    '',
    [
      { answer: '', id: 0 },
      { answer: '', id: 1 },
      { answer: '', id: 2 },
      { answer: '', id: 3 },
    ],
    0
  ),
];

/*
PROTO
new Question(
  '',
  [
    { answer: '', id: 0 },
    { answer: '', id: 1 },
    { answer: '', id: 2 },
    { answer: '', id: 3 },
  ],
  0
),

*/
