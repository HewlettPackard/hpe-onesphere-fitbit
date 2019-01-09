const getYearAndMonthPlusOne = () => {
  const today = new Date();
  const yearUp = Number(today.getFullYear());
  let monthUp = Number(new Date().getMonth());

  monthUp = monthUp + 2;
  if (monthUp < 10) monthUp = `0${monthUp}`;
  
  if (monthUp === 13) {
    monthUp = '01';
    yearUp = yearUp + 1;
  }
  
  if (monthUp === 14) {
    monthUp = '02';
    yearUp = yearUp + 1;
  }
  
  return { yearUp, monthUp };
};

const getPeriodStartsMinus = () => {
  function pad(number) {
    if (number < 10) {
      return `0${number}`;
    }
    return number;
  }

  const now = new Date();
  now.setDate(now.getDate() - 29);
  const periodStart = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}T00%3A00%3A00Z`;
  return periodStart;
};
  
export { getYearAndMonthPlusOne, getPeriodStartsMinus };