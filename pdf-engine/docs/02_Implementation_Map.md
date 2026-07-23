# PDF Engine v2 — Implementation Map

Status: Planned

---

# Goal

Реализовать PDF Engine v2 на основе Architecture.md без нарушения существующей совместимости.

Главная цель — перейти от набора независимых Renderer к модульному Executive Report Engine.

---

# Stage 1 — Standardize Renderers

Цель:

Все Renderer должны иметь одинаковую внутреннюю структуру.

Стандарт:

```
buildModel()

↓

renderModel()

↓

render()
```

Каждый Renderer отвечает только за собственную секцию.

Никаких знаний о соседних секциях.

---

Файлы:

- header.js
- statistics.js
- summary.js
- findings.js
- tasks.js
- owners.js
- architecture.js
- footer.js

---

# Stage 2 — Section Definition Registry

Создать единый Registry.

Каждая секция описывается декларативно.

Например:

- id
- title
- renderer
- optional
- order
- container
- supported layouts

Renderer больше не должен содержать подобную информацию внутри себя.

---

# Stage 3 — Container Builder

Добавить уровень Container.

Контейнеры:

- Metadata
- Knowledge
- Execution
- Architecture

Контейнер отвечает исключительно за компоновку секций.

---

# Stage 4 — Layout Engine v2

Layout Engine должен принимать решения на уровне Container.

Поддерживаемые возможности:

- одна колонка;
- две колонки;
- три колонки;
- адаптивная ширина;
- динамическое перераспределение пространства.

---

# Stage 5 — Adaptive Density

Каждая секция должна поддерживать несколько режимов отображения.

Например:

- default
- compact
- dense
- inline

Layout Engine самостоятельно выбирает наиболее подходящий режим.

---

# Stage 6 — Overflow Engine

Если документ не помещается:

Engine последовательно:

1. уменьшает padding;

2. уменьшает gap;

3. включает compact mode;

4. включает dense mode;

5. меняет layout;

6. переносит документ на вторую страницу только как последнее средство.

---

# Stage 7 — Universal Report Support

Engine должен поддерживать произвольные AI Report JSON.

MeetMind является первым потребителем движка.

В будущем должны поддерживаться:

- Executive Reports;
- Product Reviews;
- AI Audit Reports;
- Architecture Reports;
- Strategy Reports;
- Research Reports.

Без изменения ядра Engine.

---

# Current Priority

Текущая задача разработки:

- завершить стандартизацию Renderer;
- реализовать Section Registry;
- реализовать Container Builder.

После этого можно переходить к Layout Engine v2.

---

# Success Criteria

PDF Engine считается реализованным, если:

- новые секции добавляются без изменения ядра;
- Layout автоматически адаптируется под контент;
- отсутствуют пустые области;
- документ максимально стремится помещаться на одной странице;
- Renderer отвечает только за отображение своей секции;
- Container отвечает за компоновку;
- Layout Engine отвечает за выбор режима отображения.
