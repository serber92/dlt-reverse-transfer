set search_path to tln, public;

CREATE TABLE tln.address (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Address',
    address_country TEXT,
    address_locality TEXT,
    address_region TEXT,
    postal_code TEXT,
    post_office_box_number TEXT,
    street_address TEXT
);

CREATE TABLE tln.endorsement_claim (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'EndorsementClaim',
    endorsement_comment TEXT
);

CREATE TYPE verificationType AS ENUM ('Hosted', 'Signed', 'Verification');

CREATE TABLE tln.verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    type verificationType NOT NULL,
    allowed_origins TEXT [],
    creator TEXT,
    starts_with TEXT [],
    verification_property TEXT
);

CREATE TABLE tln.participant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Participant',
    active BOOLEAN,
    email TEXT,
    ip_address INET [],
    name TEXT,
    owner UUID,
    participant_type TEXT,
    public_key TEXT
);

CREATE TABLE tln.cryptographic_key (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT DEFAULT 'CryptographicKey',
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    owner UUID NOT NULL,
    public_key_pem TEXT NOT NULL,
    CONSTRAINT fk_cryptographic_key_owner FOREIGN KEY(owner) REFERENCES tln.participant(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.endorsement_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'EndorsementProfile',
    address UUID,
    birthdate TEXT,
    description TEXT,
    email TEXT,
    image TEXT,
    name TEXT,
    public_key UUID,
    revocation_list TEXT,
    --not sure how we'll manage signed_endorsements, need a primer on Compact JWS and how that might apply to arrays, and how it get's searched and populated
    source_id TEXT,
    student_id TEXT,
    telephone TEXT,
    url TEXT,
    verification UUID,
    CONSTRAINT fk_endorser_address FOREIGN KEY(address) REFERENCES tln.address(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_endorser_verification FOREIGN KEY(verification) REFERENCES tln.verification(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_endorser_public_key FOREIGN KEY(public_key) REFERENCES tln.cryptographic_key(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.endorsement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Endorsement',
    claim UUID,
    issued_on TIMESTAMPTZ,
    issuer UUID,
    revocation_reason TEXT,
    revoked BOOLEAN,
    verification UUID,
    CONSTRAINT fk_claim FOREIGN KEY(claim) REFERENCES tln.endorsement_claim(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_endorsement_issuer FOREIGN KEY(issuer) REFERENCES tln.endorsement_profile(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_endorsement_verification FOREIGN KEY(verification) REFERENCES tln.verification(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Profile',
    address UUID,
    birthdate TEXT,
    description TEXT,
    email TEXT,
    endorsements UUID [],
    image TEXT,
    name TEXT,
    public_key UUID,
    revocation_list TEXT,
    --not sure how we'll manage signed_endorsements, need a primer on Compact JWS and how that might apply to arrays, and how it get's searched and populated
    signed_endorsements TEXT [],
    source_id TEXT,
    student_id TEXT,
    telephone TEXT,
    url TEXT,
    verification UUID,
    CONSTRAINT fk_address FOREIGN KEY(address) REFERENCES tln.address(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_profile_verification FOREIGN KEY(verification) REFERENCES tln.verification(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_profile_public_key FOREIGN KEY(public_key) REFERENCES tln.cryptographic_key(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.alignment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Alignment',
    framework_name TEXT,
    target_code TEXT,
    target_description TEXT,
    target_name TEXT NOT NULL,
    target_url TEXT NOT NULL
);

CREATE TABLE tln.association (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Association',
    association_type TEXT NOT NULL,
    sequence_number INT,
    target_id UUID NOT NULL
);

CREATE TYPE resultType AS ENUM (
    'CreditHours',
    'GradePointAverage',
    'LetterGrade',
    'Percent',
    'PerformanceLevel',
    'PredictedScore',
    'Result',
    'RawScore',
    'RubricCriterion',
    'RubricCriterionLevel',
    'RubricScore',
    'ScaledScore'
);

CREATE TABLE tln.result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Result',
    result_type resultType NOT NULL,
    alignment TEXT,
    value TEXT NOT NULL
);

CREATE TABLE tln.result_description (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Association',
    alignment TEXT,
    name TEXT,
    result_min TEXT,
    result_max TEXT
);

CREATE TABLE tln.criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT DEFAULT 'Criteria',
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    narrative TEXT
);

drop TYPE IF EXISTS achievementType CASCADE;

CREATE TYPE achievementType AS ENUM (
    'Achievement',
    'Assessment Result',
    'Award',
    'Badge',
    'Certification',
    'Course',
    'Community Service',
    'Competency',
    'Co-Curricular',
    'Degree',
    'Diploma',
    'ExamCredit',
    'Fieldwork',
    'License',
    'Membership',
    'TransferCredit',
    'MissingCredit',
    'TransferDegree',
    'Honors',
    'Major',
    'Minor',
    'ROTC',
    'Certificate',
    'Pre-Professional',
    'Concentration'
);

CREATE TABLE tln.achievement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Achievement',
    achievement_type achievementType NOT NULL,
    alignments UUID [],
    associations UUID [],
    credits_available TEXT,
    description TEXT,
    endorsements UUID [],
    human_code TEXT,
    name TEXT,
    field_of_study TEXT,
    image TEXT,
    issuer UUID NOT NULL,
    level TEXT,
    requirement UUID,
    result_descriptions text [],
    --not sure how we'll manage signed_endorsements, need a primer on Compact JWS and how that might apply to arrays, and how it get's searched and populated
    signed_endorsements TEXT [],
    source_key TEXT,
    specialization TEXT,
    tags TEXT,
    properties TEXT,
    CONSTRAINT fk_achievement_issuer FOREIGN KEY(issuer) REFERENCES tln.profile(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_achievement_requirement FOREIGN KEY(requirement) REFERENCES tln.criteria(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.artifact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Artifact',
    description TEXT,
    name TEXT,
    url TEXT
);

CREATE TABLE tln.evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Evidence',
    artifacts UUID [],
    audience TEXT,
    description TEXT,
    genre TEXT,
    name TEXT,
    narrative TEXT
);

CREATE TABLE tln.assertion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Assertion',
    achievement UUID,
    credits_earned TEXT,
    end_date TIMESTAMPTZ,
    endorsements UUID [],
    evidence UUID [],
    image TEXT,
    issued_on TIMESTAMPTZ,
    license_number TEXT,
    narrative TEXT,
    recipient UUID,
    results UUID [],
    revocation_reason TEXT,
    revoked BOOLEAN,
    role TEXT,
    signed_endorsements TEXT [],
    source UUID,
    start_date TIMESTAMPTZ,
    term TEXT,
    verification UUID,
    CONSTRAINT fk_assertion_achievement FOREIGN KEY(achievement) REFERENCES tln.achievement(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_assertion_source FOREIGN KEY(source) REFERENCES tln.profile(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_assertion_verification FOREIGN KEY(verification) REFERENCES tln.verification(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.clr (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'CLR',
    achievements UUID [],
    assertions UUID [],
    issued_on TIMESTAMPTZ,
    learner UUID,
    name TEXT,
    partial BOOLEAN,
    publisher UUID,
    revocation_reason TEXT,
    revoked BOOLEAN,
    signed_assertions TEXT [],
    verification UUID,
    CONSTRAINT fk_clr_learner FOREIGN KEY(learner) REFERENCES tln.profile(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_clr_publisher FOREIGN KEY(publisher) REFERENCES tln.profile(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_clr_verification FOREIGN KEY(verification) REFERENCES tln.verification(id) ON DELETE
    SET NULL
);

-- ACL
/* CREATE TABLE tln.participant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Participant',
    active BOOLEAN,
    email TEXT,
    ip_address INET [],
    name TEXT,
    owner UUID,
    participant_type TEXT,
    public_key TEXT,
    CONSTRAINT fk_participant_owner FOREIGN KEY(owner) REFERENCES tln.participant(id) ON DELETE
    SET NULL
);
*/

CREATE TABLE tln.identification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'Identification',
    identity_type TEXT,
    owner UUID,
    identity UUID,
    profile UUID,
    CONSTRAINT fk_identification_owner FOREIGN KEY(owner) REFERENCES tln.participant(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_identification_identity FOREIGN KEY(identity) REFERENCES tln.identity(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_identification_profile FOREIGN KEY(profile) REFERENCES tln.profile(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.related_participant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'RelatedParticipant',
    active BOOLEAN,
    owner UUID,
    source_participant UUID,
    related_participant UUID,
    CONSTRAINT fk_related_participant_owner FOREIGN KEY(owner) REFERENCES tln.participant(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_source_participant FOREIGN KEY(source_participant) REFERENCES tln.participant(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_related_participant FOREIGN KEY(related_participant) REFERENCES tln.participant(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.entity_permission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'EntityPermission',
    entity TEXT,
    allow_create BOOLEAN,
    allow_edit BOOLEAN,
    allow_read BOOLEAN,
    active BOOLEAN,
    owner UUID,
    permission_name TEXT,
    CONSTRAINT fk_entity_permission_owner FOREIGN KEY(owner) REFERENCES tln.participant(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.permission_set (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'PermissionSet',
    active BOOLEAN,
    owner UUID,
    permission_name TEXT,
    CONSTRAINT fk_permission_set_owner FOREIGN KEY(owner) REFERENCES tln.participant(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.field_permission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'FieldPermission',
    editable BOOLEAN,
    field_name TEXT,
    entity_permission UUID,
    owner UUID,
    readable BOOLEAN,
    CONSTRAINT fk_entity_permission FOREIGN KEY(entity_permission) REFERENCES tln.entity_permission(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.entity_permission_set (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'EntityPermissionSet',
    entity_permission UUID,
    owner UUID,
    permission_set UUID,
    CONSTRAINT fk_entity_permission FOREIGN KEY(entity_permission) REFERENCES tln.entity_permission(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_entity_permission_set_owner FOREIGN KEY(owner) REFERENCES tln.participant(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_permission_set FOREIGN KEY(permission_set) REFERENCES tln.permission_set(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.record_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'RecordAccess',
    access_level VARCHAR(2),
    owner TEXT,
    participant UUID,
    participant_role VARCHAR(10),
    record UUID,
    status TEXT,
    CONSTRAINT fk_participant FOREIGN KEY(participant) REFERENCES tln.participant(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.record_access_approval (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'RecordAccessApproval',
    is_access_approved BOOLEAN,
    owner UUID,
    participant UUID,
    record_access UUID,
    CONSTRAINT fk_record_access_approval_owner FOREIGN KEY(owner) REFERENCES tln.participant(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_record_access_participant FOREIGN KEY(participant) REFERENCES tln.participant(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_record_access_record FOREIGN KEY(record_access) REFERENCES tln.record_access(id) ON DELETE
    SET NULL
);

CREATE TABLE tln.participant_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL,
    type TEXT DEFAULT 'ParticipantAccess',
    entity_permission UUID,
    owner UUID,
    participant UUID,
    permission_set UUID,
    CONSTRAINT fk_participant_entity_permission FOREIGN KEY(entity_permission) REFERENCES tln.entity_permission(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_participant_access_owner FOREIGN KEY(owner) REFERENCES tln.participant(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_participant_access FOREIGN KEY(participant) REFERENCES tln.participant(id) ON DELETE
    SET NULL,
        CONSTRAINT fk_participant_permission_set FOREIGN KEY(permission_set) REFERENCES tln.permission_set(id) ON DELETE
    SET NULL
);

-- TRIGGERS
CREATE FUNCTION tln.last_updated_Change() RETURNS TRIGGER AS $$ BEGIN RETURN NEW;

END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER achievement_last_updated BEFORE
UPDATE ON tln.achievement FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER address_last_updated BEFORE
UPDATE ON tln.address FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER alignment_last_updated BEFORE
UPDATE ON tln.alignment FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER artifact_last_updated BEFORE
UPDATE ON tln.artifact FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER assertion_last_updated BEFORE
UPDATE ON tln.assertion FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER association_last_updated BEFORE
UPDATE ON tln.association FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER clr_last_updated BEFORE
UPDATE ON tln.clr FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER criteria_last_updated BEFORE
UPDATE ON tln.criteria FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER cryptographickey_last_updated BEFORE
UPDATE ON tln.cryptographic_key FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER endorsement_last_updated BEFORE
UPDATE ON tln.endorsement FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER endorsementclaim_last_updated BEFORE
UPDATE ON tln.endorsement_claim FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER identity_last_updated BEFORE
UPDATE ON tln.identity FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER profile_last_updated BEFORE
UPDATE ON tln.profile FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER result_last_updated BEFORE
UPDATE ON tln.result FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER resultdescription_last_updated BEFORE
UPDATE ON tln.result_description FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();

CREATE TRIGGER verification_last_updated BEFORE
UPDATE ON tln.verification FOR EACH ROW EXECUTE PROCEDURE tln.last_updated_Change();