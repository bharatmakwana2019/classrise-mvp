# PostgreSQL schema plan

## Core tables

- `institutes`: tenant identity, name, slug, status, timestamps.
- `users`: global identity, email, display name, status, timestamps.
- `memberships`: `institute_id`, `user_id`, role (`admin|teacher|student|parent`), status; unique per institute/user.
- `students`: tenant-scoped student profile and admission metadata.
- `parent_student`: guardian-to-student relationship.
- `classes`: tenant-scoped class/section and standard (`8|9|10`).
- `class_members`: student enrollment in a class and academic year.
- `subjects`: tenant-scoped subject catalog.
- `teacher_assignments`: teacher-to-class/subject assignment.
- `attendance`: one row per student/date/class with status and audit fields.
- `assessments`, `assessment_results`: tests and student marks.
- `announcements`: tenant/class-targeted messages.
- `audit_events`: actor, tenant, action, entity, metadata, timestamp.

## Invariants

Every tenant-owned table has a non-null `institute_id`, composite foreign keys prevent cross-tenant links, and unique constraints include `institute_id` where names/slugs are tenant-local. Sensitive actions write to `audit_events`.

## Demo seed

Create institute `XYZ Classes`, standards 8, 9, 10, 95 synthetic student records, four role examples, and no real personal data.
