import Discord from 'discord.js';
import { QuizBrain } from '../quiz_brain';
import { shuffleArray } from '../utils';
import { fetchAllNormalUsers } from './helper_controller';

const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '0️⃣'];

let quizBrain = new QuizBrain();

let started = false;
let userInTurn: Discord.User | undefined;
let partecipants: Discord.User[] = [];
let currentPartecipantIndex = -1;

function nextPartecipant(): Discord.User {
  currentPartecipantIndex++;
  if (currentPartecipantIndex >= partecipants.length) {
    currentPartecipantIndex = 0;
  }
  return partecipants[currentPartecipantIndex];
}

export async function startQuiz(message: Discord.Message) {
  if (started) {
    message.channel.send(
      'Il quiz è già partito, rispondi alla domanda per proseguire o scrivi\n **/end_quiz** per terminare'
    );
    return;
  }

  started = true;
  quizBrain = new QuizBrain();
  message.channel.send(`Inizia il Quiz!\nCi sono ${quizBrain.length} domande!`);
  const allUsers = await fetchAllNormalUsers(message);
  partecipants = shuffleArray(allUsers);

  if (partecipants.length === 0) {
    return message.channel.send(
      'Impossibile iniziare quiz senza partecipanti!'
    );
  }
  message.channel.send(
    `Partecipano alla gara i seguenti utenti!\n **${partecipants
      .map((u) => u.username)
      .join(', ')}**`
  );

  createNewQuestionAndSend(message);
}

export function endQuiz(message: Discord.Message): void | PromiseLike<void> {
  if (started) {
    started = false;
    message.channel.send('Il quiz è stato terminato');
  } else {
    message.channel.send(
      `Nessun quiz in corso.
**/start_quiz** per iniziare un nuovo quiz`
    );
  }
}

export function nextUser(message: Discord.Message) {
  if (!message.member?.hasPermission('ADMINISTRATOR')) {
    return message.channel.send("Solo l'admin può skippare il partecipante");
  }
  if (!started) {
    return message.channel.send("Non c'è nessun quiz in corso...");
  }
  message.channel.send('Passiamo al prossimo!');
  userInTurn = nextPartecipant();
  message.channel.send(`${userInTurn} tocca a te!`);
}

async function createNewQuestionAndSend(message: Discord.Message) {
  const channel = message.channel;
  if (!isTest) {
    userInTurn = nextPartecipant();
    channel.send(`${userInTurn} tocca a te!`);
  }
  createAndSend(channel);
}

async function createAndSend(
  channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel
) {
  let question = quizBrain.next();

  let embedPool = new Discord.MessageEmbed()
    .setTitle(question.question)
    .setFooter(quizBrain.toAnswerVisual())
    .setDescription(question.toAnswerOptions((index) => reactions[index]))
    .setColor('GREEN');

  const sendMsg = await channel.send(embedPool);
  for (let i = 0; i < question.answers.length; i++) {
    sendMsg.react(reactions[i]);
  }
}

let isTest = false;

export async function testQuiz(message: Discord.Message) {
  started = true;
  isTest = true;
  quizBrain = new QuizBrain();
  message.channel.send(`Inizia il Quiz!\nCi sono ${quizBrain.length} domande!`);

  createAndSend(message.channel);
}

export async function startFreeQuiz(message: Discord.Message) {
  testQuiz(message);
}

export function answerQuestion(
  reaction: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser
) {
  if (user.bot) return;
  if (!started) return;

  if (alreadyReacted(reaction.message.id)) {
    return;
  }
  if (isTest) return answerQuestionTest(reaction);

  const channel = reaction.message.channel;

  if (user.id !== userInTurn?.id) {
    channel.send(`Non è il tuo turno! Tocca a ${userInTurn}`);
    return;
  }

  addToReacted(reaction.message.id);
  const selectedIndex = reactions.indexOf(reaction.emoji.name);

  const correct = quizBrain.answer(selectedIndex);
  channel.send(correct ? 'Risposta esatta!' : 'Risposta sbagliata!');
  if (!quizBrain.finished) {
    createNewQuestionAndSend(reaction.message);
  } else {
    quizTerminated(channel);
  }
}

function answerQuestionTest(reaction: Discord.MessageReaction) {
  const channel = reaction.message.channel;

  addToReacted(reaction.message.id);
  const selectedIndex = reactions.indexOf(reaction.emoji.name);

  const correct = quizBrain.answer(selectedIndex);
  channel.send(correct ? 'Risposta esatta!' : 'Risposta sbagliata!');
  if (!quizBrain.finished) {
    createNewQuestionAndSend(reaction.message);
  } else {
    quizTerminated(channel);
  }
}

function quizTerminated(
  channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel
) {
  started = false;
  isTest = false;
  channel.send(
    `Quiz terminato hai totalizzato ${quizBrain.correctAnswers} su ${quizBrain.length}`
  );
  let embedPool = new Discord.MessageEmbed()
    .setTitle('Risultato')
    .setDescription(quizBrain.finalResults());

  channel.send(embedPool);
}

const mapReaction: string[] = [];

function alreadyReacted(messageId: string): boolean {
  return mapReaction.some((x) => x === messageId);
}

function addToReacted(messageId: string) {
  mapReaction.push(messageId);
}
