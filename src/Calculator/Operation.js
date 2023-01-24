const operationHandler = (
  storeNumber,
  storeOperator,
  displayNumber,
  operator
) => {
  let newStoreNumber;
  let newStoreOperator;

  if (storeOperator !== "") {
    switch (storeOperator) {
      case "*":
        newStoreNumber = parseFloat(storeNumber) * parseFloat(displayNumber);
        break;
      case "/":
        newStoreNumber = parseFloat(storeNumber) / parseFloat(displayNumber);
        break;
      case "+":
        newStoreNumber = parseFloat(storeNumber) + parseFloat(displayNumber);
        break;
      case "-":
        newStoreNumber = parseFloat(storeNumber) - parseFloat(displayNumber);
        break;
      default:
        break;
    }
  } else {
    newStoreNumber = displayNumber;
  }

  if (operator === "=") {
    newStoreOperator = "";
  } else {
    newStoreOperator = operator;
  }

  return [newStoreNumber, newStoreOperator];
};

export default operationHandler;
