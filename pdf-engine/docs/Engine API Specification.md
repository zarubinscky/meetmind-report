# MeetMind PDF Engine
## Engine API Specification

Version: 1.0  
Status: Frozen  
Scope: PDF Engine Implementation  

---

# Purpose

This document defines the canonical API contracts between PDF Engine modules.

It freezes how data moves through the engine during implementation.

No module may depend on another module's internal logic.

Each module consumes one defined input and produces one defined output.


# Engine Architecture

The MeetMind PDF Engine is a pipeline of independent modules.

Each module has one responsibility.

Modules communicate only through immutable data contracts.

The execution order is fixed.

```
Report Data
      │
      ▼
Block Registry
      │
      ▼
Geometry Solver
      │
      ▼
Layout Search Engine
      │
      ▼
Geometry Generator
      │
      ▼
Density Engine
      │
      ▼
Overflow Engine
      │
      ▼
Renderer
      │
      ▼
PDF
```

No module performs work assigned to another module.

Responsibilities never overlap.


# Canonical Pipeline

## Stage 1

Input

Meeting Report JSON

Output

Normalized Blocks

Module

Block Registry

---

## Stage 2

Input

Normalized Blocks

Output

Weighted Blocks

Module

Geometry Solver

---

## Stage 3

Input

Weighted Blocks

Output

Candidate Layouts

Module

Layout Search Engine

---

## Stage 4

Input

Selected Layout

Output

Absolute Geometry

Module

Geometry Generator

---

## Stage 5

Input

Geometry

Output

Density Adjustments

Module

Density Engine

---

## Stage 6

Input

Adjusted Geometry

Output

Overflow Resolution

Module

Overflow Engine

---

## Stage 7

Input

Final Geometry

Output

HTML

Module

Renderer

---

## Stage 8

Input

HTML

Output

PDF

Module

PDF Engine



# Module API Contracts

---

## Block Registry

Input

Meeting Report JSON

Output

Array<Block>

Responsibility

Creates normalized semantic blocks.

Never computes layout.

Never computes geometry.

---

## Geometry Solver

Input

Array<Block>

Output

WeightedBlock[]

Responsibilities

• calculate content weight

• calculate visual weight

• split findings

• preserve reading order

Never creates layouts.

Never evaluates density.

---

## Layout Search Engine

Input

WeightedBlock[]

Output

LayoutCandidate[]

Responsibilities

Generate layout candidates.

Evaluate candidates.

Score candidates.

Select best candidate.

Never computes coordinates.

---

## Geometry Generator

Input

Selected Layout Candidate

Output

Geometry

Responsibilities

Generate absolute positions.

Generate x/y coordinates.

Generate widths.

Generate heights.

Never changes layout.

Never evaluates candidates.

---

## Density Engine

Input

Geometry

Output

Optimized Geometry

Responsibilities

Compact whitespace.

Improve density.

Maintain readability.

Never changes semantic order.

---

## Overflow Engine

Input

Optimized Geometry

Output

Final Geometry

Responsibilities

Move content to next page.

Split blocks.

Create appendix pages.

Never changes semantic meaning.

---

## Renderer

Input

Final Geometry

Output

HTML

Responsibilities

Render HTML.

Apply Design Tokens.

Apply Typography.

Apply Colors.

No layout decisions.

No geometry calculations.

---

## PDF Engine

Input

HTML

Output

PDF

Responsibilities

Generate PDF.

Apply page numbering.

Apply metadata.

Nothing else.



# Engine Execution Example

The following example illustrates one complete execution of the PDF Engine.

This example is normative.

The execution order may never change.

---

## Input

Meeting Report JSON

↓

## Block Registry

Creates semantic blocks.

↓

Output

Array<Block>

↓

## Geometry Solver

Calculates block weights.

Determines reading priorities.

Groups strategic findings.

↓

Output

Weighted Blocks

↓

## Layout Search Engine

Generates multiple valid layout candidates.

Evaluates every candidate.

Calculates density score.

Calculates balance score.

Calculates whitespace score.

Selects the highest scoring layout.

↓

Output

Selected Layout Candidate

↓

## Geometry Generator

Generates absolute coordinates.

Computes block widths.

Computes block heights.

Computes x/y positions.

↓

Output

Geometry

↓

## Density Engine

Compacts geometry.

Optimizes spacing.

Improves information density.

↓

Output

Optimized Geometry

↓

## Overflow Engine

Checks page limits.

Moves overflowing blocks.

Creates continuation pages.

Creates appendix pages when required.

↓

Output

Final Geometry

↓

## Renderer

Generates HTML.

Applies typography.

Applies Design Tokens.

Applies semantic colors.

↓

Output

HTML

↓

## PDF Engine

Creates final PDF document.

Adds metadata.

Adds page numbers.

Applies footer policy.

↓

Final PDF


# Execution Example

Example execution of one meeting report.

Meeting Report JSON

↓

Block Registry

↓

Geometry Solver

↓

Layout Search Engine

↓

Geometry Generator

↓

Density Engine

↓

Overflow Engine

↓

Renderer

↓

PDF

---

Data Flow

Meeting JSON

↓

Semantic Blocks

↓

Weighted Blocks

↓

Layout Candidates

↓

Selected Layout

↓

Absolute Geometry

↓

Optimized Geometry

↓

Final Geometry

↓

HTML

↓

PDF



# Design Freeze

MeetMind PDF Engine API Specification v1.0 is considered FROZEN.

This document defines the canonical communication contracts between all engine modules.

Future modifications are allowed only if triggered by:

- implementation feedback;
- benchmark failures;
- production issues;
- approved product evolution.

Module responsibilities defined in this document may not overlap.

Execution order is immutable.

API contracts are canonical.

Version

1.0

Status

FROZEN
