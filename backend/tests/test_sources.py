from vyom_literature.sources import parse_europepmc_results, parse_pubmed_xml


def test_parse_pubmed_xml_preserves_record_and_normalizes_fields():
    payload = b"""<PubmedArticleSet><PubmedArticle>
      <MedlineCitation><PMID>12345</PMID><Article>
        <Journal><JournalIssue><PubDate><Year>2024</Year><Month>Jan</Month><Day>3</Day></PubDate></JournalIssue><Title>Journal</Title></Journal>
        <ArticleTitle>Example <i>title</i></ArticleTitle>
        <Abstract><AbstractText>First sentence.</AbstractText><AbstractText Label="RESULTS">Second sentence.</AbstractText></Abstract>
        <AuthorList><Author><LastName>Smith</LastName><Initials>J</Initials></Author></AuthorList>
        <ELocationID EIdType="doi">10.1000/example</ELocationID>
      </Article></MedlineCitation><PubmedData><ArticleIdList><ArticleId IdType="doi">10.1000/example</ArticleId></ArticleIdList></PubmedData>
    </PubmedArticle></PubmedArticleSet>"""

    [record] = parse_pubmed_xml(payload)

    assert record.source_uid == "12345"
    assert record.title == "Example title"
    assert record.abstract == "First sentence.\nSecond sentence."
    assert record.pub_date.isoformat() == "2024-01-03"
    assert record.doi == "10.1000/example"
    assert record.authors == [{"surname": "Smith", "initials": "J"}]
    assert "<PubmedArticle>" in record.raw["xml"]


def test_parse_europepmc_keeps_partial_date_as_year_only():
    [record] = parse_europepmc_results(
        {
            "resultList": {
                "result": [
                    {
                        "id": "MED/12345",
                        "pmid": "12345",
                        "title": "  Example\n title ",
                        "pubYear": "2022",
                        "authorString": "Smith J, Jones A",
                        "abstractText": "Abstract text",
                    }
                ]
            }
        }
    )

    assert record.title == "Example title"
    assert record.pub_date is None
    assert record.publication_year == 2022
    assert record.pmid == "12345"
    assert len(record.authors) == 2
    assert record.authors[0]["surname"] == "Smith"