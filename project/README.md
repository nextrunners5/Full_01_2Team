# **Branch Strategy**

- `main` - 배포 브랜치
- `dev` - 개발 브랜치
- `feature/기능_명`
- PR 전 전원 승인 필수

# **Git Convention**

- 이슈 발생 시 내용 뒤에 #이슈 번호와 같이 작성하여 이슈 연결해주세요!
- 가독성을 위해 띄어쓰기를 지켜주세요!
<접두사>: <설명> <#이슈번호>
- commit은 단어마다 대문자로 시작해주세요!

| 접두사 | 설명 |
| --- | --- |
| `Feat` | 새로운 기능 구현
ex) git commit -m “Feat: 로그인 UI 개발” |
| `Fix` | 버그 수정
ex) git commit -m “Fix: 로그인 undefined 오류 해결” |
| `!Breakin Chanege`  | 커다란 API 변경의 경우 |
| `!Hotfix` | 급하게 치명적인 버그를 고쳐야하는 경우 |
| `Style`  | CSS 등 사용자 UI 디자인 변경 |
| `Refactor`  | 코드 리팩토링(가독성, 정리) |
| `Comment` | 필요한 주석 추가 및 변경 |
| `Docs` | 문서 수정 |
| `Test` | 테스트 코드 |
| `Rename` | 파일 혹은 폴더명을 수정하거나 옮기는 작업인 경우 |
| `Remove` | 파일을 삭제하는 작업만 수행한 경우 |

# 네이밍 규칙

- 변수, 함수는 camel case
ex) fetchData, setData
- 클래스명은 snake case
ex) login_wrap
- 컴포넌트명은 pascal case
ex)ItemList
- 스타일 파일은 컴포넌트명과 동일하게
ex) Home.js / Home.css
- 컴포넌트가 아닌 파일은 카멜 케이스
ex) useFetch

BE

- 패키지명 전체 소문자
- 클래스명, 인터페이스명 CamelCase
- 클래스 이름 명사 사용
- 상수명 SNAKE_CASE
- Controller, Service, Dto, Repository, mapper 앞에 접미사로 통일(ex. MemberController)
- service 계층 메서드명 create, update, find, delete로 CRUD 통일(ex. createMember)
- Test 클래스는 접미사로 Test 사용(ex. memberFindTest)

FE

- styled-Component 변수명 S + 변수명 (ex. Swrap)
- styled-Component는 return문 위에 작성
- 크게는 styled-Component, 그 안에서 className 사용
- Event handler 사용 (ex. handle ~)
- export방식 (ex. export default ~)
- 화살표 함수 사용