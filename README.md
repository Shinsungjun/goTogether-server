<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# 가치가자 웹 API 서버에 오신것을 환영합니다 👋

### 🏠 [API 문서 주소](https://dev.jj-gotogether.shop/api-docs/)

## Environment
***
- npm = 7.21.0
- node = v16.8.0

#

#

## 템플릿 구조

- 각 도메인별로 Module / Controller / Service 파일이 존재하며 파일명 규칙은 '도메인명 + module / controller / service' 입니다.
- Ex. Auth 도메인(폴더)안에는 auth.module.ts / auth.controller.ts / auth.service.ts 파일과 각 테스트 파일이 존재합니다.

1. Module
   - NestJS는 모듈로 구성, 각 도메인마다 Module을 생성한 다음 app.module.ts에 각 도메인별 모듈을 작성

2. Controller
   - Route로부터 받은 요청속의 데이터(path-variable, query-string, body 등)를 받은 뒤, Service에게 해당 데이터를 넘겨주고 비즈니스 로직을 수행

3. Service
   - 실제 어플리케이션의 핵심적인 비즈니스로직이 수행되는 영역, 트랜잭션, 논리적 유효성 검사 진행

## 폴더 구조

```
.
├── .github                                                       # github 관련 폴더
│   ├── workflows                                                 # 깃헙 액션 관련 폴더
|   │   ├── deploy.yml                                            # 배포 깃헙 액션 파일
├── .platform                                                     # nginx 설정 관련 폴더
│   ├── nginx                                                     # nginx 설정 관련 폴더
|   │   ├── nginx.conf                                            # nginx 설정 파일
├── common                                                        # 공통적으로 사용하는 로직들이 있는 폴더
│   ├── function.utils.ts                                         # 공통적으로 사용되는 함수가 있는 파일
│   ├── variable.utils.ts                                         # 공통적으로 사용되는 변수가 있는 파일
├── config                                                        # 설정 파일들이 들어가 있는 폴더
│   ├── base.response.ts                                          # 기본 response 양식
│   ├── regularExp.ts                                             # 정규식 관련 파일
│   ├── response.utils.ts                                         # response status 관리
│   ├── secret.ts                                                 # 시크릿 키
│   ├── message.ts                                                # 메세지 발송 관련 파일
│   ├── swagger.ts                                                # swagger 설정 관련 파일
├── src                                                           # 소스 코드 폴더
│   ├── entity                                                    # 데이터베이스 스키마관련 코드
│   ├── web                                                       # 웹 api 관련 폴더
│   │   ├── auth                                                  # Auth 관련 코드
│   │   |   ├── dto                                               # request, response 정리 폴더
│   │   |   ├── jwt                                               # jwt 관련 폴더
|   │   │   |   ├── jwt.guard.ts                                  # Auth Guard 클래스 파일
|   │   │   |   ├── jwt.payload.ts                                # payload 클래스 파일 
|   │   │   |   ├── jwt.strategy.ts                               # 로그인 검증 로직 관련 파일
│   │   |   ├── auth.controller.spec.ts                           # auth controller 테스트 파일
│   │   |   ├── auth.controller.ts                                # auth controller 파일
│   │   |   ├── auth.module.ts                                    # auth module 파일
│   │   |   ├── auth.query.spec.ts                                # auth raw query 파일
│   │   |   ├── auth.service.spec.ts                              # auth service 테스트 파일
│   │   |   ├── auth.service.ts                                   # auth service 파일
│   │   ├── airline                                               # Airline 관련 코드
│   │   |   ├── dto                                               # request, response 정리 폴더
│   │   |   ├── airline.controller.spec.ts                        # airline controller 테스트 파일
│   │   |   ├── airline.controller.ts                             # airline controller 파일
│   │   |   ├── airline.module.ts                                 # airline module 파일
│   │   |   ├── airline.query.spec.ts                             # airline raw query 파일
│   │   |   ├── airline.service.spec.ts                           # airline service 테스트 파일
│   │   |   ├── airline.service.ts                                # airline service 파일
│   │   ├── airport                                               # Airport 관련 코드 (기본 구조는 airline 폴더와 동일)
│   │   ├── info                                                  # Info 관련 코드 (기본 구조는 airline 폴더와 동일)
│   │   ├── schedule                                              # Schedule 관련 코드 (기본 구조는 airline 폴더와 동일)
│   │   ├── search                                                # Search 관련 코드 (기본 구조는 airline 폴더와 동일)
│   │   ├── user                                                  # User 관련 코드 (기본 구조는 airline 폴더와 동일)
│   │   ├── decorators                                            # custom decorator 관련 폴더
│   ├── app.controller.spec.ts                                    # root controller 테스트 파일
│   ├── app.controller.ts                                         # root controller 파일
│   ├── app.module.ts                                             # root module 파일, 각 도메인별 모듈을 명시해줘야 함, typeorm 설정이 되어있는 곳
│   ├── app.service.ts                                            # root service 파일
│   ├── main.ts                                                   # 서버 시작 파일
├── .gitignore                                                    # git 에 포함되지 않아야 하는 폴더, 파일들을 작성 해놓는 곳
├── package-lock.json
├── package.json                                                  # 프로그램 이름, 버전, 필요한 모듈 등 노드 프로그램의 정보를 기술
├── tsconfig.build.json                                           # tsconfig.json 적용 범위 설정 json 파일
├── tsconfig.json                                                 # typescript 컴파일 옵션이 담긴 json 파일
├── Procfile                                                      # 빈스톡 환경에서 nest 실행 시 실행되는 명령어 작성 파일
└── README.md
```
