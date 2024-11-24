Upon creating the database, we set up the tables with test data.

```sql
CREATE TABLE femicides_mexico (
    id INTEGER NOT NULL,
    victim_name VARCHAR(255) NOT NULL,
    missing_date DATE NOT NULL,
    case_location TEXT NOT NULL,
    coordinates VARCHAR(50), -- Store as latitude,longitude
    relationship_with_aggressor VARCHAR(50) NOT NULL CHECK (relationship_with_aggressor IN ('Friend', 'Partner', 'Acquaintance', 'Family', 'Unknown', 'Other')),
    case_status VARCHAR(10) NOT NULL CHECK (case_status IN ('Closed', 'Ongoing')),
    victim_outcome VARCHAR(10) CHECK (victim_outcome IN ('Alive', 'Dead', 'Not Found')),
    summary TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE articles (
    id INTEGER NOT NULL,
    victim_name TEXT NOT NULL,
    title TEXT NOT NULL,
    publication_date DATETIME,
    source VARCHAR(255) NOT NULL,
    body Text NOT NULL,
    PRIMARY KEY (id)
);

-- Insert sample data
INSERT INTO femicides_mexico(victim_name, missingDate, case_location, coordinates, relationship_with_aggressor, case_status, victim_outcome, summary)
VALUES
    ('cse580-test-Maria Lopez', '2024-01-15', 'Guadalajara, Jalisco', '20.6597,-103.3496', 'Partner', 'Closed', 'Dead', 'Maria was reported missing in Guadalajara. Her partner was later arrested in connection with her death.'),
    ('cse580-test-Ana Gutierrez', '2023-12-10', 'Monterrey, Nuevo León', '25.6866,-100.3161', 'Unknown', 'Ongoing', NULL, 'Ana disappeared while heading home from work. No suspects have been identified.'),
    ('cse580-test-Laura Torres', '2023-11-05', 'Cancún, Quintana Roo', '21.1619,-86.8515', 'Friend', 'Closed', 'Alive', 'Laura was found alive after being missing for two weeks, but details of her case remain unclear.');
```