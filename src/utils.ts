export const roundedNumber = () => {
  const randomNumber = Math.random() * 10; // генерируем число от 0 до 10 с 1 знаком после запятой
  return Number(randomNumber.toFixed(2));
};

export const roundedNumber1000 = () => {
  // генерируем число от 1 до 1000 без десятичных знаков
  return Math.floor(Math.random() * 1000) + 1;
};
