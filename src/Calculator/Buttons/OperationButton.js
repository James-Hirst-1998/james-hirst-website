import * as S from "./ButtonStyles.js";

const OperationButton = (props) => {
  const operation = props.operation;
  const onOperationClick = props.onOperationClick;

  return (
    <div className={operation}>
      <S.OperationButton onClick={() => onOperationClick(operation)}>
        {operation}
      </S.OperationButton>
    </div>
  );
};

export default OperationButton;
