import styled from "styled-components";

const Button = styled.button.attrs({
  className: "pv2 ph3 br2 fw6",
})`
  color: white;
  border: 1px solid;

  background: ${props =>
    props.primary ? "var(--secondary)" : "var(--primary)"};
  border-color: ${props =>
    props.primary ? "var(--secondary)" : "var(--primary)"};
`;

export default Button;
