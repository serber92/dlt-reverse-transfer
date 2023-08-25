set search_path to tln, public;

--  SAMPLE DATA
insert into participant (
        created_by,
        active,
        email,
        ip_address,
        name,
        participant_type
    )
values (
        'Init',
        true,
        'rdavies3@asu.edu',
        '{24.9.29.185}',
        'Roger Davies',
        'admin'
    );

update participant
set owner = (
        select id
        from participant
    );

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'ASU is a comprehensive public research university, measured not by whom we exclude, but rather by whom we include and how they succeed, advancing research and discovery of public value, and assuming fundamental responsibility for the economic, social, cultural and overall health of the communities it serves.',
    'registrar@asu.edu',
    'Arizona State University',
    '001081',
    '480.965.3124​',
    'https://www.asu.edu'
from participant;

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'Welcome to Chandler-Gilbert Community College, where connecting to the communities we serve is reflected in our vision, mission, and values as an educational entity.',
    'admissionsandrecords@cgc.edu',
    'Chandler-Gilbert Community College',
    '029402',
    '480.732.7320​',
    'https://www.cgc.edu'
from participant;

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'Estrella Mountain Community College (EMCC) is one of ten Maricopa Community Colleges (MCCCD) and is the newest in the District. MCCCD is one of the largest and oldest community college districts in the United States.',
    NULL,
    'Estrella Mountain Community College',
    '029426',
    '623.935.8000',
    'https://www.estrellamountain.edu'
from participant;

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'GateWay Community College has built a legacy of innovation, pioneering vision and responsiveness to the needs of our community: the first technical college in Arizona, first to use community advisory committees, first to tailor courses to the needs of business and industry, first to offer classes at off-campus locations, even the first to install a computer. From a humble beginning in the former Korricks Department Store downtown, Maricopa Technical College has flourished for 50 years into todays GateWay.',
    NULL,
    'GateWay Community College',
    '008303',
    '602.286.8000',
    'https://www.gatewaycc.edu'
from participant;

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'Education has the power to inspire growth and change lives. Since 1965 Glendale Community College has welcomed over 500,000 students as they worked towards graduating with two-year degrees, transferring to a university, completing new career training, or finishing an occupational certificate.',
    NULL,
    'Glendale Community College',
    '001076',
    '623.845.3000',
    'https://www2.gccaz.edu'
from participant;

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'Pursuing an education can change a student’s life in ways they could never imagine.  In addition to obtaining a certificate or degree, our MCC students gain the knowledge and skills needed to enter the workforce or transfer to a college or university. Our faculty instruct students in a way that allows them to learn how to learn, engage in critical thinking, and teach content students need to succeed. By coming to MCC students are investing in their future, and we are dedicated to helping them on their journey.',
    NULL,
    'Mesa Community College',
    '001077',
    '480.461.7000',
    'https://www.mesacc.edu'
from participant;

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'When you choose Paradise Valley Community College, you are choosing excellence in higher education.',
    NULL,
    'Paradise Valley Community College',
    '029401',
    '602.787.7862',
    'https://www.paradisevalley.edu'
from participant;

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'With over 150 degree and certificate programs, Phoenix College serves approximately 17,000 students like you each year. We work hard to prepare you for whatever your next step is — university transfer, career training and advancement, or lifelong learning.',
    NULL,
    'Phoenix College',
    '001078',
    '602.285.7777',
    'https://www.phoenixcollege.edu'
from participant;

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'Established in 1978, Rio Salado College is dedicated to providing innovative educational opportunities to meet the needs of today’s students. Rio Salado offers affordable access to higher education through college bridge pathways, community-based learning, corporate and government partnerships, early college initiatives, online learning and university transfer.',
    NULL,
    'Rio Salado College',
    '029243',
    '480.517.8000',
    'http://www.riosalado.edu'
from participant;

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'Scottsdale Community College is student centered, with a focus on active, engaged and intellectually rigorous learning. The college is known for high quality, accessible educational opportunities and innovative teaching, learning and support services. SCC serves approximately 10,000 students a year, offering more than 100 degrees and 60 certificates of completion in diverse occupational areas. SCC is a leader in Developmental Education, Open Education Resources, Undergraduate Research, and Service Learning, all designed to improve and facilitate student success.',
    NULL,
    'Scottsdale Community College',
    '008304',
    '480.423.6000',
    'https://www.scottsdalecc.edu'
from participant;

insert into profile(
        created_by,
        description,
        email,
        name,
        source_Id,
        telephone,
        url
    )
select id,
    'South Mountain Community College (SMCC) reflects the diversity of the surrounding community, a rich mix of rural, urban, and suburban neighborhoods. Many of our students arrive from Phoenix, Laveen, Tempe, Guadalupe and the surrounding area to attend classes at the main campus or our offsite facility in Guadalupe, we also offer evening courses in Laveen at Betty Fairfax High School.',
    NULL,
    'South Mountain Community College',
    '029242',
    '602.243.8000',
    'https://www.southmountaincc.edu'
from participant;