import Calculator from "../Calculator/Calculator";
import Footer from "../footer/Footer";
import NavBar from "../navBar/NavBar";
import * as shared from "../shared/styles";

function CalculatorPage() {
  return (
    <shared.pageBackgroundDiv>
      <NavBar />
      <shared.pageHeader>Simple Calculator</shared.pageHeader>
      <Calculator></Calculator>
      <p style={{ padding: "0px 50px", fontSize: "9px" }}> Try and break me (it won't be that hard).</p>
      <div style={{ position: "bottom", bottom: "0px", width: "100%" }}>
        <Footer></Footer>
      </div>

    </shared.pageBackgroundDiv>
  );
}

export default CalculatorPage;
