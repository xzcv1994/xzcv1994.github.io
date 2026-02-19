---
title: Nexus Repository
author: seungbin
date: 2026-02-19 00:00
categories: [DEVOPS, CI/CD]
tags: [devops]
pin: true
math: true
mermaid: true
---
### Nexus Repository

Maven에서 사용할 수 있는 가장 널리 사용되는 무료 Repository로, 사설 Repository로도 활용할 수 있으며 팀 내 코드 공유에도 사용할 수 있다.

### 저장소의 종류

- **Proxy 저장소**
  
  외부 저장소(Maven Central 등)를 대신 조회하고, 다운로드한 아티팩트를 로컬에 캐싱하여 네트워크 비용과 의존성을 줄인다.

- **Hosted 저장소**
  
  사내에서 직접 배포/관리하는 아티팩트를 저장하는 저장소로, 내부 라이브러리나 사설 빌드 결과물을 보관한다.

- **가상 저장소 (Virtual Repository)**
  
  여러 저장소를 하나의 URL로 묶어 클라이언트가 단일 엔드포인트로 접근할 수 있도록 제공한다.

- **Group 저장소**
  
  여러 Proxy/Hosted 저장소를 논리적으로 그룹화하여 의존성 조회 시 우선순위에 따라 순차적으로 검색한다.
