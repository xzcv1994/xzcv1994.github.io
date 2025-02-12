---
title: Spring Security
author: cotes
date: 2024-12-02 11:39:00 +0800
categories: [Spring, Spring Security]
tags: [typography]
pin: true
math: true
mermaid: true
---
Spring Security는 인증 및 권한 기능, 보호 기능을 손쉽게 추가할 수 있는 Spring의 Framework이다.

## **사용 이유**
Spring 생태계에서 보안에 필요한 기능들을 제공하기 때문
Spring Security는 Spring이라는 프레임 워크 안에서 활용하기 적합한 구조로 설계되어 있어, 보안 기능을 추가할 때 활용하기 좋다.

프레임워크를 사용하지 않고 코드를 직접 작성할 경우 Spring에서 추구하는 IoC/DI 패턴과 같은 확장 패턴을 염두해서 인증/인가 부분을 직접 개발해야하는데 이는 쉽지 않기 때문에
Spring Security에서 제공하는 기능들을 활용하여 개발 작업 효율을 높일 수 있다.

## **아키텍쳐**
![Desktop View](/assets/img/postImage/archi.png)
<!-- 이미지 출처 : [https://www.elancer.co.kr/blog/detail/235?seq=235](https://www.elancer.co.kr/blog/detail/235?seq=235) -->

### **Spring Security Filter**
![Desktop View](/assets/img/postImage/securityFilter.png)
Spring Boot Application은 Tomcat이라는 Servlet Container 위에서 동작하고 Client 요청이 오면 Servlet Container의 Filter들을 통과해서 Controller로 전달한다.

![Desktop View](/assets/img/postImage/securityFilter4.png)
Spring Security는 Servlet Container에 존재하는 FilterChain에 DelegatingFilter를 등록하여 모든 요청을 가로챈다.
가로챈 요청은 Security FilterChain에서 처리 후 상황에 따라 거부, 리디렉션, 서블릿으로 요청을 전달한다.
springSecurityFilterChain은 애플리케이션의 url을 보호하고, username/password를 검증하고, 로그인 폼으로 리다이렉팅하는 등등의 일을 담당한다.)

{: .mt-2 .mb-1}


### **Spring Security Filter 동작원리**
![Desktop View](/assets/img/postImage/securityFilter2.png){: width="50%" height="589" }
![Desktop View](/assets/img/postImage/securityFilter3.png){: width="50%" height="589" }
![Desktop View](/assets/img/postImage/securityFilter4.png){: width="50%" height="589" }


##### **이벤트 처리 보장** : 분산 데이터 파이프라인에서 데이터를 전달하는 방법 3가지 방법이 있다
{: .mt-4 .mb-0}
- At least once : 최소 한번의 전달 보장, 데이터 전송 후 전달 완료가 확인되지 않아 타임아웃되면 재전송, 데이터가 중복으로 수신되어도 무방한 경우에 사용
- At most once : 한 번의 전송만 수행, 지연이나 유실이 발생해도 데이터를 재전송하지 않음, 데이터를 수신하지 않아도 무방한 경우 사용
- Exactly once : 정확하게 한 번의 전달만 보장

##### **내결함성** : 장애가 발생하면 복구하여 처리 시점부터 재개할 수 있는 기능
{: .mt-0 .mb-0}
- 플링크의 경우 이벤트 스트림이 메모리에 적재되기 때문에 시스템이 갑작스럽게 중단되면 처리중이던 데이터의 복구가 어려울 수 있다. 이를 방지하기 위해 세이브 포인트 기능으로 현재 메모리에 적재된 내용의 스냅샷을 영구 저장소에 백업하는 기능을 지원

##### **상태관리** : 입력 데이터의 현재 상태 관리를 위해 실시간으로 유입되는 데이터에 워터마크나 유한 크기로 분할해 처리하는 위도우 개념을 적용하기도 함.
{: .mt-0 .mb-0}

### **형태**
{: .mt-4 .mb-1}
스트림 프로세싱은 구현 방법에 따라 네이티브 스트림(Native Stream), 소규모 일괄처리(Micro Batch) 형태로 구분할 수 있다.

##### **네이티브 스트림** : 장애가 발생하면 복구하여 처리 시점부터 재개할 수 있는 기능
{: .mt-0 .mb-4}

##### **소규모 일괄처리** : 네이티브 스트림 대비 지연시간 있음
{: .mt-0 .mb-0}

### **종류**
{: .mt-4 .mb-3}

**아파치 스파크** : 스트림을 소규모 일괄처리하는 형태, 지연이 발생하지만 가장 활성화되어 있는 스트림 프로세서 중 하나, Exactly once의 이벤트 처리를 보장한다. 사용이 어렵지만 고급 분석 기능을 제공   
**아파치 스톰** : 지연이 매우 짧고 복잡하지 않은 스트림에 적합. 하지만 MIcro-batching 스트림 모델인 스톰 트라이던트를 사용하지 않으면 At least once의 이벤트 처리를 보장한다. 또한 상태관리가 지원되지 않아 집계, 윈도우, 워터마크등을 사용할 수 없기 때문에 고급 분석에 제약이 있다.   
**아파치 카프카 스트림즈** : 카프카 스트림즈는 카프카 기능의 일부로 스트림 프로세싱을 위한 경량 라이브러리이다. 스파크나 플링크보다 강력하진 않지만 Exactly-once의 이벤트 처리를 보장, 다른 스트림 프로세서들이 실행 프레임워크인 것에 비해 사용이 쉽다는 이점.   
**아파치 플링크** :  Exactly-once의 이벤트 처리를 보장하는 네이티브 스트림 방식, 지연 발생이 적고 처리량은 높으며 비교적 사용하기 쉽다. 일괄처리 기능도 제공하지만 스트림 프로세싱을 목적으로 주로 사용. 

## **주피터 노트북**
{: .mt-5 .mb-2 }
오픈소스 기반의 웹플랫폼, 파이썬을 비롯한 다양한 프로그래밍 언어로 코드 작성 및 실행하는 개발 환경.

## **IaC(InfraStructure as Code) - 코드형 인프라**
{: .mt-5 .mb-2 }
IT 인프라 프로비저닝을 자동화하는 기술적인 하이 레벨 코딩 언어. 애플리케이션을  개발, 테스트, 배포 할 때마다 서버, 운영체제, DB연결, 스토리지 및 기타 인프라 요소를 수동으로 프로비저닝 및 관리할 필요가 없다.  

IaC는 경쟁력있는 속도로 진행되는 소프트웨어 제공 라이프사이클에 필수불가결한 DevOps 프랙티스이다.  

코드형 인프라는 개발자가 스크립트를 실행하여 완전 문서화되고 버전화된 인프라를 효과적으로 완료할 수 있는 마지막 단계를 수행한다.

#### H4 - heading
{: data-toc-skip='' .mt-4 }

## Paragraph

Quisque egestas convallis ipsum, ut sollicitudin risus tincidunt a. Maecenas interdum malesuada egestas. Duis consectetur porta risus, sit amet vulputate urna facilisis ac. Phasellus semper dui non purus ultrices sodales. Aliquam ante lorem, ornare a feugiat ac, finibus nec mauris. Vivamus ut tristique nisi. Sed vel leo vulputate, efficitur risus non, posuere mi. Nullam tincidunt bibendum rutrum. Proin commodo ornare sapien. Vivamus interdum diam sed sapien blandit, sit amet aliquam risus mattis. Nullam arcu turpis, mollis quis laoreet at, placerat id nibh. Suspendisse venenatis eros eros.

## Lists

### Ordered list

1. Firstly
2. Secondly
3. Thirdly

### Unordered list

- Chapter
  + Section
    * Paragraph

### ToDo list

- [ ] Job
  + [x] Step 1
  + [x] Step 2
  + [ ] Step 3

### Description list

Sun
: the star around which the earth orbits

Moon
: the natural satellite of the earth, visible by reflected light from the sun

## Block Quote

> This line shows the _block quote_.

## Prompts

> An example showing the `tip` type prompt.
{: .prompt-tip }

> An example showing the `info` type prompt.
{: .prompt-info }

> An example showing the `warning` type prompt.
{: .prompt-warning }

> An example showing the `danger` type prompt.
{: .prompt-danger }

## Tables

| Company                      | Contact          | Country |
|:-----------------------------|:-----------------|--------:|
| Alfreds Futterkiste          | Maria Anders     | Germany |
| Island Trading               | Helen Bennett    | UK      |
| Magazzini Alimentari Riuniti | Giovanni Rovelli | Italy   |

## Links

<http://127.0.0.1:4000>

## Footnote

Click the hook will locate the footnote[^footnote], and here is another footnote[^fn-nth-2].

## Inline code

This is an example of `Inline Code`.

## Filepath

Here is the `/path/to/the/file.extend`{: .filepath}.

## Code blocks

### Common

```
This is a common code snippet, without syntax highlight and line number.
```

### Specific Language

```bash
if [ $? -ne 0 ]; then
  echo "The command was not successful.";
  #do the needful / exit
fi;
```

### Specific filename

```sass
@import
  "colors/light-typography",
  "colors/dark-typography";
```
{: file='_sass/jekyll-theme-chirpy.scss'}

## Mathematics

<!-- The mathematics powered by [**MathJax**](https://www.mathjax.org/): -->

$$ \sum_{n=1}^\infty 1/n^2 = \frac{\pi^2}{6} $$

When $a \ne 0$, there are two solutions to $ax^2 + bx + c = 0$ and they are

$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

## Mermaid SVG

```mermaid
 gantt
  title  Adding GANTT diagram functionality to mermaid
  apple :a, 2017-07-20, 1w
  banana :crit, b, 2017-07-23, 1d
  cherry :active, c, after b a, 1d
```

## Images

### Default (with caption)

![Desktop View](/assets/img/postImage/securityFilter.png){: width="972" height="589" }
_Full screen width and center alignment_

### Left aligned

![Desktop View](/assets/img/postImage/securityFilter.png){: width="972" height="589" .w-75 .normal}

### Float to left

![Desktop View](/assets/img/postImage/securityFilter.png){: width="972" height="589" .w-50 .left}
Praesent maximus aliquam sapien. Sed vel neque in dolor pulvinar auctor. Maecenas pharetra, sem sit amet interdum posuere, tellus lacus eleifend magna, ac lobortis felis ipsum id sapien. Proin ornare rutrum metus, ac convallis diam volutpat sit amet. Phasellus volutpat, elit sit amet tincidunt mollis, felis mi scelerisque mauris, ut facilisis leo magna accumsan sapien. In rutrum vehicula nisl eget tempor. Nullam maximus ullamcorper libero non maximus. Integer ultricies velit id convallis varius. Praesent eu nisl eu urna finibus ultrices id nec ex. Mauris ac mattis quam. Fusce aliquam est nec sapien bibendum, vitae malesuada ligula condimentum.

### Float to right

![Desktop View](/assets/img/postImage/archi.png){: width="972" height="589" .w-50 .right}
Praesent maximus aliquam sapien. Sed vel neque in dolor pulvinar auctor. Maecenas pharetra, sem sit amet interdum posuere, tellus lacus eleifend magna, ac lobortis felis ipsum id sapien. Proin ornare rutrum metus, ac convallis diam volutpat sit amet. Phasellus volutpat, elit sit amet tincidunt mollis, felis mi scelerisque mauris, ut facilisis leo magna accumsan sapien. In rutrum vehicula nisl eget tempor. Nullam maximus ullamcorper libero non maximus. Integer ultricies velit id convallis varius. Praesent eu nisl eu urna finibus ultrices id nec ex. Mauris ac mattis quam. Fusce aliquam est nec sapien bibendum, vitae malesuada ligula condimentum.

### Dark/Light mode & Shadow

The image below will toggle dark/light mode based on theme preference, notice it has shadows.

![light mode only](/assets/img/postImage/securityFilter.png){: .light .w-75 .shadow .rounded-10 w='1212' h='668' }
![dark mode only](/assets/img/postImage/securityFilter.png){: .dark .w-75 .shadow .rounded-10 w='1212' h='668' }

## Video

{% include embed/youtube.html id='Balreaj8Yqs' %}

## Reverse Footnote

[^footnote]: The footnote source
[^fn-nth-2]: The 2nd footnote source
