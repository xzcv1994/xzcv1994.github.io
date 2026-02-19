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

## **CodeQL의 Default setup vs Advanced setup**
{: .mt-5 .mb-2}

### **Default setup**
{: .mt-4 .mb-2}
GitHub가 자동으로 아래 항목을 설정한다.
- workflow 생성
- 빌드 자동 감지
- GitHub-hosted runner 사용
- 설정 최소화

### **Advanced setup**
{: .mt-4 .mb-2}
사용자가 직접 아래 항목을 설정한다.
- `.github/workflows/codeql.yml` 작성
- manual build 설정
- self-hosted runner 사용
- private Nexus 연동
- custom query 추가

## **적용 방법**
{: .mt-5 .mb-2}
- `codeql.yml`을 작성한다.
- CodeQL Default setup을 비활성화한다.
