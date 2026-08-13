from pathlib import Path

base = Path('deployments/history-through-cu')
app = base / 'app.js'
s = app.read_text()
old = "${item.side==='cu'?'At CU / Boulder':'Wider history'} · ${dateLabel(item.date)}"
new = "${item.side==='cu'?'At CU / Boulder':'Wider history'} · ${item.displayDate || dateLabel(item.date)}"
if old not in s:
    raise SystemExit('story date expression not found')
s = s.replace(old, new, 1)
old_label = "<span>UMAS</span><span>education</span><span>organising</span><strong>1969</strong>"
new_label = "<span>UMAS</span><span>education</span><span>organising</span><strong>1968–69</strong>"
if old_label not in s:
    raise SystemExit('UMAS object label not found')
s = s.replace(old_label, new_label, 1)
app.write_text(s)

data = base / 'data.js'
s = data.read_text()
replacements = [
("""      id:'charles-biggers', side:'cu', date:'1961-07-03', year:1961.50,
      title:'Charles Biggers returns to CU', kicker:'Norlin Library · July 3, 1961', archetype:'newspaper', importance:3,
      summary:'CU student Charles Biggers, Boulder’s first Freedom Rider, speaks in front of Norlin Library after participating in the rides and spending more than two months in custody.',
      detail:'CU Boulder’s 150th student-life history identifies Charles Biggers as Boulder’s first Freedom Rider. After training with CORE and joining a ride, he was arrested in Jackson, Mississippi, after refusing to leave a whites-only waiting room. The CU history reproduces a Colorado Daily item dated July 3, 1961 and describes his speech at Norlin Library.',""",
"""      id:'charles-biggers', side:'cu', date:'1961-07-03', year:1961.50,
      title:'Charles Biggers returns to CU', kicker:'Norlin Library · July 3, 1961', archetype:'newspaper', importance:3,
      summary:'CU student Charles Biggers, identified by CU Boulder as Boulder’s first Freedom Rider, speaks in front of Norlin Library after participating in the rides and being jailed in Jackson, Mississippi.',
      detail:'CU Boulder’s 150th student-life history identifies Charles Biggers as Boulder’s first Freedom Rider. After training with CORE and joining a ride, he was arrested in Jackson, Mississippi, after refusing to leave a whites-only waiting room. The CU history reproduces a Colorado Daily item dated July 3, 1961 and describes his speech at Norlin Library.',"""),
("""      id:'umas-founded', side:'cu', date:'1969-09-01', year:1969.67,
      title:'UMAS is established', kicker:'CU Boulder · 1969', archetype:'cluster', importance:2,
      summary:'United Mexican American Students forms to recruit and retain Latino and Chicano students and push for institutional change.',
      detail:'CU’s 150th student-life history describes UMAS as a central organisation in Chicano activism on campus, focused on educational support, recruitment, retention, institutional reform and later protests over cuts to Chicano programmes and funding.',""",
"""      id:'umas-founded', side:'cu', date:'1969-01-01', displayDate:'1968–1969', year:1969.00,
      title:'UMAS emerges at CU', kicker:'CU Boulder · 1968–69', archetype:'cluster', importance:2,
      summary:'United Mexican American Students emerges at CU as an organisation for recruitment, retention, educational support and institutional change.',
      detail:'CU sources differ on the date used for UMAS’s founding: the CU Chicanx/Latinx History Collection documents its founding in 1968, while CU’s 150th student-life history says it was established in 1969. Both describe its early work around recruitment, retention, educational support and institutional change.',"""),
("""      sourceName:'CU Boulder 150 — Student Life Through the Decades', sourceUrl:'https://www.colorado.edu/150/cu-boulder-student-life-through-decades'
    },
    {
      id:'black-studies', side:'cu', date:'1969-10-01', year:1969.75,
      title:'Black Studies takes institutional form', kicker:'CU Boulder · late 1960s', archetype:'catalogue', importance:1,
      summary:'Charles Nilon launches and chairs CU’s Black Studies Program during a period of intense Black student organising and institutional pressure.',
      detail:'CU’s 150th historical biographies identify Charles Nilon, the first Black faculty member hired in the English Department, as the founder and chair of the university’s Black Studies Program in the late 1960s.',""",
"""      sourceName:'CU Chicanx/Latinx History Collection', sourceUrl:'https://cudl.colorado.edu/luna/servlet/CUB~24~24'
    },
    {
      id:'black-studies', side:'cu', date:'1969-01-01', displayDate:'1969', year:1969.10,
      title:'Black Studies takes institutional form', kicker:'CU Boulder · 1969', archetype:'catalogue', importance:1,
      summary:'Charles Nilon helps establish and chairs CU’s Black Studies Program during a period of intense Black student organising and institutional pressure.',
      detail:'CU Boulder’s Center for African & African American Studies identifies Charles Nilon, the university’s first Black professor, as playing a foundational role in establishing the Black Studies program in 1969.',"""),
("""      sourceName:'CU Boulder 150 — An Initial List of Notable Buffs', sourceUrl:'https://www.colorado.edu/150/initial-list-notable-buffs'
    },
    {
      id:'bgl', side:'cu', date:'1970-11-01', year:1970.84,""",
"""      sourceName:'CU Boulder CAAAS — Black Studies at CU Boulder and Beyond', sourceUrl:'https://www.colorado.edu/center/caaas/podcast/episodes/episode-32-black-studies-cu-boulder-and-beyond-honoring-dr-charles-nilon-and-mrs'
    },
    {
      id:'bgl', side:'cu', date:'1970-11-01', displayDate:'November 1970', year:1970.84,"""),
("""      id:'los-seis', side:'cu', date:'1974-05-27', year:1974.40,
      title:'Los Seis de Boulder', kicker:'Boulder · May 1974', archetype:'memorial', importance:3,
      summary:'Six Chicano activists — including a CU student, alumni and former staff — die in two car bombings connected to El Movimiento.',
      detail:'CU Libraries describes Los Seis as part of CU Boulder’s rich and complex history and identifies primary sources in Rare and Distinctive Collections, including law-enforcement reports, El Diario de la Gente, and records of United Mexican American Students from 1968–1974.',""",
"""      id:'los-seis', side:'cu', date:'1974-05-27', displayDate:'May 27–29, 1974', year:1974.40,
      title:'Los Seis de Boulder', kicker:'Boulder · May 1974', archetype:'memorial', importance:3,
      summary:'Six activists involved in El Movimiento die in two Boulder car bombings; five had CU affiliations as students, alumni or former employees.',
      detail:'CU Libraries identifies five of the six victims as self-identified Chicano/a and all six as involved in El Movimiento. The circumstances of how the bombs came to be in the cars remain unknown. Rare and Distinctive Collections holds primary sources including law-enforcement reports, El Diario de la Gente, and UMAS records from 1968–1974.',""")
]
for old, new in replacements:
    if old not in s:
        raise SystemExit('expected mirror data block not found: ' + old[:100])
    s = s.replace(old, new, 1)
data.write_text(s)
