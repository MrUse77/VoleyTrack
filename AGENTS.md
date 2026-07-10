# Decisiones de Stack - VoleyTrack

## Contexto
El proyecto busca desarrollar una aplicación escalable y estructurada para el tracking de partidos de vóley. Se priorizó un stack que permita aprender tecnologías modernas y ser competitivo en el mercado laboral.

---

## Decisiones del Stack

### **Backend**
- **Framework:** NestJS
  - Se eligió por su modularidad, inyección de dependencias nativa y estructura sólida para proyectos escalables.
  - Compatible con TypeScript y Bun, asegurando desempeño y velocidad en el desarrollo.
  - Adaptable a patrones de diseño como Hexagonal Architecture y Domain-Driven Design (DDD).  
- **Runtime:** Bun
  - Elegido por su velocidad (3-4x más rápido que Node.js) y soporte nativo para TypeScript.
  - Uso para el servidor, compilación y bundle ligero.
- **Base de Datos:** PostgreSQL + Prisma ORM
  - Base relacional madura, ACID, perfecta para la integridad de datos de partidos, jugadores y estadísticas.
  - Prisma elegido por su type-safety, migrations automáticas y DX excelente con TypeScript.

---

### **Frontend**
- **Framework:** Angular
  - Ideal por su enfoque empresarial, estructura modular y TypeScript nativo.
  - Escalable para aplicaciones grandes y frameworks robustos con soporte a largo plazo.
- **UI Framework:** Angular Material
  - Proporciona componentes predefinidos que agilizan el desarrollo visual.

---

### **Arquitectura**
- **Backend**: Hexagonal Architecture (Ports & Adapters) y Domain-Driven Design (DDD)
  - La idea es mantener el dominio independiente de frameworks y librerías externas.
  - Los módulos de NestJS serán adaptadores para la ejecución del dominio central.

- **Frontend**: Modular con Angular
  - Aunque no directamente hexagonal, se estructurará en módulos que reflejen casos de uso clave.

---

## Alcance y Versionado (MVP)
Para la **Primera Versión (V1)**, el desarrollo se centrará exclusivamente en la gestión de:
- **Equipos** (ABM y planteles)
- **Jugadores** (ABM)
- **Partidos** (Programación, desarrollo en vivo y estadísticas)

> [!NOTE]
> Todo el módulo y la lógica de **Torneos** (ligas, llaves, clasificaciones, etc.) queda **excluido de la versión inicial** y se planificará para una segunda etapa, con el objetivo de acelerar el lanzamiento del núcleo estadístico del sistema.

---

## Próximos Pasos
1. Configuración inicial del proyecto con NestJS y Angular.
2. Implementar la base de datos y modelos iniciales (partido, jugador, estadísticas).
3. Diseñar los módulos del backend siguiendo Hexagonal Architecture y DDD.
4. Crear las vistas básicas en Angular con Angular Material.
