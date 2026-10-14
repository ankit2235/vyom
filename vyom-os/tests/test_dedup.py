from datetime import date

import pytest

from vyom_literature.dedup import make_dedup_key, normalize_doi, normalize_pmid


def test_doi_is_first_dedup_key_and_normalized():
    assert normalize_doi(" HTTPS://DOI.ORG/10.1000/ABC. ") == "10.1000/abc"
    assert make_dedup_key(
        doi="https://doi.org/10.1000/ABC",
        pmid="12345",
        title="A paper",
        first_author="Smith J",
        pub_date=date(2024, 1, 1),
    ) == "doi:10.1000/abc"


def test_pmid_is_used_when_doi_is_missing():
    assert normalize_pmid("PMID: 001234") == "001234"
    assert make_dedup_key(
        doi=None,
        pmid="12345",
        title="A paper",
        first_author="Smith J",
        pub_date=date(2024, 1, 1),
    ) == "pmid:12345"


def test_fuzzy_key_uses_title_author_and_publication_year():
    assert make_dedup_key(
        doi=None,
        pmid=None,
        title="A Rare, Serious Reaction!",
        first_author="Smith, Jane",
        pub_date=date(2024, 5, 1),
    ) == "fuzzy:a-rare-serious-reaction:smith:2024"


def test_fuzzy_key_requires_all_fallback_fields():
    with pytest.raises(ValueError, match="title, first author, and year"):
        make_dedup_key(
            doi=None,
            pmid=None,
            title="A paper",
            first_author=None,
            pub_date=date(2024, 1, 1),
        )