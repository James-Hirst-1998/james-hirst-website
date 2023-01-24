import NavBar from "../navBar/NavBar";
import Footer from "../footer/Footer"
import * as shared from "../shared/styles";
import Home from "../Home/Home";

function HomePage() {
  return (
    <shared.pageBackgroundDiv className="Homepage">
      <NavBar></NavBar>

      <Home></Home>

      <div style={{ position: "bottom", bottom: "0px", width: "100%" }}>
        <Footer></Footer>
      </div>
    </shared.pageBackgroundDiv>
  );
}

export default HomePage;
