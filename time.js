exports.timeStamp = () => {
  const t = new Date();
  return `${t.toDateString()} ${t.toLocaleTimeString()}`;
};
