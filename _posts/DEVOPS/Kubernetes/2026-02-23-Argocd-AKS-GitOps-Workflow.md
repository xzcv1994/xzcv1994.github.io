---
title: Argo CD로 AKS 배포할 때 kubectl은 어디까지 필요한가
author: seungbin
date: 2026-02-23 09:10:00 +0800
categories: [DEVOPS, Kubernetes]
tags: [argocd, aks, gitops, kubectl]
pin: true
math: false
mermaid: false
---
결론부터 말하면, 정상적인 GitOps 운영에서는 배포를 위해 `kubectl apply`를 직접 실행할 필요가 거의 없다.

## **Argo CD에서 AKS 배포 가능 여부**
{: .mt-5 .mb-2}
Argo CD는 AKS에 아래 리소스를 배포할 수 있다.
- Pod(직접 Pod보다는 보통 Deployment/StatefulSet으로 관리)
- Deployment / StatefulSet
- Service
- Ingress
- ConfigMap / Secret
- HPA
- CRD(권한/운영정책에 따라)

즉, `Pod / Service / Ingress` 배포는 모두 가능하다.

## **기본 구조**
{: .mt-5 .mb-2}
```text
Git Repository
   ->
Argo CD
   ->
AKS Cluster
   ->
Deployment / Service / Ingress / Pod
```

핵심:
- Git이 단일 소스 오브 트루스(SSOT)
- Argo CD가 Git 상태와 클러스터 상태를 동기화

## **Ingress도 Argo CD로 배포 가능**
{: .mt-5 .mb-2}
Ingress YAML을 Git에 커밋하면 Argo CD가 AKS에 반영한다.
단, 실제 트래픽 처리를 위해 Ingress Controller가 클러스터에 준비되어 있어야 한다.

## **Argo CD가 AKS에 배포하려면 필요한 조건**
{: .mt-5 .mb-2}
- Argo CD가 해당 AKS 클러스터에 설치되어 있거나
- 외부 Argo CD에서 대상 AKS가 cluster로 등록되어 있어야 한다.

보통 확인:
```bash
argocd cluster list
```

## **그럼 kubectl은 필요 없나?**
{: .mt-5 .mb-2}
배포 작업 기준으로는 거의 필요 없다.
하지만 운영/디버깅에는 여전히 중요하다.

kubectl이 주로 필요한 작업:
- `kubectl get` / `describe` (상태 확인)
- `kubectl logs` (로그 확인)
- `kubectl get events` (이벤트 추적)
- `kubectl exec` (긴급 진단)

## **실무 운영 모델 (권장)**
{: .mt-5 .mb-2}
- 배포/변경: Git PR + Argo CD Sync
- 일상 운영: kubectl 조회 중심(read-only 성향)
- 권한 분리:
  - 플랫폼팀: cluster-admin
  - 서비스팀: namespace 범위 권한

## **전통 방식 vs GitOps**
{: .mt-5 .mb-2}

| 구분 | kubectl 수동 배포 | Argo CD GitOps |
|---|---|---|
| 변경 이력 추적 | 약함 | 강함(PR/커밋 기반) |
| 드리프트 방지 | 약함 | 강함(지속 동기화) |
| 롤백 | 상대적으로 번거로움 | Git revert 중심으로 단순 |
| 감사/거버넌스 대응 | 어려움 | 유리 |

## **한 줄 정리**
{: .mt-5 .mb-2}
배포는 GitOps(Argo CD), 확인/디버깅은 kubectl이 가장 현실적이고 안전한 운영 방식이다.
