import { useNavigate } from "react-router-dom";
import * as S from "./styles.js";

const NavBar = () => {
  const navigate = useNavigate();

  const navTo = (page) => {
    navigate(page);
  };
  return (
    <div>
      <div
        className="NavBar"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="Buttons">
          <S.navButton onClick={() => navTo("/james-hirst-website")}>Home</S.navButton>
          <S.navButton onClick={() => navTo("/coding")}>Coding</S.navButton>
          <S.navButton onClick={() => navTo("/education")}>
            Education
          </S.navButton>
        </div>
      </div>
      <div className="BorderLine">
        <S.underLine></S.underLine>
      </div>
    </div>
  );
};

export default NavBar;
