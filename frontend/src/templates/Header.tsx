import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import Button from 'components/common/Button';
import { toggleTheme } from 'modules/theme';
import { themeSelector } from 'modules/hooks';
import Title from './Title';

const HeaderBlock = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  @media (min-width: 430px) {
    flex-direction: row;
  }
`;

const NavBlock = styled.nav`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  place-items: center;
`;

const StyledNavLink = styled(NavLink)`
  padding: 0 0.25rem;
  margin: 0 0.5rem;
  color: ${({ theme }) => theme.letter_sub};
  border-bottom: 2px solid transparent;
  text-decoration: none;
  font-size: 1.125rem;
  &.active {
    color: ${({ theme }) => theme.letter_main};
    font-weight: bold;
    border-bottom: 2px solid ${({ theme }) => theme.letter_main};
  }
`;

const ToggleButton = styled(Button)`
  font-size: 1.5rem;
`;

type NavLinkBlockProps = {
  to: string;
  children: React.ReactNode;
};

const NavLinkBlock = ({ to, children }: NavLinkBlockProps) => (
  <StyledNavLink
    to={to}
    className={({ isActive }) => (isActive ? 'active' : '')}
  >
    {children}
  </StyledNavLink>
);

function Header() {
  const theme = useSelector(themeSelector);
  const dispatch = useDispatch();
  const onToggleTheme = () => dispatch(toggleTheme());

  return (
    <HeaderBlock>
      <Title />
      <NavBlock>
        <NavLinkBlock to="/">홈</NavLinkBlock>
        <NavLinkBlock to="/routine">루틴</NavLinkBlock>
        <NavLinkBlock to="/record">기록</NavLinkBlock>
        <ToggleButton onClick={onToggleTheme}>
          {theme.mode === 'light' ? <BsFillSunFill /> : <BsFillMoonFill />}
        </ToggleButton>
      </NavBlock>
    </HeaderBlock>
  );
}

export default Header;
