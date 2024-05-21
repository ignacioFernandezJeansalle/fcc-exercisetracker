function validateOrCompleteDate(date) {
  const inputDate = new Date(date).toDateString();
  return inputDate === "Invalid Date" ? new Date().toDateString() : inputDate;
}

module.exports = { validateOrCompleteDate };
