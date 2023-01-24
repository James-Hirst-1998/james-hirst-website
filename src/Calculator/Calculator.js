import KeyPad from "./KeyPad";
import { useState } from "react";
import specialHandle from "./Special";
import operationHandler from "./Operation";
import * as S from "./styles";

const Calculator = () => {
  const [displayNumber, SetDisplayNumber] = useState("0");
  const [storeNumber, setStoreNumber] = useState("0");
  const [storeOperator, setStoreOperator] = useState("");
  const [removeDisplay, setRemoveDisplay] = useState(false);

  const onNumberClick = (number) => {
    SetDisplayNumber(
      displayNumber === "0" || removeDisplay ? number : displayNumber + number
    );
    setRemoveDisplay(false);
  };

  const onSpecialClick = (character) => {
    const [newNumber, newStoreNumber] = specialHandle(
      character,
      displayNumber,
      storeNumber
    );
    setStoreNumber(newStoreNumber);
    SetDisplayNumber(newNumber);
    if (character === "C") {
      setRemoveDisplay(false);
      setStoreOperator("");
    }
  };

  const onOperationClick = (operation) => {
    const [newStoreNumber, newStoreOperator] = operationHandler(
      storeNumber,
      storeOperator,
      displayNumber,
      operation
    );
    setStoreNumber(newStoreNumber);
    setStoreOperator(newStoreOperator);
    SetDisplayNumber(newStoreNumber);
    setRemoveDisplay(true);
  };

  return (
    <>
      <S.CalculatorContainer>
        <S.displayNumber>{displayNumber}</S.displayNumber>
        <KeyPad
          onNumberClick={(number) => onNumberClick(number)}
          onSpecialClick={(character) => onSpecialClick(character)}
          onOperationClick={(operation) => onOperationClick(operation)}
        ></KeyPad>
      </S.CalculatorContainer>
    </>
  );
};

export default Calculator;
