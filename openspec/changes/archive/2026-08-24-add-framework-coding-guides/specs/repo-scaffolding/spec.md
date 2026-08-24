## ADDED Requirements

### Requirement: Framework-owned coding guides
A framework directory's coding guide, where one exists, SHALL be owned exclusively by that directory. Other framework directories SHALL NOT inherit, reference, or defer to another framework directory's coding guide; each framework directory that wants one maintains its own.

#### Scenario: Adding a coding guide to a new framework directory
- **WHEN** a team member adds a coding guide for a new framework directory (e.g. `cypress-ts/`)
- **THEN** the guide is written from scratch for that directory's own conventions and does not point to or copy another framework directory's guide as its source of truth

#### Scenario: A framework directory has no coding guide yet
- **WHEN** a framework directory does not yet have its own coding guide
- **THEN** contributors follow that directory's existing code conventions and repo-wide conventions only, and are not expected to follow another framework directory's coding guide
