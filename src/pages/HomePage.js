import NavBar from "../navBar/NavBar";
import Footer from "../footer/Footer"
import * as shared from "../shared/styles";
import Home from "../Home/Home";

function HomePage() {
  return (
    <shared.pageBackgroundDiv className="Homepage">
      <NavBar></NavBar>

      <Home></Home>
      <Footer></Footer>
    </shared.pageBackgroundDiv>
  );
}

export default HomePage;
