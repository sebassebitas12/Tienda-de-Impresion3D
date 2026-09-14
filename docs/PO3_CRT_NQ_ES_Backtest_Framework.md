# PO3 / CRT — NQ & ES
## Strategy Specification, One-Page Playbook & Backtest Protocol

**Versión:** V1.0 — especificación de investigación
**Mercados:** NQ (E-mini Nasdaq-100) y ES (E-mini S&P 500)
**Entorno:** futuros de índices USA / replay histórico
**Objetivo:** descubrir, mediante backtesting, **cuándo** esta metodología tiene mejor comportamiento y convertir esos hallazgos en reglas operativas verificables.

> **Principio rector:** todavía no se asume qué día, sesión, hora, minuto, noticia o condición es rentable. Esas respuestas son resultados que debe producir el backtest.

---

# 1. Propósito

Este documento convierte las notas personales de trading en un marco de investigación reproducible. El núcleo observado en las notas es: **tiempo → BIAS → rango/CRT → liquidez → DOL → POI → manipulación → confirmación → entrada → expansión → gestión**.

Las notas indican que el BIAS sirve como contexto y vehículo para buscar mejores entradas, mientras que el DOL representa el objetivo de liquidez. También se indica que no debe operarse sin un rango activo ni a mitad del rango y que se busca un mínimo aproximado de R:R 1:2.5. [Fuente: notas personales]

El propósito del backtest no es demostrar que PO3/CRT funciona, sino medir bajo qué condiciones funciona mejor, cuándo falla y qué partes de la metodología aportan realmente valor.

---

# 2. Fuente y alcance

La base de este documento es la recopilación `onenote_apuntestrading.md`, creada a partir de cuatro fuentes de OneNote: análisis semanales, Notas rápidas, Quick Notes y el índice del bloc.

El archivo contiene conceptos de estrategia, reglas de gestión, horarios, sesiones, noticias, entradas, POI, liquidez, DOL, BIAS, failure swing, ejemplos de operaciones y observaciones históricas. Algunas partes recuperadas del OneNote presentan texto corrupto, por lo que **no se convierten en reglas obligatorias si su significado no puede establecerse con suficiente claridad**.

Las reglas históricas y las variantes experimentales deben mantenerse separadas de las reglas de V1.

---

# 3. Núcleo conceptual de la metodología

## 3.1 PO3 / AMD

La lógica registrada en las notas es un ciclo de tres fases:

1. **Acumulación**
2. **Manipulación / sprint**
3. **Distribución / expansión**

Las notas también contemplan que después de una expansión puede aparecer otro ciclo de tres fases en dirección contraria. [Fuente: notas personales]

### Interpretación de investigación

Para el backtest, PO3 debe tratarse como una hipótesis de secuencia y no como una etiqueta retroactiva. Una formación solo podrá clasificarse como válida cuando las condiciones previamente definidas ya hayan ocurrido.

---

## 3.2 CRT

En las notas CRT aparece asociada a:

- obtención de dirección;
- análisis del movimiento según dirección;
- verificación de la hora;
- espera de aperturas concretas;
- búsqueda de POI;
- entrada y confirmación;
- utilización de rangos CRT de H1 o H4 para contexto.

También aparece la regla conceptual de buscar compras por debajo de mínimos y ventas por encima de máximos, según el sesgo. [Fuente: notas personales]

### Regla de investigación

La definición exacta de CRT para V1 debe quedar congelada antes de iniciar una muestra principal. Si una definición cambia, nace una nueva versión de estrategia.

---

# 4. BIAS

Las notas definen el BIAS como sesgo direccional y establecen que debe revisarse antes de operar. Se recomienda alinear temporalidades mayores y menores y, cuando sea necesario, esperar cierres de H1 o H4. El BIAS no se considera necesariamente la dirección final del movimiento; funciona como vehículo para localizar mejores entradas. [Fuente: notas personales]

### Registro obligatorio

Cada trade debe guardar:

- BIAS HTF
- BIAS H1
- dirección prevista
- si el trade fue a favor o contra el BIAS
- temporalidad que produjo el BIAS
- vela que confirmó el BIAS

**Regla V1:** cualquier trade sin BIAS documentado se clasifica como `NO_TRADE / DATOS_INCOMPLETOS`.

---

# 5. DOL — Draw on Liquidity

Las notas identifican el DOL como el objetivo de liquidez que el precio busca capturar. También distinguen entre liquidez interna y externa.

### Liquidez interna registrada

- OB
- FVG
- estructuras

### Liquidez externa registrada

- estructuras
- DOL
- máximos y mínimos estructurales

Además aparecen como referencias de estructura:

- PDH — Previous Day High
- PDL — Previous Day Low
- PWH — Previous Week High
- PWL — Previous Week Low
- máximos y mínimos de sesión

[Fuente: notas personales]

### Regla de investigación

Antes de cada entrada debe existir una respuesta concreta a:

> **¿Dónde estoy y cuál es la liquidez que pretendo capturar?**

Si no puede responderse, el setup no es A+.

---

# 6. POI — Point of Interest

Las notas utilizan como POI:

- Order Block
- Fair Value Gap
- inducciones
- estructuras relevantes

La metodología registrada también establece que debe buscarse la entrada únicamente después de una confirmación. [Fuente: notas personales]

### Clasificación

`POI_OB`
`POI_FVG`
`POI_STRUCTURE`
`POI_INDUCTION`
`NO_POI`

Esto permitirá descubrir posteriormente qué POI aporta mayor expectativa.

---

# 7. Tiempo y sesiones

El tiempo es uno de los elementos más repetidos de las notas. Se registran sesiones, aperturas de velas, cuartiles y failure swings.

Las notas históricas contienen diferentes convenciones de horario, incluyendo UTC−5 y UTC−4, por lo que **no debe fijarse una regla definitiva de horario solo a partir de la nota**. Para NQ/ES se deberá registrar el timestamp de FX Replay y normalizar los análisis al horario de Nueva York usado por el estudio.

### Ventanas históricas observadas en las notas

- 5:00–9:00 NY
- Kill Zone NY 8:00–11:00
- otra ventana posterior de NY alrededor de la apertura regular
- 8:30 aparece específicamente asociada a la inyección de liquidez de Nasdaq y S&P 500 en las notas
- también se registra operar NY alrededor de 8:30–11:30 en una nota posterior

Estas ventanas son **hipótesis de investigación, no reglas de rentabilidad demostradas**.

---

# 8. Aperturas de velas y failure swing

Las notas consideran importantes varias aperturas de velas:

- 3:00 Londres
- 5:00
- 8:00 NY
- 9:00

También se menciona que aperturas H1/H4 pueden generar retrocesos o mitigaciones de manipulaciones anteriores.

Se registra un **failure swing H1** como un máximo o mínimo creado dentro de los últimos 7 minutos de la vela. Para H4 se menciona una referencia de 12 minutos. [Fuente: notas personales]

Las velas también se estudian por cuartiles:

| Temporalidad | Cuartil 1 | Cuartil 2 | Cuartil 3 | Cuartil 4 |
|---|---:|---:|---:|---:|
| 1H | 15m | 30m | 45m | 60m |
| 2H | 30m | 60m | 90m | 120m |
| 4H | 60m | 120m | 180m | 240m |
|
| 6H | 90m | 180m | 270m | 360m |

No se presume que estos cuartiles sean rentables; se medirán como variables.

---

# 9. Entradas

Las notas contienen varios modelos de entrada y una checklist de investigación. Aparecen, entre otros:

- continuación;
- retroceso;
- noticias;
- liquidez externa;
- confirmación LTF;
- OB/FVG en M15;
- modelos de entrada asociados a aperturas y manipulaciones.

También aparece una variante experimental posterior que combina MACD + VWAP + CRT, incluyendo cruce de EMA/MACD en 1M y contexto del VWAP. Esa variante **no debe mezclarse automáticamente con PO3/CRT V1**; queda almacenada como experimento separado.

[Fuente: notas personales]

---

# 10. Regla de entrada V1 — propuesta de trabajo

La V1 de investigación debe evaluar primero un modelo simple y aislado.

### Setup base

1. Definir contexto HTF.
2. Identificar BIAS.
3. Identificar rango/CRT activo.
4. Identificar liquidez y DOL.
5. Esperar manipulación o raid del extremo relevante.
6. Esperar confirmación objetiva.
7. Esperar entrada en POI o mecanismo definido.
8. Colocar SL según estructura.
9. Exigir R:R mínimo de 1:2.5 cuando el target estructural permita ese recorrido.
10. Registrar resultado en R.

### Importante

Los pasos anteriores describen el flujo de la metodología, pero **los detalles matemáticos de cada condición deben congelarse antes de la muestra principal**. No se deben optimizar sobre la marcha después de observar resultados.

---

# 11. Gestión

Las notas registran:

- riesgo de referencia de 0.5% por operación en cuenta real;
- referencia de 1% en fondeo;
- drawdown diario de 1% como referencia de cuenta real;
- dos stops diarios como límite mencionado;
- drawdown total de 6% mencionado para cuentas de un paso;
- SL debajo de mínimos o encima de máximos según escenario;
- BE aproximadamente después de 50% de avance;
- después de alcanzar objetivo: cerrar plataforma, reducir lotaje, limitar operaciones y operar solo A+.

[Fuente: notas personales]

### Para el backtest

No se debe usar una gestión distinta para trades ganadores y perdedores. La regla de gestión se fija antes de la prueba.

---

# 12. NQ y ES

El estudio se realizará exclusivamente sobre:

- **NQ — E-mini Nasdaq-100 Futures**
- **ES — E-mini S&P 500 Futures**

CME especifica para NQ un multiplicador de $20 por punto del índice y un tick mínimo de 0.25 puntos = $5. Para ES, el multiplicador es $50 por punto y el tick mínimo es 0.25 puntos = $12.50. [CME]

Por tanto, para comparar NQ y ES se debe priorizar **R, expectativa y drawdown**, no dólares brutos.

---

# 13. Noticias

Las notas indican consultar siempre el calendario económico y prestar atención a:

- NFP
- CPI / IPC
- FOMC
- decisiones de tipos
- PMI
- ventas minoristas
- desempleo
- discursos relevantes

También se señala que los días previos a noticias importantes pueden presentar mayor volatilidad/liquidez. [Fuente: notas personales]

FX Replay dispone de calendario económico histórico dentro del entorno de replay, lo que permite segmentar el backtest alrededor de eventos como NFP, CPI y decisiones de tipos. [FX Replay]

### Las noticias serán una variable de estudio

No se debe decidir de antemano que "noticias = no operar".

Se medirán al menos:

- sin noticia importante cercana;
- noticia de alto impacto antes de la entrada;
- noticia de alto impacto durante la operación;
- noticia de alto impacto posterior a la entrada;
- ventana de 5m;
- ventana de 15m;
- ventana de 30m;
- ventana de 60m;
- evento específico.

El resultado determinará si aparece una regla de exclusión o una regla especial.

---

# 14. Diseño del backtest

## Fase 1 — Definición

Congelar:

- instrumentos;
- contrato o continuidad utilizada en FX Replay;
- timezone de análisis;
- sesión;
- temporalidades;
- definición exacta de CRT;
- definición exacta de PO3;
- confirmación;
- entrada;
- SL;
- TP;
- BE;
- riesgo;
- número máximo de trades;
- reglas de noticias.

**No iniciar la muestra principal hasta que estas variables estén escritas.**

---

## Fase 2 — Muestra inicial

Objetivo: construir una base suficientemente grande y limpia.

Referencia de investigación de FX Replay:

- 100 trades = mínimo recomendado para empezar a detectar patrones;
- 200 trades = base mucho más robusta para conclusiones a través de distintos entornos.

[FX Replay]

Idealmente la muestra debe cubrir:

- NQ y ES;
- distintos meses;
- distintos regímenes de volatilidad;
- días tendenciales;
- días laterales;
- días de noticias;
- días sin noticias relevantes.

---

# 15. Variables que debemos descubrir

El objetivo específico del experimento es responder:

## Día de semana

- lunes
- martes
- miércoles
- jueves
- viernes

Preguntas:

- ¿Qué día tiene mejor expectativa?
- ¿Qué día produce más setups A+?
- ¿Qué día produce más falsos sweeps?
- ¿Qué día tiene mayor drawdown?

## Sesión

- overnight / Globex
- premarket
- apertura regular USA
- RTH posterior
- post-open

## Hora

No asumir una ventana ganadora.

Registrar la hora exacta y luego agrupar en:

- bloques de 5 minutos;
- bloques de 15 minutos;
- bloques de 30 minutos;
- bloques horarios.

Así podremos descubrir, por ejemplo, si una estrategia funciona únicamente en determinados segmentos y no durante toda la sesión.

## Minuto dentro de la vela

Registrar:

- minuto de entrada;
- minuto del sweep;
- minuto de confirmación;
- minuto del máximo/mínimo relevante;
- cuartil de la vela H1/H4.

## Noticias

Registrar:

- tipo de noticia;
- impacto;
- minutos respecto al evento;
- dirección previa;
- distancia al rango;
- resultado.

## Estructura

Registrar:

- PDH/PDL;
- PWH/PWL;
- overnight high/low;
- sesión anterior high/low;
- rango CRT;
- liquidez interna;
- liquidez externa;
- DOL.

## Setup

Registrar:

- PO3;
- CRT;
- continuación;
- retroceso;
- noticia;
- liquidez externa;
- POI OB;
- POI FVG;
- POI estructura.

---

# 16. Etiquetado estándar para FX Replay

Usar etiquetas coherentes desde el primer trade.

### Instrumento

`NQ`
`ES`

### Dirección

`LONG`
`SHORT`

### Setup

`PO3`
`CRT`
`PO3_CRT`

### Calidad

`A_PLUS`
`A`
`B`
`INVALID`

### Contexto

`BIAS_BULL`
`BIAS_BEAR`
`BIAS_NEUTRAL`

### Liquidez

`PDH`
`PDL`
`PWH`
`PWL`
`ON_HIGH`
`ON_LOW`
`RTH_HIGH`
`RTH_LOW`
`INTERNAL_LIQ`
`EXTERNAL_LIQ`

### POI

`OB`
`FVG`
`STRUCTURE`
`INDUCTION`

### Entrada

`CONTINUATION`
`RETRACEMENT`
`NEWS`
`EXTERNAL_LIQ_ENTRY`

### Tiempo

`OPENING_WINDOW`
`PREMARKET`
`RTH_OPEN`
`POST_OPEN`
`OTHER`

### Noticias

`NO_NEWS`
`NEWS_5M`
`NEWS_15M`
`NEWS_30M`
`NEWS_60M`
`NFP`
`CPI`
`FOMC`
`RATE_DECISION`
`PMI`
`JOBS`

### Resultado

`WIN`
`LOSS`
`BE`

### Calidad de ejecución

`RULES_FOLLOWED`
`LATE_ENTRY`
`EARLY_ENTRY`
`EARLY_EXIT`
`RULE_VIOLATION`
`EMOTIONAL_ERROR`

---

# 17. Datos obligatorios de cada trade

| Campo | Obligatorio |
|---|---|
| Fecha | Sí |
| Instrumento | Sí |
| Hora NY | Sí |
| Día de semana | Sí |
| Sesión | Sí |
| Setup | Sí |
| Dirección | Sí |
| BIAS | Sí |
| Rango/CRT | Sí |
| Manipulación | Sí |
| Confirmación | Sí |
| POI | Sí |
| Entry | Sí |
| SL | Sí |
| TP | Sí |
| Riesgo R | Sí |
| Resultado R | Sí |
| News context | Sí |
| Screenshot pre-entry | Sí |
| Screenshot post-exit | Sí |
| Regla violada | Si existe |
| Comentario objetivo | Sí |

---

# 18. Métricas

No utilizar win rate como métrica principal.

Medir:

- número de trades;
- wins;
- losses;
- BE;
- win rate;
- average R;
- average win R;
- average loss R;
- expectancy;
- profit factor;
- max drawdown;
- consecutive wins;
- consecutive losses;
- average trade duration;
- MAE;
- MFE;
- performance por día;
- performance por sesión;
- performance por hora;
- performance por minuto;
- performance por noticia;
- performance por instrumento;
- performance por setup;
- performance por entrada;
- performance por POI.

FX Replay ofrece análisis temporal por hora/sesión/día, calendario de rendimiento, etiquetado, revisión sobre el gráfico y simulación Monte Carlo. [FX Replay]

---

# 19. Cómo descubrir la verdadera ventana rentable

No se permite decir:

> "8:30–10:00 es la mejor hora"

después de observar diez trades.

El proceso correcto será:

### Paso A
Recolectar la muestra sin cambiar reglas.

### Paso B
Separar resultados por bloques temporales.

### Paso C
Buscar consistencia entre múltiples periodos.

### Paso D
Comparar NQ vs ES.

### Paso E
Comparar días de semana.

### Paso F
Comparar contexto de noticias.

### Paso G
Separar setups válidos de errores de ejecución.

### Paso H
Formular una hipótesis nueva.

### Paso I
Probar la hipótesis en un periodo fuera de muestra.

### Paso J
Solo entonces convertirla en regla operativa.

---

# 20. Control contra overfitting

Toda modificación de estrategia crea una nueva versión.

Ejemplo:

`PO3_CRT_V1`

→ se descubre que una ventana horaria parece superior

`PO3_CRT_V2_TIME_FILTER`

→ se prueba de nuevo en datos fuera de muestra.

Nunca se deben modificar múltiples variables al mismo tiempo y luego atribuir la mejora a una sola.

FX Replay recomienda probar reglas en distintos entornos, registrar todas las operaciones y utilizar periodos fuera de muestra para reducir el riesgo de sobreajuste. [FX Replay]

---

# 21. Estrategia de una hoja — PO3 / CRT NQ & ES

## OBJETIVO

Capturar la expansión que sigue a una toma de liquidez/manipulación dentro de un contexto temporal y estructural definido.

## MERCADOS

**NQ / ES**

## CONTEXTO

**HTF → BIAS → rango CRT → liquidez → DOL → POI → confirmación → entrada → expansión**

## ANTES DE OPERAR

1. ¿Cuál es el BIAS?
2. ¿Qué temporalidad lo genera?
3. ¿Existe un rango/CRT activo?
4. ¿Dónde está la liquidez interna?
5. ¿Dónde está la liquidez externa?
6. ¿Cuál es el DOL?
7. ¿Dónde está el POI?
8. ¿En qué sesión y hora estoy?
9. ¿Existe una noticia relevante?
10. ¿El trade permite al menos 1:2.5?

Si una respuesta crítica es "NO / DESCONOCIDO": **NO TRADE**.

## SETUP

### LONG

1. Contexto/Bias favorable.
2. Precio se encuentra en una ubicación válida del rango.
3. Se toma liquidez por debajo del extremo relevante.
4. El precio confirma rechazo/reclaim según la definición congelada de V1.
5. Aparece confirmación LTF.
6. Entrada en POI definido.
7. SL debajo de la estructura que invalida.
8. TP hacia DOL/liquidez objetivo.

### SHORT

Misma lógica invertida:

1. Contexto/Bias favorable.
2. Ubicación válida del rango.
3. Toma de liquidez por encima del extremo relevante.
4. Confirmación de rechazo/reclaim.
5. Confirmación LTF.
6. Entrada en POI.
7. SL encima de estructura.
8. TP hacia DOL/liquidez objetivo.

## GESTIÓN

- respetar SL;
- mínimo objetivo aproximado 1:2.5;
- BE según regla congelada;
- no intervenir discrecionalmente sin registrar el motivo;
- cerrar/limitar operativa después del objetivo diario según reglas de gestión.

## NO TRADE

- sin rango activo;
- precio a mitad de rango;
- sin DOL claro;
- sin confirmación;
- setup incompleto;
- entrada tardía;
- relación R:R insuficiente;
- regla crítica violada.

## DATOS QUE DEBEMOS DESCUBRIR

**Día:** ¿lunes–viernes?

**Sesión:** ¿overnight, premarket, open, RTH?

**Hora:** ¿qué bloques tienen expectativa positiva?

**Minuto:** ¿qué minutos concentran mejores entradas?

**Noticias:** ¿cuáles ayudan, cuáles destruyen la expectativa y cuáles exigen exclusión?

**Instrumento:** ¿NQ o ES?

**Setup:** ¿PO3, CRT o combinación?

**POI:** ¿OB, FVG, estructura o inducción?

**Dirección:** ¿LONG/SHORT?

**Resultado:** medir siempre en R.

> **No se empieza con "cuándo operar". Se empieza con una regla fija y el backtest descubre cuándo merece ser activada.**

---

# 22. Protocolo de decisión después del backtest

## Nivel 1 — Evidencia insuficiente

Menos de 100 trades o muestra sesgada.

**Acción:** continuar recolectando.

## Nivel 2 — Hipótesis prometedora

Una combinación de variables muestra mejor expectativa, pero todavía no existe validación fuera de muestra.

**Acción:** crear hipótesis, no convertirla en regla definitiva.

## Nivel 3 — Regla candidata

La condición mantiene resultados positivos en periodos diferentes y presenta drawdown compatible con el plan de riesgo.

**Acción:** prueba fuera de muestra.

## Nivel 4 — Regla validada

La condición conserva una ventaja razonablemente estable fuera de muestra.

**Acción:** incorporarla a la siguiente versión de la estrategia.

---

# 23. Mentor AI — función recomendada

Mentor debe actuar como **supervisor de investigación**, no como señalizador.

Debe:

- impedir hindsight;
- exigir reglas previamente definidas;
- detectar violaciones;
- distinguir hechos de interpretación;
- obligar a registrar contexto;
- analizar patrones entre tags;
- no decir que una operación era válida basándose en lo que ocurrió después;
- separar calidad del setup y calidad de ejecución;
- ayudar a comparar NQ/ES, días, sesiones, horas, minutos y noticias;
- señalar cuándo una conclusión parece producto de una muestra pequeña;
- impedir que una pérdida cambie las reglas retrospectivamente.

## Formato recomendado para revisar una operación

```text
FACTOS OBSERVABLES:
- ...

REGLAS ACTIVADAS:
- ...

REGLAS NO ACTIVADAS:
- ...

CONTEXTO:
- Instrumento:
- Día:
- Sesión:
- Hora NY:
- News:
- BIAS:
- DOL:
- Liquidez:
- POI:

SETUP:
- PO3 / CRT / otro

ENTRADA:
- ...

GESTIÓN:
- ...

RESULTADO:
- R:

CALIDAD:
- A+
- A
- B
- INVALID

HIPÓTESIS PARA INVESTIGAR:
- ...
```

---

# 24. Qué NO debe hacer Mentor

- No predecir el mercado.
- No dar señales para operar dinero real.
- No convertir cualquier sweep en manipulación.
- No llamar PO3 a posteriori.
- No mezclar automáticamente VWAP/MACD con V1.
- No optimizar después de cada pérdida.
- No eliminar pérdidas del dataset.
- No utilizar win rate como única prueba.
- No concluir que una hora es rentable por pocos casos.
- No convertir correlación en causalidad.

---

# 25. Fuentes externas de referencia

### CME Group

Especificaciones oficiales de NQ y ES, incluyendo multiplicadores y tamaño mínimo de tick.

### FX Replay

Documentación pública sobre backtesting, diario, análisis temporal, calendario económico, etiquetado, revisión en gráfico y Monte Carlo.

FX Replay indica que el backtesting no garantiza rendimiento futuro y recomienda muestras amplias, etiquetas coherentes, pruebas en distintos entornos y validación fuera de muestra.

---

# 26. Estado de la estrategia

**PO3/CRT V1 — EN INVESTIGACIÓN**

No se declara rentable.

No existe todavía un filtro definitivo por:

- día;
- sesión;
- hora;
- minuto;
- noticia;
- NQ vs ES.

Esas variables forman parte del experimento.

---

# 27. Resultado final que buscamos

Al terminar el estudio deberíamos poder responder con datos:

> **¿Qué condiciones necesito para operar NQ/ES con mi modelo PO3/CRT y cuáles debo evitar?**

La respuesta final debería quedar expresada como una matriz del tipo:

| Variable | Condición | Trades | Win Rate | Avg R | Expectancy | Max DD | Decisión |
|---|---|---:|---:|---:|---:|---:|---|
| Día | Lunes | — | — | — | — | — | INVESTIGAR |
| Día | Martes | — | — | — | — | — | INVESTIGAR |
| Sesión | NY Open | — | — | — | — | — | INVESTIGAR |
| Hora | 09:30–10:00 | — | — | — | — | — | INVESTIGAR |
| News | NFP ±15m | — | — | — | — | — | INVESTIGAR |
| Setup | PO3 | — | — | — | — | — | INVESTIGAR |
| Setup | CRT | — | — | — | — | — | INVESTIGAR |
| Instrumento | NQ | — | — | — | — | — | INVESTIGAR |
| Instrumento | ES | — | — | — | — | — | INVESTIGAR |

**La estrategia operativa definitiva será una conclusión del dataset, no una suposición previa.**
