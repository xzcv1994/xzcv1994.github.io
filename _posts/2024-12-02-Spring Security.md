---
title: Spring Security
author: seungbin
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

