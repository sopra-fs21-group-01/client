import styled from "styled-components";

export const Button2 = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 600;
  font-size: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  width: ${props => props.width || null};
  height: 35px;
  border: none;
  border-radius: 5px;
  background: rgb(153, 47, 26);
  transition: all 0.3s ease;
  margin-top: 10px;
`;

