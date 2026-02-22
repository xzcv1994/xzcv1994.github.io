---
title: SSR, CSR, SPA 비교 정리
author: seungbin
date: 2026-02-22 11:30:00 +0800
categories: [WEB, Architecture]
tags: [ssr, csr, spa, nextjs]
pin: true
math: false
mermaid: false
---
SSR, CSR, SPA는 웹 아키텍처를 결정할 때 가장 자주 비교하는 핵심 개념이다.

## **SSR (Server Side Rendering)**
{: .mt-5 .mb-2}

### **개념**
{: .mt-4 .mb-2}
서버가 HTML을 완성해서 브라우저에 전달한다.

### **동작 흐름**
{: .mt-4 .mb-2}
1. 브라우저가 서버에 요청한다.
2. 서버가 DB 조회 후 HTML을 생성한다.
3. 브라우저는 완성된 화면을 바로 표시한다.

### **대표 기술**
{: .mt-4 .mb-2}
- Spring MVC (Thymeleaf, JSP)
- ASP.NET Core (Razor)
- Django

### **특징**
{: .mt-4 .mb-2}
- 첫 로딩이 빠르다.
- SEO에 유리하다.
- 페이지 이동 시 새로고침이 발생한다.
- 서버 부하가 상대적으로 높다.

## **CSR (Client Side Rendering)**
{: .mt-5 .mb-2}

### **개념**
{: .mt-4 .mb-2}
브라우저가 JavaScript로 화면을 구성한다.

### **동작 흐름**
{: .mt-4 .mb-2}
1. 브라우저가 서버에 요청한다.
2. 서버는 기본 HTML + JS를 전달한다.
3. 브라우저가 JS 실행 후 API 호출로 화면을 구성한다.

### **대표 기술**
{: .mt-4 .mb-2}
- React
- Vue.js
- Angular

### **특징**
{: .mt-4 .mb-2}
- 보통 SPA 형태로 구현된다.
- 화면 전환이 부드럽다.
- 초기 로딩이 느릴 수 있다.
- 기본적으로 SEO가 약하다.
- 서버 부하는 상대적으로 낮다.

## **SPA (Single Page Application)**
{: .mt-5 .mb-2}

### **개념**
{: .mt-4 .mb-2}
페이지 전체를 다시 로드하지 않는 웹앱 구조다.
SPA는 렌더링 전략이 아니라 구조 개념이다.

### **특징**
{: .mt-4 .mb-2}
- URL은 바뀌지만 전체 페이지 새로고침은 없다.
- API 기반 통신을 사용한다.
- 프론트엔드/백엔드 분리 구조에 적합하다.

## **SSR + SPA (Hybrid)**
{: .mt-5 .mb-2}
React도 SSR이 가능하다. 대표적으로 Next.js가 있다.

하이브리드 방식:
- 첫 요청은 서버에서 HTML 생성(SSR)
- 이후 상호작용은 브라우저에서 실행(CSR)

이 과정을 Hydration이라고 한다.

## **한눈에 비교**
{: .mt-5 .mb-2}

| 구분 | SSR | CSR | SPA |
|---|---|---|---|
| HTML 생성 | 서버 | 브라우저 | 보통 브라우저 |
| 첫 로딩 | 빠름 | JS 필요 | CSR과 유사 |
| 화면 전환 | 새로고침 | 부드러움 | 부드러움 |
| SEO | 강함 | 약함 | CSR 기반이면 약함 |
| 서버 부하 | 높음 | 낮음 | CSR 기반이면 낮음 |
| 구조 | 전통적 웹 | API 기반 | 단일 페이지 구조 |

## **언제 무엇을 쓰나?**
{: .mt-5 .mb-2}
- 관리자 시스템: CSR / SPA (React)
- 검색엔진 유입이 중요한 서비스: SSR 또는 Next.js
- 단순 CRUD + 내부 업무 시스템: SSR (구현 난이도 측면에서 유리)
- MSA + API 게이트웨이 구조: SPA + 백엔드 분리

## **아키텍처 관점 정리**
{: .mt-5 .mb-2}
- 렌더링 전략: SSR vs CSR
- 구조 개념: SPA vs Multi Page
- 프레임워크/도구: React, Spring MVC, Next.js

즉, 이 셋은 같은 레벨의 비교 대상이 아니라 서로 다른 레이어 개념이다.
