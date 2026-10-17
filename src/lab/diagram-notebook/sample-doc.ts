export const DEFAULT_SAMPLE_DOC = `---
direction: LR
theme: glass
nodeSpacing: 50
---

# Cloud Application Architecture

When a client makes a request, the Load Balancer proxies it to our Core APIs, which query databases and cache layers within isolated subnets.

## Public Subnet (roundrect) {stroke: #3b82f6, fill: rgba(59, 130, 246, 0.05)}
- [client](actor) Client Browser
- [web](circle){fill: #1e3a8a, color: #ffffff} Load Balancer
- [client] -> [web] : HTTPS Request

## Private Subnet (roundrect) {stroke: #ef4444, fill: rgba(239, 68, 68, 0.05)}
- [app](oval){fill: #0d9488, color: #ffffff} API Service
- [db](database){fill: #ea580c, color: #ffffff} PostgreSQL DB
- [cache](cloud){fill: #ca8a04, color: #ffffff} Redis Cache
- [app] -> [db] {stroke: #ea580c} : SQL Query
- [app] <-> [cache] {stroke: #ca8a04} : Session Cache

## Gateway Routing
- [web] -> [app] {stroke: #10b981} : Reverse Proxy

Enjoy editing this document to watch the interactive hierarchical layout and glassmorphism render in the live preview pane!
`;
