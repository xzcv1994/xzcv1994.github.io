---
title: Nexus Repository
author: seungbin
date: "{{ 'now' | date: '%Y-%m-%d %H:%M:%S %z' }}"
categories: [DEVOPS, CI/CD]
tags: [devops]
pin: true
math: true
mermaid: true
---
GitHub에서 제공하는 빌드, 테스트, 배포 파이프 라인을 자동화 할 수 있는 CI/CD 플랫폼

## **구성 요소**
{: .mt-5 .mb-2}

##### **WorkFlow**
{: .mt-4 .mb-2}
GitHub Actions의 가장 상위 개념으로 자동화 할 작업 과정을 명시해놓은것이다.
yaml 파일로 작성하고 GitHub Repository의 .github/workflows 폴더 하위에 저장된다.

**문법**
{: .mt-0 .mb-0}
- name : workflow의 이름을 설정한다.(생략 시 파일 경로가 워크플로우 이름으로 사용된다.)
- on : workflow의 실행 조건을 설정한다.
  - push : 특정 브랜치에 push 될 경우 동작한다.
    - branches : 특정 브랜치를 설정한다. ex) main, master
- permissions : GITHUB_TOKEN에 부여된 사용권한을 수정한다.
- concurrency : 작업의 동시성을 제어하는 속성
  - group : 그룹명을 설정한다.
  - cancel-in-progress : 앞서 실행중인 같은 그룹의 워크 플로우를 강제로 취소시키고 자신의 워크플로우를 실행할지 설정(true/false)
- jobs : 개별적인 작업 단위를 정의 한다.
  - runs-on : 실행 환경을 지정하는 설정
  - needs : 특정 작업이 끝난 후에만 현재 작업이 실행되도록 설정할 수 있다, needs에 명시된 작업이 성공적으로 완료되지 않으면 현재 작업은 실행되지 않는다.
  - steps : step들을 정의한다. Github Actions에는 직접 명령어를 실행하는 종류와 이미 만들어진 Action을 가져다 쓰는 종류 두가지가 존재한다.
    - name : step의 이름을 설정
    - uses : GitHub Actions에서 특정 기능을 수행하는 공식 또는 커스텀 액션을 가져와서 실행할 수 있도록 하는 설정
      - 액션이란 재사용 가능한 작업 단위로, GitHub Actions 마켓플레이스에서 제공하는 공식 액션이나 커스텀 액션을 불러와 실행할 수 있다.
      - 액션의 종류
        - GitHub에서 제공하는 공식 액션 : (actions/……)
        - 특정 레포지토리의 액션(repo_owner/repo_name@tag)
        - 로컬 액션(./path/to/action)
      - 몇가지 액션들
        - actions/checkout@v4 : GitHub 레포지토리의 소스를 현재 작업 디렉토리에 복사(체크아웃) 하는 역할을 한다, 이 액션을 실행하면 GItHub Actions의 실행 환경에서 코드가 다운로드 되어 사용할 수 있게 된다.
        - actions/configure-pages@v3 : GitHub에서 제공하는 GitHub Pages 설정을 위한 공식 액션, GitHub Pages 배포를 위해 필수적인 설정을 자동으로 처리해 주고 GitHub Pages에 배포될 때 필요한 기본 경로(base_path)를 제공한다.
        - actions/upload-artifact@v4 : GitHub Actions에서 제공하는 생성된 파일(빌드 결과)등을 저장하는 공식 액션, 액션을 통해 저장한 파일은 이후 단계에서 다운로드하여 배포할 수 있다.
        - actions/deploy-pages@v4 : GitHub에서 제공하는 공식 액션으로 GitHub Pages에 배포하는 역할을 한다.

#### **Event**
{: .mt-0 .mb-2}
WorkFlow를 Trigger하는 특정 활동이나 규칙을 의미한다.
- 특정 브랜치로 Push
- 특정 브랜치로 Pull Request
- 특정 시간대에 반복
- Webhook을 사용해 외부 이벤트를 통해 실행한다.

## **특징**
{: .mt-5 .mb-2}
- GitHub Actions의 각 job은 서로 독립적인 환경에서 실행된다.
  - build, deploy 작업이 두개가 존재한다면 build에서 만든 _site 폴더는 deploy 작업에서는 접근할 수 없다.
  - 예를 들어 build, deploy 단계가 존재하고 build 단계에서 _site에 결과물이 저장된다면 그것을 artifact 개념을 사용하여 파일을 저장하고 deploy 단계에서 다운로드 해서 사용한다.
