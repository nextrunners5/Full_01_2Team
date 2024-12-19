// babel.config.js
export const presets = [
  ["@babel/preset-env", { targets: "defaults" }],
  ["@babel/preset-react", { runtime: "automatic" }] // 자동으로 JSX Transform 사용
];
