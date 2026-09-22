import { Drug, DrugInteraction } from "./types";

/**
 * DEMO DATA NOTICE
 * ------------------------------------------------------------------
 * Every record in this file is illustrative demo content for the
 * MediSync AI prototype. Drug identifiers use a synthetic "DEMO-####"
 * scheme, NOT real RxNorm RxCUIs — a production build would resolve
 * these through the live RxNorm API (see docs/API_SPEC.md).
 *
 * The interaction pairs describe real, textbook-level pharmacology
 * (the kind found in standard clinical references) so the demo reads
 * as credible, but the evidence entries are paraphrased summaries
 * written for this prototype, not live citations pulled from FDA
 * labels or PubMed. Do not use this dataset for real clinical
 * decisions. See docs/LIMITATIONS.md.
 */

export const demoDataDisclaimer =
  "Demo data: illustrative drug interaction content for prototype purposes only. Not a substitute for a licensed clinical reference.";

export const drugs: Drug[] = [
  { rxcui: "DEMO-0001", name: "Warfarin", genericName: "warfarin sodium", drugClass: "Vitamin K antagonist anticoagulant", route: "oral" },
  { rxcui: "DEMO-0002", name: "Aspirin", genericName: "acetylsalicylic acid", drugClass: "NSAID / antiplatelet", route: "oral" },
  { rxcui: "DEMO-0003", name: "Simvastatin", genericName: "simvastatin", drugClass: "HMG-CoA reductase inhibitor (statin)", route: "oral" },
  { rxcui: "DEMO-0004", name: "Clarithromycin", genericName: "clarithromycin", drugClass: "Macrolide antibiotic", route: "oral" },
  { rxcui: "DEMO-0005", name: "Sertraline", genericName: "sertraline HCl", drugClass: "SSRI antidepressant", route: "oral" },
  { rxcui: "DEMO-0006", name: "Tramadol", genericName: "tramadol HCl", drugClass: "Opioid analgesic", route: "oral" },
  { rxcui: "DEMO-0007", name: "Lisinopril", genericName: "lisinopril", drugClass: "ACE inhibitor", route: "oral" },
  { rxcui: "DEMO-0008", name: "Spironolactone", genericName: "spironolactone", drugClass: "Potassium-sparing diuretic", route: "oral" },
  { rxcui: "DEMO-0009", name: "Digoxin", genericName: "digoxin", drugClass: "Cardiac glycoside", route: "oral" },
  { rxcui: "DEMO-0010", name: "Amiodarone", genericName: "amiodarone HCl", drugClass: "Class III antiarrhythmic", route: "oral" },
  { rxcui: "DEMO-0011", name: "Sildenafil", genericName: "sildenafil citrate", drugClass: "PDE5 inhibitor", route: "oral" },
  { rxcui: "DEMO-0012", name: "Isosorbide Mononitrate", genericName: "isosorbide mononitrate", drugClass: "Nitrate vasodilator", route: "oral" },
  { rxcui: "DEMO-0013", name: "Clopidogrel", genericName: "clopidogrel bisulfate", drugClass: "P2Y12 antiplatelet", route: "oral" },
  { rxcui: "DEMO-0014", name: "Omeprazole", genericName: "omeprazole", drugClass: "Proton pump inhibitor", route: "oral" },
  { rxcui: "DEMO-0015", name: "Lithium", genericName: "lithium carbonate", drugClass: "Mood stabilizer", route: "oral" },
  { rxcui: "DEMO-0016", name: "Ibuprofen", genericName: "ibuprofen", drugClass: "NSAID", route: "oral" },
  { rxcui: "DEMO-0017", name: "Fluconazole", genericName: "fluconazole", drugClass: "Azole antifungal", route: "oral" },
  { rxcui: "DEMO-0018", name: "Metformin", genericName: "metformin HCl", drugClass: "Biguanide antidiabetic", route: "oral" },
];

export const drugById = (rxcui: string): Drug | undefined =>
  drugs.find((d) => d.rxcui === rxcui);

export const interactions: DrugInteraction[] = [
  {
    id: "int-001",
    drugA: "DEMO-0001",
    drugB: "DEMO-0002",
    severity: "major",
    mechanism: "Additive antihemostatic effect: anticoagulation (vitamin K antagonism) combined with antiplatelet activity.",
    clinicalEffect: "Substantially increased risk of major and gastrointestinal bleeding.",
    recommendation: "Avoid combination when possible. If concurrent use is clinically necessary, use the lowest effective aspirin dose and monitor INR and for bleeding signs closely.",
    evidence: [
      { sourceType: "FDA Label", summary: "Warfarin labeling lists concomitant antiplatelet agents as a major bleeding risk factor requiring closer INR monitoring.", strength: "Established" },
      { sourceType: "Clinical Pharmacology Reference", summary: "Combined anticoagulant/antiplatelet therapy is a well-documented cause of increased bleeding events in cohort studies.", strength: "Established" },
    ],
    alternatives: ["Consider acetaminophen for analgesia instead of aspirin if used for pain rather than cardioprotection."],
  },
  {
    id: "int-002",
    drugA: "DEMO-0001",
    drugB: "DEMO-0017",
    severity: "major",
    mechanism: "Fluconazole inhibits CYP2C9, the primary enzyme responsible for metabolizing the more potent S-warfarin enantiomer.",
    clinicalEffect: "Significant rise in INR and bleeding risk within days of starting fluconazole.",
    recommendation: "Avoid combination if an alternative antifungal exists. If unavoidable, reduce warfarin dose empirically and monitor INR every 2-3 days during co-therapy.",
    evidence: [
      { sourceType: "FDA Label", summary: "Fluconazole prescribing information specifically warns of a clinically significant increase in prothrombin time with warfarin.", strength: "Established" },
    ],
  },
  {
    id: "int-003",
    drugA: "DEMO-0001",
    drugB: "DEMO-0016",
    severity: "major",
    mechanism: "NSAID-induced gastric mucosal injury and platelet inhibition add to warfarin's anticoagulant effect.",
    clinicalEffect: "Increased risk of gastrointestinal bleeding, in some cases severe.",
    recommendation: "Avoid chronic co-administration. Prefer acetaminophen for pain control; if an NSAID is essential, add gastroprotection and monitor closely.",
    evidence: [
      { sourceType: "Clinical Pharmacology Reference", summary: "NSAID plus warfarin combinations show consistently elevated GI bleeding rates across observational studies.", strength: "Established" },
    ],
    alternatives: ["Acetaminophen (paracetamol) is generally preferred for pain relief in patients on warfarin."],
  },
  {
    id: "int-004",
    drugA: "DEMO-0001",
    drugB: "DEMO-0004",
    severity: "moderate",
    mechanism: "Clarithromycin moderately inhibits CYP3A4 and may enhance warfarin's anticoagulant effect via a secondary pathway.",
    clinicalEffect: "Modest but clinically relevant increase in INR reported during co-therapy.",
    recommendation: "Monitor INR more frequently while clarithromycin is co-administered and for several days after it is stopped.",
    evidence: [
      { sourceType: "Case Reports", summary: "Multiple published case reports describe INR elevation temporally associated with clarithromycin courses in warfarinized patients.", strength: "Probable" },
    ],
  },
  {
    id: "int-005",
    drugA: "DEMO-0003",
    drugB: "DEMO-0004",
    severity: "contraindicated",
    mechanism: "Clarithromycin is a strong CYP3A4 inhibitor; simvastatin is extensively metabolized by CYP3A4, so plasma simvastatin concentration rises sharply.",
    clinicalEffect: "Markedly increased risk of severe myopathy and rhabdomyolysis.",
    recommendation: "Do not co-prescribe. Suspend simvastatin for the duration of clarithromycin therapy or substitute a statin that is not CYP3A4-dependent (e.g. rosuvastatin, pravastatin).",
    evidence: [
      { sourceType: "FDA Label", summary: "Simvastatin labeling explicitly contraindicates concomitant use with strong CYP3A4 inhibitors, naming macrolide antibiotics including clarithromycin.", strength: "Established" },
    ],
    alternatives: ["Rosuvastatin or pravastatin (minimal CYP3A4 dependence)."],
  },
  {
    id: "int-006",
    drugA: "DEMO-0003",
    drugB: "DEMO-0010",
    severity: "major",
    mechanism: "Amiodarone inhibits CYP3A4, reducing simvastatin clearance and raising systemic exposure.",
    clinicalEffect: "Dose-dependent increase in risk of myopathy and rhabdomyolysis.",
    recommendation: "Limit simvastatin to 20 mg/day when co-administered with amiodarone, per regulatory dose-capping guidance, or switch to an alternative statin.",
    evidence: [
      { sourceType: "FDA Label", summary: "Simvastatin labeling caps the dose at 20 mg/day when used with amiodarone due to myopathy risk.", strength: "Established" },
    ],
    alternatives: ["Rosuvastatin or pravastatin at standard doses."],
  },
  {
    id: "int-007",
    drugA: "DEMO-0005",
    drugB: "DEMO-0006",
    severity: "major",
    mechanism: "Both agents increase synaptic serotonin activity (SSRI reuptake inhibition plus tramadol's serotonergic activity).",
    clinicalEffect: "Increased risk of serotonin syndrome (agitation, hyperthermia, clonus, autonomic instability).",
    recommendation: "Avoid combination when possible. If co-therapy is necessary, use the lowest effective doses and educate the patient on serotonin syndrome warning signs.",
    evidence: [
      { sourceType: "FDA Label", summary: "Tramadol labeling carries a boxed-adjacent warning on serotonin syndrome risk with serotonergic drugs including SSRIs.", strength: "Established" },
    ],
  },
  {
    id: "int-008",
    drugA: "DEMO-0005",
    drugB: "DEMO-0002",
    severity: "moderate",
    mechanism: "SSRIs deplete platelet serotonin stores, impairing platelet aggregation; combined with aspirin's antiplatelet effect this is additive.",
    clinicalEffect: "Increased risk of upper gastrointestinal bleeding.",
    recommendation: "Use with caution; consider gastroprotection (e.g. a PPI) if long-term co-therapy is required, and counsel on bleeding warning signs.",
    evidence: [
      { sourceType: "Clinical Pharmacology Reference", summary: "Observational studies show a higher incidence of GI bleeding when SSRIs are combined with NSAIDs or antiplatelet agents.", strength: "Probable" },
    ],
  },
  {
    id: "int-009",
    drugA: "DEMO-0007",
    drugB: "DEMO-0008",
    severity: "major",
    mechanism: "ACE inhibition reduces aldosterone-driven potassium excretion; spironolactone independently spares potassium.",
    clinicalEffect: "Risk of clinically significant hyperkalemia, particularly in renal impairment.",
    recommendation: "Monitor serum potassium and renal function within 1-2 weeks of starting or adjusting either drug; use lower spironolactone doses in at-risk patients.",
    evidence: [
      { sourceType: "FDA Label", summary: "Both agents' labels warn about hyperkalemia risk when combined with other potassium-elevating drugs.", strength: "Established" },
    ],
  },
  {
    id: "int-010",
    drugA: "DEMO-0007",
    drugB: "DEMO-0016",
    severity: "moderate",
    mechanism: "NSAIDs inhibit renal prostaglandin synthesis, blunting the antihypertensive effect of ACE inhibitors and reducing renal blood flow.",
    clinicalEffect: "Reduced blood pressure control and potential decline in renal function, especially with volume depletion.",
    recommendation: "Use the lowest effective NSAID dose for the shortest duration; monitor blood pressure and renal function with prolonged co-use.",
    evidence: [
      { sourceType: "Clinical Pharmacology Reference", summary: "NSAID co-administration is a well-known cause of reduced ACE inhibitor efficacy and renal function decline in at-risk patients.", strength: "Established" },
    ],
  },
  {
    id: "int-011",
    drugA: "DEMO-0009",
    drugB: "DEMO-0010",
    severity: "major",
    mechanism: "Amiodarone inhibits P-glycoprotein-mediated renal and biliary clearance of digoxin.",
    clinicalEffect: "Digoxin plasma levels can roughly double, risking digoxin toxicity (arrhythmia, nausea, visual disturbances).",
    recommendation: "Reduce digoxin dose by approximately 30-50% when starting amiodarone and monitor digoxin levels closely.",
    evidence: [
      { sourceType: "FDA Label", summary: "Digoxin labeling specifically identifies amiodarone as an agent requiring dose reduction due to a well-characterized pharmacokinetic interaction.", strength: "Established" },
    ],
  },
  {
    id: "int-012",
    drugA: "DEMO-0009",
    drugB: "DEMO-0014",
    severity: "minor",
    mechanism: "Proton pump inhibition raises gastric pH, which may marginally alter digoxin absorption kinetics.",
    clinicalEffect: "Clinically insignificant in most patients; rare case reports of mild digoxin level changes.",
    recommendation: "No routine monitoring change required; consider digoxin level check only if other risk factors for toxicity are present.",
    evidence: [
      { sourceType: "Case Reports", summary: "A small number of case reports describe minor digoxin level fluctuations with concurrent PPI use, without clear causal consensus.", strength: "Theoretical" },
    ],
  },
  {
    id: "int-013",
    drugA: "DEMO-0011",
    drugB: "DEMO-0012",
    severity: "contraindicated",
    mechanism: "Both drugs increase cyclic GMP-mediated vasodilation through complementary pathways (PDE5 inhibition and nitric oxide donation).",
    clinicalEffect: "Profound, potentially life-threatening hypotension.",
    recommendation: "Absolute contraindication. Do not co-prescribe under any circumstance; confirm nitrate-free status before prescribing a PDE5 inhibitor.",
    evidence: [
      { sourceType: "FDA Label", summary: "Sildenafil labeling contains an explicit contraindication against use with any form of organic nitrate.", strength: "Established" },
    ],
  },
  {
    id: "int-014",
    drugA: "DEMO-0013",
    drugB: "DEMO-0014",
    severity: "moderate",
    mechanism: "Omeprazole inhibits CYP2C19, the enzyme responsible for converting clopidogrel into its active antiplatelet metabolite.",
    clinicalEffect: "Potential reduction in clopidogrel's antiplatelet effectiveness, though real-world cardiovascular outcome data is mixed.",
    recommendation: "Consider pantoprazole (weaker CYP2C19 inhibition) if gastroprotection is needed alongside clopidogrel, especially in patients with prior stenting.",
    evidence: [
      { sourceType: "FDA Label", summary: "Clopidogrel labeling advises against concomitant omeprazole/esomeprazole due to reduced active metabolite formation.", strength: "Established" },
      { sourceType: "Clinical Pharmacology Reference", summary: "Subsequent outcome studies show mixed clinical significance despite a clear pharmacokinetic effect, reflected here as moderate rather than major.", strength: "Probable" },
    ],
    alternatives: ["Pantoprazole as an alternative PPI with less CYP2C19 inhibition."],
  },
  {
    id: "int-015",
    drugA: "DEMO-0013",
    drugB: "DEMO-0002",
    severity: "moderate",
    mechanism: "Dual antiplatelet effect from two complementary mechanisms (P2Y12 blockade plus COX-1 inhibition).",
    clinicalEffect: "Intentionally used together in specific cardiac indications, but carries higher bleeding risk than either agent alone.",
    recommendation: "Appropriate under specialist-directed dual antiplatelet therapy protocols; monitor for bleeding and reassess duration per guideline-directed therapy windows.",
    evidence: [
      { sourceType: "Clinical Pharmacology Reference", summary: "Dual antiplatelet therapy is standard post-stenting practice but is consistently associated with higher bleeding rates than monotherapy.", strength: "Established" },
    ],
  },
  {
    id: "int-016",
    drugA: "DEMO-0015",
    drugB: "DEMO-0016",
    severity: "major",
    mechanism: "NSAIDs reduce renal prostaglandin synthesis, decreasing renal lithium clearance.",
    clinicalEffect: "Lithium plasma levels can rise substantially, risking lithium toxicity (tremor, confusion, renal injury).",
    recommendation: "Avoid regular NSAID use in patients on lithium; if unavoidable, check lithium levels within a few days of starting the NSAID.",
    evidence: [
      { sourceType: "Clinical Pharmacology Reference", summary: "NSAID-induced reduction in lithium clearance is one of the best-documented drug-induced causes of lithium toxicity.", strength: "Established" },
    ],
    alternatives: ["Acetaminophen for analgesia in patients maintained on lithium."],
  },
  {
    id: "int-017",
    drugA: "DEMO-0002",
    drugB: "DEMO-0016",
    severity: "minor",
    mechanism: "Ibuprofen can competitively bind COX-1 and, if dosed before aspirin, may blunt aspirin's irreversible platelet-inhibiting effect.",
    clinicalEffect: "Potential reduction in aspirin's cardioprotective antiplatelet effect with specific dosing sequences.",
    recommendation: "If both are needed, dose immediate-release aspirin at least 30-60 minutes before ibuprofen, or use an alternative analgesic.",
    evidence: [
      { sourceType: "Pharmacokinetic Study", summary: "Platelet aggregation studies show ibuprofen can interfere with aspirin's COX-1 acetylation when dosed shortly before it.", strength: "Probable" },
    ],
  },
];

export const interactionsForDrug = (rxcui: string): DrugInteraction[] =>
  interactions.filter((i) => i.drugA === rxcui || i.drugB === rxcui);
