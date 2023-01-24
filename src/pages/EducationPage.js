import Education from "../Education/Education";
import Footer from "../footer/Footer";
import NavBar from "../navBar/NavBar";

function EducationPage() {
  return (
    <div
      className="EducationPage"
      class="container"
      style={{ backgroundColor: "lightblue", width: "100vw", height: "100vh" }}
    >
      <NavBar></NavBar>
      <Education></Education>
      <div style={{ position: "fixed", bottom: "0px", width: "100%" }}>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default EducationPage;
