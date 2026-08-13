window.HTCU_DATA = {
  range: { start: 1960, end: 1975, initialYear: 1969 },
  moments: [
    { id:'1961', year:1961.42, title:'Freedom Rides / Charles Biggers' },
    { id:'1969', year:1969.55, title:'Civil rights, liberation and institutional change' },
    { id:'1974', year:1974.50, title:'Watergate / Los Seis de Boulder' }
  ],
  items: [
    {
      id:'freedom-rides', side:'history', date:'1961-05-04', year:1961.34,
      title:'Freedom Riders challenge segregated interstate travel', kicker:'United States · May 1961', archetype:'bus3d', importance:3,
      summary:'An interracial group travels through the Deep South to test whether interstate facilities are complying with federal desegregation rulings.',
      detail:'The first Freedom Riders left Washington, D.C. on May 4, 1961. Riders were attacked in the South, including the firebombing of a Greyhound bus near Anniston, Alabama. The rides drew national attention and helped force federal action against segregation in interstate bus travel.',
      relation:'Wider U.S. history', relationNote:'This is the wider historical event. The CU connection is direct: CU student Charles Biggers joined the Freedom Riders and later returned to speak at Norlin Library.',
      relatedId:'charles-biggers', relatedLabel:'At CU: Charles Biggers returns to Boulder',
      tags:['civil rights','direct action','segregation'],
      sourceName:'National Park Service — Freedom Riders National Monument', sourceUrl:'https://www.nps.gov/places/freedom-riders-national-monument.htm'
    },
    {
      id:'charles-biggers', side:'cu', date:'1961-07-03', year:1961.50,
      title:'Charles Biggers returns to CU', kicker:'Norlin Library · July 3, 1961', archetype:'newspaper', importance:3,
      summary:'CU student Charles Biggers, Boulder’s first Freedom Rider, speaks in front of Norlin Library after participating in the rides and spending more than two months in custody.',
      detail:'CU Boulder’s 150th student-life history identifies Charles Biggers as Boulder’s first Freedom Rider. After training with CORE and joining a ride, he was arrested in Jackson, Mississippi, after refusing to leave a whites-only waiting room. The CU history reproduces a Colorado Daily item dated July 3, 1961 and describes his speech at Norlin Library.',
      relation:'Direct participation in the wider event', relationNote:'This is not merely a parallel CU event. A CU student directly entered the national Freedom Rider history and then brought that experience back to campus.',
      relatedId:'freedom-rides', relatedLabel:'In wider history: the Freedom Rides',
      tags:['civil rights','Freedom Riders','student activism'],
      sourceName:'CU Boulder 150 — Student Life Through the Decades', sourceUrl:'https://www.colorado.edu/150/cu-boulder-student-life-through-decades'
    },
    {
      id:'hayakawa', side:'cu', date:'1969-03-03', year:1969.17,
      title:'Hayakawa confrontation at Macky', kicker:'Macky Auditorium · March 1969', archetype:'poster', importance:2,
      summary:'Hundreds gather when S. I. Hayakawa speaks at Macky; the event escalates into a confrontation amid national struggles over race, student power and campus politics.',
      detail:'CU sources describe a large protest at Macky Auditorium during a lecture by San Francisco State president S. I. Hayakawa. The Coloradan’s retrospective places the event within a period of Black student organising and civil-rights activism on campus.',
      relation:'Contemporaneous campus political conflict', relationNote:'The confrontation belongs to the same national period of student power, racial conflict and institutional transformation, without being reducible to one outside event.',
      relatedId:'stonewall', relatedLabel:'In wider history: Stonewall later that year',
      tags:['student activism','race','campus politics'],
      sourceName:'CU Coloradan — A Change is Gonna Come', sourceUrl:'https://www.colorado.edu/coloradan/2010/09/01/change-gonna-come'
    },
    {
      id:'stonewall', side:'history', date:'1969-06-28', year:1969.49,
      title:'Stonewall uprising', kicker:'New York City · June 1969', archetype:'signal', importance:3,
      summary:'A police raid on the Stonewall Inn sparks several nights of resistance and becomes a milestone in the modern movement for gay and lesbian civil rights.',
      detail:'The National Park Service describes the June 28, 1969 Stonewall uprising as a catalyst for a nationwide movement for equal rights regardless of sexual orientation or identity.',
      relation:'Wider U.S. history', relationNote:'The prototype follows the movement’s subsequent local institutional life by showing Boulder Gay Liberation forming the following year and later receiving CU student-government support.',
      relatedId:'bgl', relatedLabel:'At CU/Boulder: Boulder Gay Liberation forms',
      tags:['LGBTQ+','civil rights','policing'],
      sourceName:'National Park Service — Stonewall National Monument', sourceUrl:'https://www.nps.gov/ston/learn/index.htm'
    },
    {
      id:'apollo11', side:'history', date:'1969-07-20', year:1969.55,
      title:'Apollo 11 lands on the Moon', kicker:'July 1969', archetype:'moon', importance:1,
      summary:'Neil Armstrong and Buzz Aldrin land in the Sea of Tranquility while Michael Collins remains in lunar orbit.',
      detail:'Apollo 11 launched July 16, 1969. Armstrong and Aldrin landed on July 20, completing the first crewed lunar landing. NASA estimates that roughly 650 million people watched Armstrong’s televised first step.',
      relation:'Wider world / U.S. history', relationNote:'At close zoom, the timeline allows scientific, political and cultural histories to coexist rather than selecting one representative story for a year.',
      relatedId:'umas-founded', relatedLabel:'At CU: UMAS takes institutional form',
      tags:['science','space','media'],
      sourceName:'NASA — Apollo 11 Mission Overview', sourceUrl:'https://www.nasa.gov/history/apollo-11-mission-overview/'
    },
    {
      id:'umas-founded', side:'cu', date:'1969-09-01', year:1969.67,
      title:'UMAS is established', kicker:'CU Boulder · 1969', archetype:'cluster', importance:2,
      summary:'United Mexican American Students forms to recruit and retain Latino and Chicano students and push for institutional change.',
      detail:'CU’s 150th student-life history describes UMAS as a central organisation in Chicano activism on campus, focused on educational support, recruitment, retention, institutional reform and later protests over cuts to Chicano programmes and funding.',
      relation:'Contemporaneous campus organising', relationNote:'UMAS is part of the same historical field of civil-rights struggle and institutional transformation. The timeline does not force it into a causal relation with a single national event.',
      relatedId:'stonewall', relatedLabel:'In wider history: another 1969 liberation movement',
      tags:['Chicano movement','student activism','education'],
      sourceName:'CU Boulder 150 — Student Life Through the Decades', sourceUrl:'https://www.colorado.edu/150/cu-boulder-student-life-through-decades'
    },
    {
      id:'black-studies', side:'cu', date:'1969-10-01', year:1969.75,
      title:'Black Studies takes institutional form', kicker:'CU Boulder · late 1960s', archetype:'catalogue', importance:1,
      summary:'Charles Nilon launches and chairs CU’s Black Studies Program during a period of intense Black student organising and institutional pressure.',
      detail:'CU’s 150th historical biographies identify Charles Nilon, the first Black faculty member hired in the English Department, as the founder and chair of the university’s Black Studies Program in the late 1960s.',
      relation:'Institutional change during the same historical period', relationNote:'At close scale, institutional changes such as curriculum become visible alongside protests, public events and wider political history.',
      relatedId:'hayakawa', relatedLabel:'At CU: the Macky confrontation months earlier',
      tags:['Black Studies','curriculum','civil rights'],
      sourceName:'CU Boulder 150 — An Initial List of Notable Buffs', sourceUrl:'https://www.colorado.edu/150/initial-list-notable-buffs'
    },
    {
      id:'bgl', side:'cu', date:'1970-11-01', year:1970.84,
      title:'Boulder Gay Liberation forms', kicker:'Boulder / CU · 1970–71', archetype:'pamphlet', importance:3,
      summary:'Boulder Gay Liberation begins meeting in 1970; by 1971 it receives CU student-government funding and has an office in the UMC.',
      detail:'CU’s 150th student-life history explicitly connects the national movement catalysed by Stonewall to the formation of Boulder Gay Liberation. Its UMC office served as a drop-in centre and housed a major collection of gay publications while the group organised political and social activities.',
      relation:'Movement transmission and local organisation', relationNote:'Here the archive supports a historical relation across scales: a national movement catalysed by Stonewall takes local organisational form in Boulder and at CU.',
      relatedId:'stonewall', relatedLabel:'In wider history: Stonewall',
      tags:['LGBTQ+','student activism','Stonewall'],
      sourceName:'CU Boulder 150 — Student Life Through the Decades', sourceUrl:'https://www.colorado.edu/150/cu-boulder-student-life-through-decades'
    },
    {
      id:'los-seis', side:'cu', date:'1974-05-27', year:1974.40,
      title:'Los Seis de Boulder', kicker:'Boulder · May 1974', archetype:'memorial', importance:3,
      summary:'Six Chicano activists — including a CU student, alumni and former staff — die in two car bombings connected to El Movimiento.',
      detail:'CU Libraries describes Los Seis as part of CU Boulder’s rich and complex history and identifies primary sources in Rare and Distinctive Collections, including law-enforcement reports, El Diario de la Gente, and records of United Mexican American Students from 1968–1974.',
      relation:'Contemporaneous CU/Boulder political struggle; not causally linked to Watergate', relationNote:'This pairing is intentionally non-causal. Los Seis and Watergate occupy the same national year while belonging to different political histories. The interface makes that simultaneity visible without manufacturing a connection.',
      relatedId:'nixon-resigns', relatedLabel:'In wider history: Nixon resigns months later',
      tags:['Chicano movement','Los Seis','archives'],
      sourceName:'CU Boulder University Libraries — Remembering Los Seis', sourceUrl:'https://libraries.colorado.edu/2024/05/13/remembering-los-seis-de-boulder-through-education-and-preservation'
    },
    {
      id:'nixon-resigns', side:'history', date:'1974-08-09', year:1974.60,
      title:'Nixon resigns the presidency', kicker:'Washington, D.C. · August 1974', archetype:'document', importance:3,
      summary:'After two years of Watergate revelations and under threat of impeachment, Richard Nixon becomes the first U.S. president to resign.',
      detail:'The National Archives describes Watergate as a constitutional crisis that tested the rule of law. Nixon’s resignation took effect on August 9, 1974.',
      relation:'Wider U.S. history', relationNote:'The prototype deliberately places this constitutional crisis in the same year as Los Seis without implying that the two histories caused or explain one another.',
      relatedId:'los-seis', relatedLabel:'At CU/Boulder: Los Seis de Boulder',
      tags:['Watergate','government','constitutional crisis'],
      sourceName:'National Archives — Nixon and Watergate', sourceUrl:'https://www.archives.gov/exhibits/american_originals/nixon.html'
    }
  ]
};
