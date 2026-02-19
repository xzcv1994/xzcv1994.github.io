---
title: ARC (Actions Runner Controller)
author: seungbin
date: 2026-02-19 00:00
categories: [DEVOPS, CI/CD]
tags: [devops]
pin: true
math: true
mermaid: true
---
ARC는 Kubernetes 환경에서 GitHub Actions Self-hosted Runner를 운영하기 위한 컨트롤러이다.

## **ARC란?**
{: .mt-5 .mb-2}
ARC(Actions Runner Controller)는 GitHub Actions 러너를 Kubernetes 리소스로 관리할 수 있게 해주는 오픈소스 컨트롤러다.

## **핵심 특징**
{: .mt-5 .mb-2}
- Kubernetes 기반으로 동작한다.
- GitHub Actions Self-hosted Runner를 관리한다.
- Runner를 Pod 단위로 생성/삭제한다.

## **동작 방식**
{: .mt-5 .mb-2}
1. 워크플로우 실행 요청이 들어오면 ARC가 Runner Pod를 생성한다.
2. 생성된 Runner가 Job을 수행한다.
3. Job이 끝나면 Pod를 정리하거나 재사용 정책에 따라 유지한다.

## **왜 ARC를 쓰는가**
{: .mt-5 .mb-2}
- 러너 수를 자동으로 확장/축소해 리소스를 효율적으로 사용할 수 있다.
- 러너를 격리된 Pod로 운용해 보안 경계를 강화할 수 있다.
- 사내 네트워크, private Nexus 같은 내부 자원 접근이 필요한 CI 환경에 유리하다.
