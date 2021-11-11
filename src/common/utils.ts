export function getRandomString(length?: number) {
  const randomString = (Math.random() + 1)
    .toString(36)
    .substring(length ? length : 7);
  return randomString;
}

export function getRandomAvatar(seed?: string) {
  return `https://avatars.dicebear.com/api/avataaars/${
    seed ? seed : getRandomString()
  }.svg`;
}
