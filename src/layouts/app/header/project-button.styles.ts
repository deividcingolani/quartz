import styled from '@emotion/styled';

const Button = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 5px;
  cursor: pointer;

  > ul {
    position: absolute;
    top: 100%;
  }
`;

export default Button;
