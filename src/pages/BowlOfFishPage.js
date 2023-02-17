import Footer from "../footer/Footer";
import NavBar from "../navBar/NavBar";
import * as shared from "../shared/styles";
import { Dimensions } from 'react-native';
import BowlOfFish from "../Coding/BowlOfFish/Controller";
const screenDimensions = Dimensions.get('window');
const footerStyles = () => {
    console.log(screenDimensions)
    let positionValue = screenDimensions.height > 700 && screenDimensions.width > 700 ? "absolute" : "relative";
    return { position: positionValue, bottom: "0px", width: "100%" }
}


function BowlOfFishPage() {
    return (
        <shared.pageBackgroundDiv
            className="BowlOfFishPage"
        >
            <NavBar></NavBar>
            <h1 style={{ display: "flex", justifyContent: "center" }}>Bowl of Fish</h1>

            <BowlOfFish></BowlOfFish>

            <div style={footerStyles()}>
                <Footer></Footer>
            </div>
        </shared.pageBackgroundDiv>
    );
}

export default BowlOfFishPage;
