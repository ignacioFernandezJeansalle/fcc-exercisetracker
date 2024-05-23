function validateOrCompleteDate(date) {
  const inputDate = new Date(date);

  return inputDate.toString() === "Invalid Date" ? new Date() : inputDate;
}

module.exports = { validateOrCompleteDate };
