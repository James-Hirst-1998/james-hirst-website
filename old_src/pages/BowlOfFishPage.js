import Footer from "../footer/Footer";
import NavBar from "../navBar/NavBar";
import * as shared from "../shared/styles";
import BowlOfFish from "../Coding/BowlOfFish/Controller";


function BowlOfFishPage() {
    return (
        <shared.pageBackgroundDiv
            className="BowlOfFishPage"
        >
            <NavBar></NavBar>
            <h1 style={{ display: "flex", justifyContent: "center" }}>Bowl of Fish</h1>

            <BowlOfFish></BowlOfFish>
            <Footer></Footer>
        </shared.pageBackgroundDiv>
    );
}

export default BowlOfFishPage;
