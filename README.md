# Fitness app, \<Routine\>

> **Routine**은 간편한 운동 일정 관리 웹 어플리케이션입니다. <br />자신만의 루틴을 만들고, 매일 운동을 수행하고, 기록을 돌아보세요.

## 사이트 링크
<b>http://whitesquar.ddns.net</b>

## 로컬 환경에서 실행하기

0. 이 앱을 사용하기 위해서는 우선 다음 프로그램이 실행 환경에 설치되어 있어야 합니다.
* MongoDB
* Node.js
* yarn
1. 코드를 다운로드한 후 압축을 해제합니다.
2. Frontend 폴더에 .env 파일을 생성한 후, 다음과 같이 작성합니다.
```
REACT_APP_KAKAO_API=... // Kakao Developers의 REST API 키 값
REACT_APP_KAKAO_REDIRECT=http://localhost:3000/kakao
```
3. Backend 폴더에 .env 파일을 생성한 후, 다음과 같이 작성합니다.
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/fitness
JWT_SECRET=... // jwt 토큰을 위한 임의의 문자열 입력
KAKAO_API=... // Kakao Developers의 REST API 키 값
```
4. Frontend, Backend 경로에서 각각 ```yarn``` 명령어를 입력하여 필요한 패키지를 설치합니다.
5. Frontend, Backend 경로에서 각각 ```yarn start``` 명령어를 입력합니다.
6. http://localhost:3000/fitness-app 에 접속하여 서비스를 이용하세요.

## 페이지별 기능
1. 로그인(/login), 계정 등록(/register)
* 로컬 계정 생성 및 로그인
* 카카오 계정으로 로그인
2. 홈 (/)
* 프로필 정보 변경 및 이미지 업로드
* 이번 주 운동 현황 표시
* 오늘의 운동 수행
3. 루틴 (/routine)
* 새로운 루틴 추가 및 제거
* 기존 루틴 수정 (운동 추가/삭제, 루틴명 변경)
4. 기록 (/record)
* 운동 기록 캘린더
* 체성분 변화 기록 관리

## 추가 예정 기능
1. 사용자 루틴의 특정 운동 항목 수정
2. 기존 캘린더 기록 삭제
3. 홈 화면 스톱워치 모듈
