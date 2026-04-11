# Sesión de Análisis - VoleyTrack

**Fecha:** 2026-04-05
**Tema:** Análisis y Especificación de Casos de Uso

---

## Contexto del Proyecto

Aplicación para trackear partidos de voley (proyecto personal). El objetivo es pasar por todas las etapas del ciclo de vida del software, actualmente en fase de **análisis**.

### Tipo de Voley
- Indoor 6v6 (por ahora)

### Actores Principales
1. **Planillero (Scorer)** — anota puntos, realiza cambios, gestiona el partido
2. **Espectador** — visualiza estadísticas en tiempo real (solo lectura)

### Funcionalidades Clave
- Anotar puntos (quién, cómo: ataque, bloqueo, error rival, etc.)
- Registrar saques (efectivo, error, punto directo/ace)
- Gestionar cambios (sustituciones de jugadores)
- Registrar rotaciones
- Ver estadísticas en tiempo real (espectadores)
- Controlar sets y marcador

### Información Capturada por Punto
- Sets
- Puntos
- Saques
- Quién hizo el punto
- Cómo lo hizo (ataque, bloqueo, error, etc.)
- ¿Fue error?
- ¿Fue punto de saque/ace?

---

## Preguntas Pendientes

1. ¿El planillero necesita crear equipos/jugadores ANTES del partido o ya vienen pre-cargados?
2. ¿Un partido se crea/configura antes de empezar? (ej: "Crear Partido", elegir equipos, formación inicial)
3. ¿Qué pasa si se anota mal un punto? ¿Se puede deshacer/corregir?
4. ¿Los cambios de jugadores tienen límite? (reglamento: 6 cambios por set, ¿lo valida el sistema?)
5. ¿Qué estadísticas son críticas para los espectadores? (puntos totales, efectividad de ataque, bloqueos, errores, etc.)

---

## Documentación Existente

- Ubicación: `/home/agustin/Documentos/Proyectos/VoleyTrack/DocsAnalisis`
- Contenido en Notion (pendiente de revisar)

---

## Próximos Pasos

1. Revisar documentación existente en `DocsAnalisis`
2. Responder preguntas pendientes
3. Especificar Casos de Uso formales
4. Generar diagramas UML:
   - Casos de Uso
   - Actividad
   - Estado
   - Modelo de análisis (clases)
   - Secuencia

---

## Ayuda Disponible

- ✅ Especificación de Casos de Uso (CU)
- ✅ Diagramas UML (PlantUML/Mermaid)
- ✅ Modelo de Análisis
- ✅ Requisitos Funcionales y No Funcionales
