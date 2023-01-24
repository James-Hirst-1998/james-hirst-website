import * as S from "./ButtonStyles.js";

const SpecialButton = (props) => {
  const character = props.character;
  const onSpecialClick = props.onSpecialClick;

  return (
    <div className={character}>
      <S.SpecialButton onClick={() => onSpecialClick(character)}>
        {character}
      </S.SpecialButton>
    </div>
  );
};

export default SpecialButton;
