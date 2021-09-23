import Discord from 'discord.js';
import { allUsers, randomUser } from './helper_controller';
import {
  endQuiz,
  nextUser,
  startFreeQuiz,
  startQuiz,
  testQuiz,
} from './quiz_controller';

export async function handleMessages(message: Discord.Message) {
  if (message.author.bot) return;

  const cmd = message.content;

  switch (cmd) {
    case '/start_quiz':
      return startQuiz(message);
    case '/start_free_quiz':
      return startFreeQuiz(message);
    case '/end_quiz':
      return endQuiz(message);
    case '/all_users':
      return allUsers(message);
    case '/random_user':
      return randomUser(message);
    case '/help':
      return helpMenu(message);
    case '/next':
      return nextUser(message);
    case '/test_quiz':
      return testQuiz(message);
  }
}

const botMenu = `
  Lista dei comandi:
  **/start_quiz** Inizia il Quiz
  **/start_free_quiz** Inizia un Quiz Libero
  **/end_quiz** Termina un quiz iniziato
  **/random_user** Nomina un utente casuale
  **/all_users** Lista degli utenti del canale
  **/next** Passiamo la risposta al prossimo utente
  `;

function helpMenu(message: Discord.Message) {
  message.channel.send(botMenu);
}
