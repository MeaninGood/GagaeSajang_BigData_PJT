import React from 'react';
import styled from 'styled-components';

interface MenuButtonProps {
  menu: string;
  onClick?: any;
}

const MenuButton = ({ menu, onClick }: MenuButtonProps) => {
  return <Wrapper onClick={onClick}>{menu}</Wrapper>;
};

const Wrapper = styled.div`
  width: 80px;
  height: 80px;
  cursor: pointer;

  border: 1px solid #000000;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default MenuButton;
