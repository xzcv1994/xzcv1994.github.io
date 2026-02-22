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
Nexus Repository는 Maven 생태계에서 널리 사용되는 무료 Repository Manager이며, 사설 Repository로도 활용할 수 있다.

## **Nexus Repository란?**
{: .mt-5 .mb-2}
Nexus Repository는 외부 오픈소스 아티팩트와 내부 빌드 산출물을 한 곳에서 관리할 수 있도록 도와주는 저장소 관리 솔루션이다.

## **아티팩트(Artifact)란?**
{: .mt-5 .mb-2}
아티팩트는 빌드 결과로 만들어지는 배포 가능한 산출물이다.

대표 예시:
- Java: `jar`, `war`
- JavaScript: 번들 파일(`.js`, `.map`)
- Docker: 컨테이너 이미지

Maven 기준으로 아티팩트는 보통 아래 좌표로 식별한다.
- `groupId`
- `artifactId`
- `version`

예:
- `com.example:payment-service:1.0.3`

즉, Nexus에서 말하는 아티팩트 관리는 "빌드 결과물을 버전 단위로 저장/조회/배포하는 것"이라고 이해하면 된다.

## **핵심 특징**
{: .mt-5 .mb-2}
- Maven 환경에서 널리 사용되는 Repository Manager다.
- 사설 Repository로 구성해 팀 단위 코드/아티팩트 공유가 가능하다.
- 외부 의존성 캐싱과 내부 산출물 배포를 동시에 지원한다.

## **저장소의 종류**
{: .mt-5 .mb-2}

- **Proxy 저장소**
  
  외부 저장소(Maven Central 등)를 대신 조회하고, 다운로드한 아티팩트를 로컬에 캐싱하여 네트워크 비용과 의존성을 줄인다.

- **Hosted 저장소**
  
  사내에서 직접 배포/관리하는 아티팩트를 저장하는 저장소로, 내부 라이브러리나 사설 빌드 결과물을 보관한다.

- **가상 저장소 (Virtual Repository)**
  
  여러 저장소를 하나의 URL로 묶어 클라이언트가 단일 엔드포인트로 접근할 수 있도록 제공한다.

- **Group 저장소**
  
  여러 Proxy/Hosted 저장소를 논리적으로 그룹화하여 의존성 조회 시 우선순위에 따라 순차적으로 검색한다.

## **활용 포인트**
{: .mt-5 .mb-2}
- 외부 저장소 장애나 네트워크 이슈가 있어도 캐시된 의존성으로 빌드 안정성을 높일 수 있다.
- 사내 라이브러리 배포/버전 관리를 표준화해 재사용성과 추적성을 높일 수 있다.
- CI/CD 파이프라인과 연계해 아티팩트 저장소를 중앙화할 수 있다.
