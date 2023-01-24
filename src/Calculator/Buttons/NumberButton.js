import * as S from "./ButtonStyles.js";

const NumberButton = (props) => {
  const value = props.value;
  const onNumberClick = props.onNumberClick;

  return (
    <div className={value}>
      <S.NumberButton onClick={() => onNumberClick(value)}>
        {value}
      </S.NumberButton>
    </div>
  );
};

export default NumberButton;
