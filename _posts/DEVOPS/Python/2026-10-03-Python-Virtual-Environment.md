---
title: Python 가상 환경 이해와 venv 사용법
author: seungbin
date: 2026-10-03 21:00:00 +0900
categories: [DEVOPS, Python]
tags: [python, venv, pip, virtual-environment, dependencies]
pin: false
math: false
mermaid: false
---

Python 프로젝트마다 필요한 패키지와 버전이 다를 수 있다. 가상 환경은 프로젝트별로 패키지 설치 공간을 나누어, 한 프로젝트의 변경이 다른 프로젝트에 영향을 주는 일을 줄여준다. 이 글에서는 Python에 포함된 `venv`로 환경을 만들고 사용하는 과정을 설명한다.

## **가상 환경이 필요한 이유**
{: .mt-5 .mb-2}

예를 들어 프로젝트 A는 어떤 라이브러리의 1.x 버전에 맞춰 개발했고, 프로젝트 B는 2.x의 새 기능을 사용한다고 가정하자. 같은 Python 환경에 패키지를 설치하면 B를 위해 올린 버전 때문에 A의 코드가 동작하지 않을 수 있다.

프로젝트마다 `.venv`를 만들면 각각 필요한 버전을 설치할 수 있다. `.venv`는 자주 사용하는 디렉토리 이름이며, 이름 자체에 특별한 기능이 있는 것은 아니다.

```text
project-a/
├── .venv/           # A가 사용하는 Python 환경
├── app.py
└── requirements.txt

project-b/
├── .venv/           # B가 사용하는 Python 환경
├── app.py
└── requirements.txt
```

## **무엇을 분리하는가?**
{: .mt-5 .mb-2}

가상 환경에는 Python 실행 파일의 복사본 또는 링크, 패키지가 설치되는 `site-packages`, 명령행 도구 등이 들어간다. 기본 설정에서는 시스템 Python에 설치된 패키지를 공유하지 않는다.

환경을 활성화하면 셸의 `PATH` 앞에 가상 환경의 실행 파일 디렉토리가 추가된다. 이후 입력하는 `python`과 `pip`가 해당 환경의 실행 파일을 찾게 된다. 자세한 동작은 [Python venv 공식 문서](https://docs.python.org/3/library/venv.html)에서 확인할 수 있다.

가상 환경은 운영체제나 파일 접근을 격리하는 보안 장치가 아니다. Docker처럼 운영체제 실행 환경을 구성하는 도구와 목적이 다르며, 필요하면 컨테이너 안에서도 가상 환경을 사용할 수 있다.

## **1. 가상 환경 만들기**
{: .mt-5 .mb-2}

먼저 프로젝트 디렉토리에서 명령을 실행한다.

### **macOS / Linux**
{: .mt-4 .mb-2}

```bash
mkdir python-venv-demo
cd python-venv-demo
python3 --version
python3 -m venv .venv
```

### **Windows PowerShell**
{: .mt-4 .mb-2}

```powershell
mkdir python-venv-demo
cd python-venv-demo
py --version
py -m venv .venv
```

Windows에서 `py` 명령이 없다면 설치된 Python의 `python -m venv .venv`를 사용한다.

`venv`는 명령을 실행한 Python 버전으로 환경을 만든다. 다른 버전이 필요하면 그 버전의 Python을 먼저 설치하고, 해당 실행 파일로 환경을 생성해야 한다. `venv` 자체가 다른 Python 버전을 내려받거나 전환해주지는 않는다.

## **2. 활성화하고 확인하기**
{: .mt-5 .mb-2}

사용 중인 운영체제와 셸에 맞는 명령을 선택한다.

| 운영체제 / 셸 | 활성화 명령 |
| --- | --- |
| macOS / Linux, bash 또는 zsh | `source .venv/bin/activate` |
| Windows, PowerShell | `.\.venv\Scripts\Activate.ps1` |
| Windows, 명령 프롬프트(cmd) | `.venv\Scripts\activate.bat` |

프롬프트에 `(.venv)`가 표시되기도 한다. 실제로 어떤 Python을 사용하는지는 다음 명령으로 확인하는 편이 정확하다.

```bash
python -c "import sys; print(sys.executable); print(sys.prefix != sys.base_prefix)"
python -m pip --version
```

첫 번째 명령에서 프로젝트의 `.venv` 아래 실행 파일 경로와 `True`가 나오고, 두 번째 명령에서 `.venv` 안의 pip 경로가 나오면 해당 환경을 사용 중이다.

활성화는 현재 셸에 적용된다. 새 터미널을 열면 다시 활성화해야 하며, IDE에서도 프로젝트의 `.venv`를 Python 인터프리터로 선택해야 한다.

## **3. 패키지 설치와 실행**
{: .mt-5 .mb-2}

활성화한 터미널에서 패키지를 설치하고 가져올 수 있는지 확인한다.

```bash
python -m pip install requests
python -c "import requests; print(requests.__version__)"
python -m pip list
```

`python -m pip`를 사용하면 현재 선택한 Python에 연결된 pip를 실행할 수 있어, 다른 환경에 패키지를 설치하는 실수를 줄일 수 있다. 설치 흐름은 [Python Packaging User Guide](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/)에도 정리되어 있다.

활성화하지 않고 가상 환경의 Python 경로를 직접 지정해도 된다. 스크립트나 자동화 작업에서는 이 방식으로 실행 환경을 명시할 수 있다.

```bash
# macOS / Linux
.venv/bin/python -m pip list
.venv/bin/python app.py
```

```powershell
# Windows PowerShell
.\.venv\Scripts\python.exe -m pip list
.\.venv\Scripts\python.exe app.py
```

`app.py`는 프로젝트에서 직접 작성한 Python 파일을 의미한다.

## **4. 의존성 기록과 환경 재생성**
{: .mt-5 .mb-2}

작업한 환경의 설치 목록을 파일로 남겨두면 다른 환경에서도 패키지를 설치하는 데 사용할 수 있다.

```bash
python -m pip freeze > requirements.txt
```

다른 컴퓨터에서 저장소를 받은 뒤에는 Python을 설치하고 가상 환경을 새로 생성한다. 환경을 활성화한 다음 아래 명령을 실행한다.

```bash
python -m pip install -r requirements.txt
```

`freeze`는 직접 설치한 패키지뿐 아니라 그 패키지가 필요로 하는 의존성도 기록한다. 따라서 해당 프로젝트만 사용하는 환경에서 실행하는 것이 좋다.

버전 목록만으로 운영체제, Python 버전, 시스템 라이브러리까지 동일하게 맞춰지는 것은 아니다. 팀에서는 사용하는 Python 버전도 함께 기록하고, 더 엄격한 재현성이 필요하면 잠금 파일과 배포 환경 관리도 고려한다.

### **Git에는 무엇을 저장할까?**
{: .mt-4 .mb-2}

프로젝트의 `.gitignore`에는 다음 항목을 추가한다.

```gitignore
.venv/
__pycache__/
*.pyc
```

소스 코드와 `requirements.txt`는 Git으로 관리한다. `.venv`는 경로와 운영체제에 의존할 수 있으므로 통째로 복사하거나 커밋하기보다 필요한 곳에서 다시 만든다.

## **5. 비활성화하기**
{: .mt-5 .mb-2}

작업이 끝나면 다음 명령으로 현재 셸의 활성화를 해제한다.

```bash
deactivate
```

설치한 패키지와 `.venv` 디렉토리는 그대로 남는다. 다음 작업 때 다시 활성화하면 된다. 환경을 새로 만들어야 한다면 의존성 목록을 먼저 보관하고, 기존 `.venv`를 제거한 뒤 생성과 설치 과정을 반복한다.

## **자주 발생하는 문제**
{: .mt-5 .mb-2}

### **설치했는데 ModuleNotFoundError가 발생한다**
{: .mt-4 .mb-2}

패키지를 설치한 Python과 프로그램을 실행하는 Python이 같은지 확인한다. 터미널에서 `sys.executable`과 `python -m pip --version`을 확인하고, IDE의 인터프리터도 `.venv`로 맞춘다.

### **PowerShell에서 활성화 스크립트가 차단된다**
{: .mt-4 .mb-2}

실행 정책 때문에 `Activate.ps1` 실행이 제한될 수 있다. 환경의 `python.exe`를 직접 지정하면 활성화 없이 작업할 수 있다. 위의 Windows 직접 실행 예시를 사용한다.

### **Linux에서 venv 생성 중 ensurepip 오류가 발생한다**
{: .mt-4 .mb-2}

일부 Linux 배포판에서는 venv 관련 구성 요소를 별도 패키지로 제공한다. 사용 중인 배포판과 Python 버전에 맞는 venv 패키지가 설치되어 있는지 확인한다. Ubuntu/Debian 계열에서는 일반적으로 `python3-venv` 또는 해당 Python 버전의 venv 패키지를 확인한다.

### **externally-managed-environment 오류가 발생한다**
{: .mt-4 .mb-2}

운영체제가 관리하는 Python에 패키지를 설치하려 할 때 나타날 수 있다. 프로젝트 가상 환경을 만들고 그 안의 `python -m pip`로 설치한다. 오류의 배경은 [외부 관리 환경에 대한 Python Packaging 명세](https://packaging.python.org/en/latest/specifications/externally-managed-environments/)에서 확인할 수 있다.

## **실무에서 기억할 습관**
{: .mt-5 .mb-2}

- 프로젝트마다 가상 환경을 만든다.
- 패키지는 `python -m pip`로 설치한다.
- 터미널과 IDE가 같은 Python 환경을 사용하는지 확인한다.
- 가상 환경 디렉토리 대신 의존성 목록과 Python 버전 정보를 공유한다.

## **참고 자료**
{: .mt-5 .mb-2}

- [Python 공식 문서: venv](https://docs.python.org/3/library/venv.html)
- [Python 공식 튜토리얼: 가상 환경과 패키지](https://docs.python.org/3/tutorial/venv.html)
- [Python Packaging User Guide: pip와 venv로 패키지 설치](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/)
