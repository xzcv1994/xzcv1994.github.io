---
title: k9s 접속을 위한 kubeconfig 설정 정리
author: seungbin
date: 2026-02-22 12:10:00 +0800
categories: [DEVOPS, Kubernetes]
tags: [k9s, kubeconfig, aks, kubectl]
pin: true
math: false
mermaid: false
---
k9s는 자체 접속 설정을 따로 만들지 않고 `~/.kube/config`를 그대로 읽어 Kubernetes 클러스터에 접속한다.

## **이 문서는 어떤 성격인가?**
{: .mt-5 .mb-2}
이 내용은 Kubernetes 개념 문서라기보다 실습/환경설정(운영 준비) 문서에 가깝다.

## **핵심 결론**
{: .mt-5 .mb-2}
- k9s 접속 정보는 `kubeconfig`에서 온다.
- AKS를 사용하면 `az aks get-credentials`로 대부분 자동 설정된다.
- `cluster / certificate / server` 정보를 직접 수동 작성하는 경우는 드물다.

## **AKS 기준 kubeconfig 가져오기**
{: .mt-5 .mb-2}
```bash
az login

az aks get-credentials \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <AKS_CLUSTER_NAME>
```

예시(기밀값 제거):
```bash
az aks get-credentials \
  --resource-group <RG_NAME_PLACEHOLDER> \
  --name <AKS_NAME_PLACEHOLDER>
```

명령 실행 후 `~/.kube/config`에 클러스터 정보가 병합되고, 바로 `k9s` 실행이 가능하다.

## **kubeconfig 주요 항목과 출처**
{: .mt-5 .mb-2}

| 항목 | 의미 | 출처 |
|---|---|---|
| `clusters[].cluster.server` | Kubernetes API Server 주소 | AKS control plane endpoint |
| `clusters[].cluster.certificate-authority-data` | 클러스터 CA 인증서 | AKS control plane |
| `users[]` 인증 정보 | 사용자/토큰/exec 인증 설정 | Azure AD/AKS 인증 체계 |
| `contexts[]` | 어떤 사용자로 어떤 클러스터에 접속할지 매핑 | `get-credentials` 시 자동 생성 |

즉, 대부분 정보는 AKS가 제공하며 로컬에서 수동 생성하지 않는다.

## **확인 명령어**
{: .mt-5 .mb-2}
```bash
kubectl config get-contexts
kubectl config current-context
kubectl cluster-info
```

필요하면 컨텍스트를 명시적으로 전환한다.
```bash
kubectl config use-context <CONTEXT_NAME>
```

## **k9s 실행**
{: .mt-5 .mb-2}
```bash
k9s
```

특정 컨텍스트로 바로 실행할 수도 있다.
```bash
k9s --context <CONTEXT_NAME>
```

## **문제 발생 시 체크포인트**
{: .mt-5 .mb-2}
- Azure 로그인 상태 확인: `az account show`
- kubeconfig 컨텍스트 충돌 여부 확인
- 올바른 구독 선택 여부 확인: `az account set --subscription <SUBSCRIPTION_ID_OR_NAME>`
- 권한(RBAC) 부족 여부 확인

## **보안 주의사항**
{: .mt-5 .mb-2}
- 문서/스크린샷에 실제 API endpoint, 인증서 데이터, 토큰을 그대로 노출하지 않는다.
- 리소스 그룹, 클러스터명, 구독 ID 등은 외부 공유 시 플레이스홀더로 치환한다.
