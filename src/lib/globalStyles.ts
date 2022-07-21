import { css } from '@emotion/react';

export const globalStyles = css`
  a {
    color: inherit;
    text-decoration: none;
  }

  html {
    height: 100%;
  }

  body {
    margin: 0;
    box-sizing: border-box;
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

  button,
  input,
  textarea {
    font-size: 1rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    font-family: 'Noto Sans KR', sans-serif;
  }

  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  hr {
    border: none;
    border-top: 1px solid #cccccc;
    background: none;
    margin-top: 2rem;
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
`;
