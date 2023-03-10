import * as s from "./styles"

const Footer = () => {
    return (<s.footerDiv className="parent">
        <div className="child_email" style={{ display: "inline-block", padding: "1rem 5rem" }}><a href="mailto:hirst.jj@googlemail.com">hirst.jj@googlemail.com</a></div>
        <div className="child_linkedin" style={{ display: "inline-block", padding: "1rem 5rem" }}>
            <a href="https://uk.linkedin.com/in/james-hirst-783298197" target="_blank" rel="noreferrer">James Hirst</a>
        </div>
        <div className="child_react" style={{ display: "inline-block", padding: "1rem 5rem" }}> Written using React</div>
    </s.footerDiv>)
}

export default Footer