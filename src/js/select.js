const selectHandler = () => {
  $("#select").change(e => {
    let target = $(e.target),
      value = target.val();
    setCities(value);
  });
};

selectHandler();
