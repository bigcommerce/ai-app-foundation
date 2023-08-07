import styled from 'styled-components';

export const StyledButton = styled.button<{ isActive: boolean }>`
  align-items: center;
  appearance: none;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary20 : theme.colors.white};
  border-top: ${({ theme }) => theme.border.box};
  border-left: ${({ theme }) => theme.border.box};
  border-bottom: ${({ theme }) => theme.border.box};
  border-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary30 : theme.colors.secondary30};
  border-right: 0;
  border-radius: 0;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary60 : theme.colors.secondary60};
  cursor: pointer;
  display: inline-flex;
  flex: none;
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  justify-content: center;
  line-height: ${({ theme }) => theme.lineHeight.xLarge};
  outline: none;
  padding: ${({ theme }) => `0 ${theme.spacing.medium}`};
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  width: auto;

  &:focus {
    outline: none;
  }

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.normal};
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.normal};
  }

  &:last-child {
    border-top-right-radius: ${({ theme }) => theme.borderRadius.normal};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.normal};
    border-right: ${({ theme }) => theme.border.box};
    border-right-color: ${({ isActive, theme }) =>
      isActive ? theme.colors.primary30 : theme.colors.secondary30};
  }

  ${({ isActive, theme }) =>
    isActive &&
    `
        + button {
            border-left-color: ${theme.colors.primary30};
        }
    `}
`;
