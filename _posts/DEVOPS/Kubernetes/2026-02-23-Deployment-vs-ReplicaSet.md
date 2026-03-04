---
title: Deployment와 ReplicaSet 차이 정리
author: seungbin
date: 2026-02-23 09:30:00 +0800
categories: [DEVOPS, Kubernetes]
tags: [kubernetes, deployment, replicaset, pod]
pin: true
math: false
mermaid: false
---
Deployment와 ReplicaSet은 비슷해 보이지만 책임이 다르다.

## **한 줄 정의**
{: .mt-5 .mb-2}
- ReplicaSet: "Pod 개수를 맞춰주는 관리자"
- Deployment: "ReplicaSet을 관리하는 배포 전략 관리자"

## **구조**
{: .mt-5 .mb-2}
```text
Deployment
   ->
ReplicaSet
   ->
Pod
```

## **YAML로 비교 (Pod vs ReplicaSet vs Deployment)**
{: .mt-5 .mb-2}

### **1) Pod (단독 실행)**
{: .mt-4 .mb-2}
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-pod
  labels:
    app: sample
spec:
  containers:
    - name: app
      image: nginx:1.27
      ports:
        - containerPort: 80
```

### **2) ReplicaSet (개수 유지)**
{: .mt-4 .mb-2}
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: sample-rs
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sample
  template:
    metadata:
      labels:
        app: sample
    spec:
      containers:
        - name: app
          image: nginx:1.27
          ports:
            - containerPort: 80
```

### **3) Deployment (배포 전략 + 롤백)**
{: .mt-4 .mb-2}
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-deploy
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sample
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: sample
    spec:
      containers:
        - name: app
          image: nginx:1.27
          ports:
            - containerPort: 80
```

### **차이 포인트 요약**
{: .mt-4 .mb-2}
| 항목 | Pod | ReplicaSet | Deployment |
|---|---|---|---|
| 직접 실행 단위 | 예 | 내부적으로 Pod 생성 | 내부적으로 Pod/RS 생성 |
| replicas 선언 | 없음 | 있음 | 있음 |
| selector + template | 없음 | 있음 | 있음 |
| 자동 복구 | 약함 | 가능 | 가능 |
| 롤링 업데이트 | 불가 | 불가 | 가능 |
| 롤백 | 불가 | 불가 | 가능 |

## **ReplicaSet의 역할**
{: .mt-5 .mb-2}
- 지정한 라벨의 Pod 개수를 `replicas` 값으로 유지
- Pod가 죽으면 새 Pod를 생성해 개수 복구
- 노드 장애 시 다른 노드에 재스케줄될 수 있도록 상태 유지

중요:
- 버전 전략(롤링 업데이트/롤백) 기능은 없다.

## **Deployment의 역할**
{: .mt-5 .mb-2}
- ReplicaSet 생성/교체/스케일 조정
- RollingUpdate / Recreate 배포 전략 제공
- 롤백(`kubectl rollout undo`) 및 히스토리 관리

즉 Deployment는 ReplicaSet 위에 얹힌 "관리 레이어"다.

## **업데이트 시 내부 동작**
{: .mt-5 .mb-2}
이미지 태그를 변경하면 보통 아래 순서로 진행된다.
1. 새 Pod Template 해시 기반 ReplicaSet(v2) 생성
2. 새 RS를 점진적으로 증가
3. 기존 RS(v1)를 점진적으로 감소

이 과정을 Deployment가 지휘하고, 각 ReplicaSet은 자기 Pod 개수 유지만 담당한다.

## **ReplicaSet 없이 Pod를 직접 만들면**
{: .mt-5 .mb-2}
`kind: Pod`를 직접 생성하면 Controller가 없다.

결과:
- 복구 약함
- 롤링 업데이트 불가
- 스케일링/롤백 관리 어려움

운영 Application에서는 일반적으로 권장되지 않는다.

## **실무에서 어떤 kind를 쓰나**
{: .mt-5 .mb-2}
- 일반 웹/애플리케이션: Deployment
- 상태 저장 애플리케이션: StatefulSet
- 노드당 1개 에이전트: DaemonSet
- 1회성 배치: Job
- 주기 배치: CronJob

공통점:
- 대부분 Pod를 직접 만들지 않고 Controller를 선언한다.

## **왜 실무에서 Deployment를 쓰는가**
{: .mt-5 .mb-2}
- ReplicaSet의 개수 유지 기능 + 배포 전략 + 롤백을 한 번에 제공
- GitOps/Argo CD 운영에서 변경 이력 추적 및 복구가 쉬움

## **정리**
{: .mt-5 .mb-2}
- ReplicaSet은 수량 관리자
- Deployment는 배포 전략 관리자
- 운영 환경에서는 Deployment를 직접 정의하고 ReplicaSet은 자동 생성되는 구조가 표준이다.
