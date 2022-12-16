import React from 'react';
import { css, Global, useTheme } from '@emotion/react';

const GlobalStyles = () => {
  const theme = useTheme();
  return (
    <Global
      styles={css`
        html {
          height: 100%;
        }
        body {
          margin: 0;
          box-sizing: border-box;
          color: ${theme.letter_main};
          background: ${theme.body};
          font-family: 'Noto Sans KR', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          touch-action: pan-y;
          overflow-y: scroll;
          height: 100%;
          user-select: none;
        }
        #root {
          height: 100%;
        }
        h1,
        h2,
        h3,
        h4 {
          display: inline-block;
          text-align: center;
          @media (min-width: 430px) {
            text-align: start;
          }
        }
        h1 {
          margin: 1rem 0;
          font-size: 1.75rem;
        }
        h2 {
          margin: 0.5rem 0;
          font-size: 1.5rem;
        }
        h3 {
          margin: 0.25rem 0;
          font-size: 1.25rem;
        }
        h4 {
          margin: 0;
        }
        button,
        input,
        textarea {
          font-size: 1rem;
          border: 1px solid transparent;
          border-radius: 0.25rem;
          color: ${theme.letter_main};
          background: ${theme.background_main};
          font-family: 'Noto Sans KR', sans-serif;
        }
        input {
          padding: 0.5rem;
          border: 1px solid ${theme.border_main};
          &.count {
            padding: 0.25rem;
            font-size: 1.5rem;
          }
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        ul,
        li {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        hr {
          border: none;
          border-top: 1px solid ${theme.border_main};
          background: none;
          align-self: stretch;
        }
        small {
          color: ${theme.letter_sub};
        }
        code {
          font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
            monospace;
        }
        body,
        div,
        ul,
        li {
          transition: background 0.2s;
        }
      `}
    />
  );
};

export default GlobalStyles;
