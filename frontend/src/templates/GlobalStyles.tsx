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
        }
        h1 {
          font-size: 1.75rem;
        }
        h2 {
          font-size: 1.5rem;
        }
        h3 {
          font-size: 1.25rem;
        }
        button,
        input,
        textarea {
          font-size: 1rem;
          border: 1px solid transparent;
          border-radius: 0.25rem;
          color: ${theme.letter_main};
          background: ${theme.background_sub};
          font-family: 'Noto Sans KR', sans-serif;
        }
        input {
          padding: 0.25rem;
          border: 1px solid ${theme.border_main};
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
          margin-top: 2rem;
          background: none;
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
