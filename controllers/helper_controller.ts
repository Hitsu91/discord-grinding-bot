import Discord from 'discord.js';

export async function allUsers(message: Discord.Message) {
  const usersUsernames = await getNormalUsersUsernames(message);
  message.channel.send(
    usersUsernames.length === 0
      ? 'Non ci sono utenti!'
      : usersUsernames.join(', ')
  );
}

export async function randomUser(message: Discord.Message) {
  const users = await fetchAllNormalUsers(message);
  message.channel.send(
    users.length === 0 ? 'Non ci sono utenti!' : `${random(users)}`
  );
}

export async function getRandomNormalOnlineUser(
  message: Discord.Message
): Promise<Discord.User> {
  const users = await fetchAllNormalUsers(message);
  if (users.length === 0) {
    throw new Error('Did not found any common user in the server!');
  }
  return random(users);
}

export async function fetchAllNormalUsers(
  message: Discord.Message
): Promise<Discord.User[]> {
  const members = await message.guild?.members.fetch();

  const users = members
    ?.array()
    .filter((m) => !m.hasPermission('ADMINISTRATOR'))
    .map((x) => x.user)
    .filter((user) => !user.bot && user.presence.status !== 'offline');

  return users ?? [];
}

export function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export async function getNormalUsersUsernames(
  message: Discord.Message
): Promise<string[]> {
  const users = await fetchAllNormalUsers(message);
  return users.map((user) => user.username);
}
