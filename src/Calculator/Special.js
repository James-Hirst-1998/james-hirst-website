const specialHandle = (operation, displayNumber, storeNumber) => {
  let newNumber;

  if (operation === "C") {
    newNumber = "0";
    storeNumber = "0";
  }

  if (operation === ".") {
    if (displayNumber.includes(".")) {
      newNumber = displayNumber;
    } else {
      newNumber = displayNumber + operation;
    }
  }

  return [newNumber, storeNumber];
};

export default specialHandle;
