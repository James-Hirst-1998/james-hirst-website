import NavBar from "../navBar/NavBar";
import Footer from "../footer/Footer"
import * as shared from "../shared/styles";
import Home from "../Home/Home";
import { Dimensions } from 'react-native';

const screenDimensions = Dimensions.get('window');

const FooterStyles = () => {

  console.log(screenDimensions)
  let positionValue = screenDimensions.height > 700 && screenDimensions.width > 700 ? "absolute" : "relative";
  return { position: positionValue, bottom: "0px", width: "100%" }
}


function HomePage() {
  return (
    <shared.pageBackgroundDiv className="Homepage">
      <NavBar></NavBar>

      <Home></Home>

      <div style={FooterStyles()}>
        <Footer></Footer>
      </div>
    </shared.pageBackgroundDiv>
  );
}

export default HomePage;
