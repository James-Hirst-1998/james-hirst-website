import Coding from "../Coding/Coding";
import Footer from "../footer/Footer";
import NavBar from "../navBar/NavBar";

function CodingPage() {
  return (
    <div
      className="EducationPage"
      style={{ backgroundColor: "lightblue", width: "100vw", height: "100vh" }}
    >
      <NavBar></NavBar>

      <Coding></Coding>

      <div style={{ position: "fixed", bottom: "0px", width: "100%" }}>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default CodingPage;
