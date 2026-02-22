---
title: AKS의 agentpool, userpool 개념 정리
author: seungbin
date: 2026-02-21 10:40:00 +0800
categories: [DEVOPS, Kubernetes]
tags: [aks, kubernetes, nodepool, azure]
pin: true
math: false
mermaid: false
---
AKS를 운영할 때 자주 나오는 `agentpool`, `userpool` 용어는 Kubernetes 표준 용어라기보다 AKS 맥락에서 이해해야 정확하다.

## **결론 먼저**
{: .mt-5 .mb-2}
- Kubernetes 표준 개념에 `agentpool`, `userpool`이라는 이름은 없다.
- AKS에서는 Node Pool을 `System` / `User` 모드로 구분해 운영한다.

## **Kubernetes 기본 개념**
{: .mt-5 .mb-2}
Kubernetes 자체는 일반적으로 아래 개념을 사용한다.
- Control Plane
- Worker Node
- Node Pool(동일 스펙 노드 그룹)

즉, 핵심은 "노드풀"이며 `agentpool`, `userpool`은 구현체(AKS)에서 붙는 용어다.

## **AKS에서의 용어 매핑**
{: .mt-5 .mb-2}

| 구분 | Kubernetes 기본 | AKS에서 자주 쓰는 표현 |
|---|---|---|
| 시스템 워크로드용 노드풀 | node pool | system node pool (`mode=System`) |
| 애플리케이션 워크로드용 노드풀 | node pool | user node pool (`mode=User`) |
| agentpool | 표준 명칭 아님 | AKS API/속성명(`agentPoolProfiles`)에서 유래한 표현 |

## **System Node Pool vs User Node Pool**
{: .mt-5 .mb-2}

### **System Node Pool**
{: .mt-4 .mb-2}
- CoreDNS, metrics-server 같은 클러스터 핵심 Pod 우선 배치
- 클러스터에 최소 1개의 System pool은 반드시 필요
- 운영 안정성을 위해 전용 풀로 분리 권장

### **User Node Pool**
{: .mt-4 .mb-2}
- 실제 애플리케이션 Pod 실행용
- 필요에 따라 여러 개 구성 가능
- 워크로드 특성별로 VM 크기/오토스케일/라벨/테인트를 다르게 적용 가능

## **왜 분리하나?**
{: .mt-5 .mb-2}
시스템 Pod와 서비스 Pod가 같은 노드에서 리소스를 경쟁하면, 리소스 부족 시 클러스터 안정성이 크게 떨어질 수 있다.
그래서 실무에서는 다음처럼 분리한다.
- 시스템 구성요소: System pool
- 비즈니스 워크로드: User pool

## **CLI 예시**
{: .mt-5 .mb-2}
```bash
az aks nodepool add \
  --resource-group my-rg \
  --cluster-name myCluster \
  --name userpool \
  --mode User
```

## **실무 체크 포인트**
{: .mt-5 .mb-2}
- 최소 1개의 System pool은 항상 유지해야 한다.
- User pool은 0까지 스케일하는 전략(비용 절감)에 활용할 수 있다.
- System pool에는 `CriticalAddonsOnly=true:NoSchedule` taint 적용을 검토해 앱 Pod 유입을 방지한다.
- 워크로드 유형별로 User pool을 분리(일반/고메모리/spot 등)하면 운영이 쉬워진다.
- 단일 System pool로 운영한다면 프로덕션 기준 3노드 이상을 권장한다.

## **팩트 체크 메모 (2026-02-22 기준)**
{: .mt-5 .mb-2}
Microsoft Learn의 AKS 문서 기준으로, AKS는 `System/User` node pool 모드를 공식 제공하며 관련 명령은 `az aks nodepool`을 사용한다.
`agentpool`이라는 표현은 AKS의 API/속성명(`agentPoolProfiles`)에서 흔히 보이지만, Kubernetes 표준 용어는 아니다.
문서에 따라 System pool의 최소 노드 수 가이드가 다르게 보일 수 있으므로(1 또는 2), 클러스터 정책과 사용 중인 AKS 문서 버전을 함께 확인하는 것이 안전하다.
