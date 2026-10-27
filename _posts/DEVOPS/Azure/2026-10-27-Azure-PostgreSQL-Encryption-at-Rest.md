---
title: Azure PostgreSQL 저장 데이터 암호화 이해하기 - TDE, SMK와 CMK
author: seungbin
date: 2026-10-27 09:50:00 +0900
categories: [DEVOPS, Azure]
tags: [azure, postgresql, encryption, tde, smk, cmk, key-vault, hsm]
pin: false
math: false
mermaid: false
description: Azure PostgreSQL Flexible Server의 저장 데이터 암호화와 AES-256, 키 관리 방식, DataGrip 평문 조회 이유 및 확인 방법을 정리한다.
---

Azure Database for PostgreSQL Flexible Server를 사용하다 보면 “TDE를 따로 켜야 하나?”, “DataGrip에서 값이 그대로 보이는데 암호화가 안 된 것인가?”라는 의문이 생긴다. 저장 데이터 암호화의 적용 위치와 키 관리 주체를 나누어 보면 이해하기 쉽다.

이 글은 **2026년 10월 27일 Microsoft 공식 문서 기준**이다. 예시의 리소스 그룹과 서버 이름은 가상 값이며, 실제 운영 리소스의 설정을 조회한 결과가 아니다.

## **1. Azure PostgreSQL에도 TDE를 적용해야 할까?**
{: .mt-5 .mb-2}

SQL Server의 **TDE(Transparent Data Encryption)**는 데이터·로그 파일의 I/O를 암호화하고 복호화하는 기능이다. 데이터베이스 암호화 키(DEK)를 사용하며, 파일 페이지를 디스크에 쓰기 전에 암호화하고 메모리로 읽을 때 복호화한다. 애플리케이션을 바꾸지 않고 저장 데이터를 보호한다. [SQL Server TDE 공식 문서](https://learn.microsoft.com/en-us/sql/relational-databases/security/encryption/transparent-data-encryption?view=sql-server-ver17)

Flexible Server의 공식 설명은 **Encryption at Rest**다. 기반 스토리지의 서버 측 암호화를 사용하며, 시스템·사용자 데이터베이스, 서버 로그, WAL, 백업을 항상 암호화한다. 기본 키 관리 방식은 **SMK(Service-managed Key)**이며, 이를 활성화하기 위한 별도 작업은 필요하지 않다. [PostgreSQL 저장 데이터 암호화 문서](https://learn.microsoft.com/en-us/azure/postgresql/security/security-data-encryption)

| 구분 | SQL Server TDE | Azure PostgreSQL Flexible Server |
| --- | --- | --- |
| 공식 기능 설명 | 데이터베이스의 TDE | 기반 스토리지의 Encryption at Rest |
| 적용 위치 | 데이터·로그 파일 I/O | 서비스가 사용하는 스토리지 |
| 운영자가 확인할 대상 | 해당 제품의 TDE 설정 | Azure 리소스의 데이터 암호화 설정 |

둘 다 저장 데이터 보호라는 목적은 같지만 구현과 관리 지점이 다르다. 따라서 Flexible Server에 SQL Server용 `ALTER DATABASE ... SET ENCRYPTION ON`이나 `sys.dm_database_encryption_keys`를 적용하는 절차로 설명하면 안 된다.

## **2. AES-256은 무엇을 의미할까?**
{: .mt-5 .mb-2}

Azure Disk Storage는 데이터를 **256비트 AES**로 투명하게 암호화한다. Azure Storage도 저장 시 데이터를 자동 암호화하며 읽을 때 복호화한다. 이것이 Flexible Server 저장 데이터 암호화의 기반이다. [Azure Disk Storage 암호화](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption), [Azure Storage 암호화](https://learn.microsoft.com/en-us/azure/storage/common/storage-service-encryption)

여기서 AES-256은 **데이터를 암호화하는 알고리즘과 키 길이**를 말한다. “누가 키를 관리하는가”를 나타내는 SMK/CMK와는 다른 축이다. CMK를 선택한다고 AES-256이 새로 켜지는 것은 아니다.

## **3. SMK와 CMK의 차이**
{: .mt-5 .mb-2}

| 항목 | SMK | CMK |
| --- | --- | --- |
| 키 수명주기 관리 | Azure 서비스 | 고객 |
| 기본 선택 | 기본값 | 생성 시 선택 |
| 고객 소유 키 저장소 | 별도 구성 불필요 | Key Vault 또는 Managed HSM |
| 운영 책임 | 서비스가 키 관리 | 고객이 권한·네트워크·회전·만료 관리 |

CMK는 키 소유권과 관리 통제를 강화하는 선택이다. 키 접근을 잃으면 서버가 `Inaccessible` 상태가 되어 연결을 거부할 수 있다. [SMK/CMK와 접근 불가 조건](https://learn.microsoft.com/en-us/azure/postgresql/security/security-data-encryption)

키 계층도 구분해야 한다. Azure Storage의 CMK는 **실제 데이터를 암호화하는 키를 보호하는 키**로 사용된다. 저장소 암호화 키를 CMK로 감싸는 방식이며, CMK 자체로 모든 행을 직접 암호화하는 구조가 아니다. [Azure Storage의 CMK 동작](https://learn.microsoft.com/en-us/azure/storage/common/customer-managed-keys-overview)

Flexible Server에서 키 보호용으로 지원하는 키는 RSA 또는 RSA-HSM이며, 2048·3072·4096비트다. 데이터 암호화의 AES-256과 키 보호용 RSA의 길이를 혼동하지 말자. [CMK 키 요구사항](https://learn.microsoft.com/en-us/azure/postgresql/security/security-data-encryption)

## **4. HSM과 KMS는 같은 것일까?**
{: .mt-5 .mb-2}

**KMS(Key Management System)**는 키 생성·보관·접근 제어·회전 등을 관리하는 시스템을 뜻한다. Azure Key Vault는 이 역할을 제공한다. **HSM(Hardware Security Module)**은 암호 키와 연산을 보호하는 하드웨어 보안 모듈이다. 키 관리 시스템이 HSM을 사용할 수 있으므로 둘은 함께 등장할 수 있다.

Azure Key Vault의 Standard는 소프트웨어 기반 키 보호를, Premium은 HSM 보호 키를 제공한다. Azure Key Vault Managed HSM은 별도의 관리형 HSM 서비스다. 따라서 “Key Vault를 쓴다”는 말만으로 모든 키가 HSM 보호 키라고 판단할 수 없다. [Key Vault 개요](https://learn.microsoft.com/en-us/azure/key-vault/general/overview)

PaaS를 사용한다는 이유만으로 모든 KMS 연동이 불필요한 것은 아니다. 이 서비스의 **기본 저장 암호화**만 필요하면 고객 소유 키 저장소를 따로 연결하지 않아도 된다. 반면 고객의 키 통제 요구가 있으면 CMK를 검토하고, 애플리케이션 비밀정보 관리나 필드 암호화의 키 관리 요구는 별도로 판단한다.

## **5. DataGrip에서는 왜 평문으로 보일까?**
{: .mt-5 .mb-2}

저장 데이터 암호화는 디스크에 기록된 데이터를 보호한다. 서비스는 읽는 과정에서 투명하게 복호화하므로, 적절한 조회 권한으로 실행한 SQL 결과는 클라이언트에 정상적인 값으로 전달된다. **DataGrip의 결과 화면이 평문이라는 사실은 저장 암호화가 꺼졌다는 증거가 아니다.** 이는 앞서 설명한 투명한 스토리지 암호화 동작에서 도출되는 결론이다. [투명한 암호화·복호화 동작](https://learn.microsoft.com/en-us/azure/storage/common/storage-service-encryption)

| 보호 대상 | 확인할 수단 |
| --- | --- |
| 저장 장치의 데이터 | Encryption at Rest |
| DB와 클라이언트 사이 통신 | TLS 및 서버 인증서 검증 |
| 누가 어떤 행·열을 조회하는가 | DB 권한과 접근 제어 |
| DB 조회 권한이 있어도 감춰야 하는 필드 | 별도의 애플리케이션/필드 암호화 설계 |

TLS로 전송해도 클라이언트는 수신한 데이터를 복호화해 화면에 표시한다. 저장 암호화와 전송 암호화, 조회 권한을 각각 확인해야 한다. [Flexible Server TLS 문서](https://learn.microsoft.com/en-us/azure/postgresql/security/security-tls)

## **6. Azure Portal과 CLI로 확인하기**
{: .mt-5 .mb-2}

### **Azure Portal**
{: .mt-4 .mb-2}

1. 대상 **Azure Database for PostgreSQL Flexible Server** 리소스를 연다.
2. **Security → Data encryption** 메뉴를 확인한다. 한국어 화면은 보안 → 데이터 암호화로 표시될 수 있다.
3. 서비스 관리형 키인지 고객 관리형 키인지 확인한다.
4. CMK라면 키 참조와 접근에 사용하는 관리 ID도 확인한다.

새 서버 생성 시에는 **Security** 탭의 **Data encryption key**에서 선택한다. 메뉴와 선택 항목은 [Portal 설정 공식 절차](https://learn.microsoft.com/en-us/azure/postgresql/security/security-configure-data-encryption)를 기준으로 확인한다.

### **Azure CLI**
{: .mt-4 .mb-2}

로그인 후 대상 구독이 맞는지 먼저 확인하고, 다음 조회 명령에 가상 이름을 실제 값으로 바꾸어 사용한다.

```bash
az postgres flexible-server show \
  --resource-group "rg-example" \
  --name "pg-example" \
  --query "dataEncryption" \
  --output json
```

SMK인 경우의 **예시 응답**이다.

```json
{
  "type": "SystemManaged"
}
```

| `dataEncryption.type` | 의미 |
| --- | --- |
| `SystemManaged` | Azure가 관리하는 키 사용 |
| `AzureKeyVault` | 고객 관리형 키 사용 |

`AzureKeyVault`는 API의 열거형 이름이다. 키 저장소의 세부 종류까지 이 문자열 하나로 판단하지 않는다. 명령은 [Azure CLI show](https://learn.microsoft.com/en-us/cli/azure/postgres/flexible-server?view=azure-cli-latest#az-postgres-flexible-server-show), 값의 정의와 예시는 [Servers - Get API](https://learn.microsoft.com/en-us/rest/api/postgresql/servers/get?view=rest-postgresql-2025-08-01)를 참고한다.

출력이 `null`이거나 항목이 없으면 암호화 미적용으로 결론내리지 않는다. CLI 버전과 응답 구조, 조회 대상 구독·리소스를 확인하고 Portal 및 API 결과와 대조한다. 이 조회는 **키 관리 설정 확인**이며 디스크의 암호문을 직접 검사하는 절차는 아니다.

공유 자료에는 전체 서버 응답을 붙이기보다 필요한 설정만 발췌하고, 서버·리소스 그룹·구독·관리 ID·키 URI 등 식별 정보를 익명화한다.

## **7. 기존 SMK 서버를 CMK로 바꿀 수 있을까?**
{: .mt-5 .mb-2}

**기존 서버를 그대로 두고 SMK ↔ CMK를 전환할 수 없다.** 공식 절차는 백업을 **새 서버로 복원**하면서 새 서버의 데이터 암호화 방식을 선택하는 것이다. SMK에서 CMK로 가는 경우 PITR 백업 복원을 사용할 수 있다. [전환 제약과 복원 안내](https://learn.microsoft.com/en-us/azure/postgresql/security/security-configure-data-encryption), [CMK 제한사항](https://learn.microsoft.com/en-us/azure/postgresql/security/security-data-encryption#limitations-of-customer-managed-keys-cmk)

이미 CMK로 생성한 서버의 **키 참조·버전·관리 ID 변경**은 가능하다. `az postgres flexible-server update --key ... --identity ...` 예제를 기존 SMK 서버에 CMK를 추가하는 명령으로 해석하면 안 된다. [기존 CMK 서버 설정 변경](https://learn.microsoft.com/en-us/azure/postgresql/security/security-configure-data-encryption)

실제 전환은 다음 순서로 준비한다.

1. 키 저장소, 키, 관리 ID의 권한과 네트워크 접근을 준비한다.
2. 새 서버로 복원하면서 원하는 키 관리 방식을 선택한다.
3. 복원 시점 이후 데이터 차이와 서비스 중단 허용 시간을 확인한다.
4. 접속 주소 변경, 애플리케이션 연결, 읽기·쓰기 검증 후 전환한다.
5. 롤백 기준과 보존 기간에 따라 기존 서버를 정리한다.

새 서버는 접속 대상과 운영 구성이 달라질 수 있다. 단순히 Portal의 옵션을 바꾸는 작업으로 계획하지 말자. Key Vault가 허용하는 일반적인 구성과 Flexible Server의 제약도 다를 수 있으므로, 서비스별 요구사항을 우선 확인한다.

기본 저장 암호화는 Azure 서비스가 제공한다. 운영자가 결정할 부분은 고객이 키 수명주기를 직접 통제해야 하는지, 그리고 그 책임을 감당할 운영 체계가 있는지다.
