Upon creating the database, we set up the tables with test data.

```sql
CREATE TABLE FemicidesMexico (
    VictimName VARCHAR(255) NOT NULL,
    MissingDate DATE NOT NULL,
    Location TEXT NOT NULL,
    Coordinates VARCHAR(50), -- Store as latitude,longitude
    RelationshipWithAggressor VARCHAR(50) NOT NULL CHECK (RelationshipWithAggressor IN ('Friend', 'Partner', 'Acquaintance', 'Family', 'Unknown', 'Other')),
    CaseStatus VARCHAR(10) NOT NULL CHECK (CaseStatus IN ('Closed', 'Ongoing')),
    VictimOutcome VARCHAR(10) CHECK (VictimOutcome IN ('Alive', 'Dead', 'Not Found')),
    Summary TEXT,
    PRIMARY KEY (VictimName, MissingDate)
);

-- Insert sample data
INSERT INTO FemicidesMexico (VictimName, MissingDate, Location, Coordinates, RelationshipWithAggressor, CaseStatus, VictimOutcome, Summary)
VALUES
    ('cse580-test-Maria Lopez', '2024-01-15', 'Guadalajara, Jalisco', '20.6597,-103.3496', 'Partner', 'Closed', 'Dead', 'Maria was reported missing in Guadalajara. Her partner was later arrested in connection with her death.'),
    ('cse580-test-Ana Gutierrez', '2023-12-10', 'Monterrey, Nuevo León', '25.6866,-100.3161', 'Unknown', 'Ongoing', NULL, 'Ana disappeared while heading home from work. No suspects have been identified.'),
    ('cse580-test-Laura Torres', '2023-11-05', 'Cancún, Quintana Roo', '21.1619,-86.8515', 'Friend', 'Closed', 'Alive', 'Laura was found alive after being missing for two weeks, but details of her case remain unclear.');
```