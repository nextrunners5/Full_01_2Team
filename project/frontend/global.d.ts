// global.d.ts

// img 태그의 src 속성에 대한 타입을 지정하기 위해
// global.d.ts 파일을 생성

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
