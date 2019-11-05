const timer = () => {
  const dfd = $.Deferred();
  setTimeout(() => { dfd.resolve(); }, 600);
  return dfd.promise();
};
