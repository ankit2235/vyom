# Literature prototype backend

This isolated Python package implements milestone 1 from `../system-design.md`:
fetch public records from PubMed and Europe PMC, preserve each source payload,
deduplicate canonical articles, and store them in Postgres.

## Setup

Use Python 3.11 or newer. Apply `migrations/001_initial_schema.sql` to the
prototype's Supabase Postgres database, then install this package:

```sh
python -m pip install -e '.[test]'
```

Set `DATABASE_URL` to the Supabase Postgres connection string. PubMed strategies
also require `NCBI_TOOL` and `NCBI_EMAIL`; `NCBI_API_KEY` is optional. These
values belong in local environment variables or GitHub Actions secrets, never
in source control. For local development, copy `.env.example` to `.env` and put
the rotated database URL there. The `.env` file is ignored by git. URL-encode
reserved characters in the database password before placing it in the URL.

Add a `search_strategies` row for each molecule and source before running the
fetcher. The query is frozen by molecule, source, and version; only active rows
are fetched.

```sh
vyom-fetch --from-date 2026-10-13 --to-date 2026-10-14
```

Dates default to yesterday through today. Re-running a range is idempotent by
source identifier. Each source response is retained in `source_records.raw`;
the article key prefers DOI, then PMID, then title, first-author surname, and
publication year.

Run the offline checks with:

```sh
python -m pytest
```

Only public literature belongs in this prototype. Do not put patient, customer,
or partner data in this database.