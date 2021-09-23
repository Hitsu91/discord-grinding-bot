import Discord from 'discord.js';
import { handleMessages } from './controllers/front_controller';
import { answerQuestion } from './controllers/quiz_controller';

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', handleMessages);

client.on('messageReactionAdd', answerQuestion);

client.login('ODQ1MjUxNzQzMzYwNjE0NDUy.YKeQBw.nFD5F5yVtitA0R5yxSHUTT6N_BA');
