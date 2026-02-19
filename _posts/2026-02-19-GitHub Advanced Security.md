---
title: GitHub Advanced Security
author: seungbin
date: 2026-02-19 00:00
categories: [DEVOPS, CI/CD]
tags: [devops]
pin: true
math: true
mermaid: true
---
GitHub에서 제공하는 보안 전용 기능 묶음 패키지

## **GHAS란?**
{: .mt-5 .mb-2}
GHAS(GitHub Advanced Security)는 코드 저장소 단계에서 보안 이슈를 조기에 탐지하고, 개발 파이프라인 안에서 지속적으로 관리하기 위한 GitHub 보안 기능 모음이다.

## **핵심 기능**
{: .mt-5 .mb-2}

#### **Code Scanning (CodeQL)**
{: .mt-4 .mb-2}
소스코드를 정적 분석해서 취약한 코드 패턴(SQL Injection, Command Injection 등)을 탐지한다.

#### **Secret Scanning**
{: .mt-4 .mb-2}
API Key, Token, 인증서 등 민감정보가 커밋되는지 탐지한다.

#### **Dependency Review / Dependabot Alerts**
{: .mt-4 .mb-2}
오픈소스 의존성의 알려진 취약점(CVE) 노출 여부를 점검하고 업데이트 가이드를 제공한다.

#### **Security Overview**
{: .mt-4 .mb-2}
조직/리포지토리 단위로 보안 상태를 한 눈에 확인하고 우선순위를 관리할 수 있다.

---

## **🔷 CodeQL의 Default setup vs Advanced setup**
{: .mt-5 .mb-3}

#### **✅ Default setup**
{: .mt-4 .mb-2}
GitHub가 자동으로 아래 항목을 설정한다.
- workflow 생성
- 빌드 자동 감지
- GitHub-hosted runner 사용
- 설정 최소화

기본 설정은 빠르게 시작할 때 유리하지만, 사내 네트워크/사설 저장소/private 패키지 연동이 필요한 환경에서는 한계가 있다.

#### **✅ Advanced setup**
{: .mt-4 .mb-2}
사용자가 직접 아래 항목을 설정한다.
- `.github/workflows/codeql.yml` 작성
- manual build 설정
- self-hosted runner 사용
- private Nexus 연동
- custom query 추가

Advanced setup은 초기 설정 비용이 있지만, 실제 운영 환경(사내 빌드/사설 의존성/맞춤 보안 정책)에 맞춘 정밀한 분석이 가능하다.

---

## **적용 방법**
{: .mt-5 .mb-2}
1. `codeql.yml`을 작성한다.
2. CodeQL Default setup을 비활성화한다.
3. self-hosted runner 또는 빌드 환경에 필요한 권한을 설정한다.
4. private Nexus 접근이 필요한 경우 인증정보를 GitHub Secrets로 주입한다.
5. 분석 결과를 PR 단계에서 확인하도록 품질 게이트를 구성한다.

## **운영 시 체크 포인트**
{: .mt-5 .mb-2}
- false positive가 많은 규칙은 custom query 또는 severity 기준으로 조정한다.
- PR마다 전체 분석이 부담되면 증분 분석 전략을 함께 사용한다.
- 보안 이슈는 단순 경고로 두지 말고, 수정 SLA와 담당자(owner)를 명확히 지정한다.
