import type { TeamVisaInfo } from "../types/index.js";

export const visaInfo: TeamVisaInfo[] = [
  // ── Group A ────────────────────────────────────────────────

  {
    team_id: "mex",
    nationality: "Mexican",
    passport_country: "Mexico",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Mexico is not part of the US Visa Waiver Program. Apply for a B1/B2 visa at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 0,
        document: "No visa needed",
        note: "Host nation -- no entry requirements.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7) — conditional",
        note: "Mexican citizens with a valid US non-immigrant visa or a Canadian visa from the past 10 years may apply for an eTA for air travel. Otherwise, a visitor visa is required.",
      },
    ],
  },

  {
    team_id: "rsa",
    nationality: "South African",
    passport_country: "South Africa",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "South African nationals require a US tourist visa. Apply at the US Embassy and allow several weeks for processing.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "South African citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "kor",
    nationality: "South Korean",
    passport_country: "South Korea",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "South Korea is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "South Korean nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "South Korea is visa-exempt for Canada. An eTA is required when arriving by air. Apply online before your flight.",
      },
    ],
  },

  // ── Group B ────────────────────────────────────────────────

  {
    team_id: "can",
    nationality: "Canadian",
    passport_country: "Canada",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Canadian citizens do not need an ESTA or visa for the USA. Valid passport required. Stay up to 180 days for tourism.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Canadians can enter Mexico visa-free for up to 180 days. A completed FMM immigration form is required at entry.",
      },
      {
        country: "Canada",
        requirement: "visa-free",
        max_stay_days: 0,
        document: "No visa needed",
        note: "Host nation -- no entry requirements.",
      },
    ],
  },

  {
    team_id: "sui",
    nationality: "Swiss",
    passport_country: "Switzerland",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Switzerland is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Swiss nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Switzerland is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "qat",
    nationality: "Qatari",
    passport_country: "Qatar",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Qatar joined the US Visa Waiver Program in September 2024. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Qatari nationals require a visa for Mexico. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Canada lifted the visa requirement for Qatari citizens in November 2025. An eTA is required for air travel. Apply online.",
      },
    ],
  },

  // ── Group C ────────────────────────────────────────────────

  {
    team_id: "bra",
    nationality: "Brazilian",
    passport_country: "Brazil",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Brazilian nationals require a US tourist visa. Apply at the US Consulate and allow several weeks for interview scheduling.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Brazilian nationals can enter Mexico visa-free for up to 180 days for tourism. An FMM immigration form is required at entry.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Brazilian citizens generally need a visitor visa for Canada. Those with a valid US non-immigrant visa or a Canadian visa from the past 10 years may qualify for an eTA for air travel instead.",
      },
    ],
  },

  {
    team_id: "mar",
    nationality: "Moroccan",
    passport_country: "Morocco",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Moroccan nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Moroccan citizens generally need a visitor visa. Those with a valid US non-immigrant visa or a Canadian visa from the past 10 years may qualify for an eTA for air travel instead.",
      },
    ],
  },

  {
    team_id: "hai",
    nationality: "Haitian",
    passport_country: "Haiti",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Haitian nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Haitian citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "sco",
    nationality: "British (Scottish)",
    passport_country: "United Kingdom",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "UK nationals travel on British passports and are part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "UK passport holders can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "UK is visa-exempt for Canada. An eTA is required when arriving by air. Apply online before your flight.",
      },
    ],
  },

  // ── Group D ────────────────────────────────────────────────

  {
    team_id: "usa",
    nationality: "American",
    passport_country: "United States",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-free",
        max_stay_days: 0,
        document: "No visa needed",
        note: "Host nation -- no entry requirements.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "US citizens can enter Mexico visa-free for up to 180 days. An FMM immigration form is required at entry.",
      },
      {
        country: "Canada",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "US citizens do not need an eTA or visa for Canada. Valid passport (or NEXUS card) required.",
      },
    ],
  },

  {
    team_id: "par",
    nationality: "Paraguayan",
    passport_country: "Paraguay",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Paraguayan nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Paraguayan nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Paraguayan citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  // ── Group E ────────────────────────────────────────────────

  {
    team_id: "aus",
    nationality: "Australian",
    passport_country: "Australia",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Australia is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Australian nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Australia is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "ger",
    nationality: "German",
    passport_country: "Germany",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Germany is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "German nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Germany is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "ecu",
    nationality: "Ecuadorian",
    passport_country: "Ecuador",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Ecuadorian nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Ecuadorian nationals require a visa for Mexico. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Ecuadorian citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "civ",
    nationality: "Ivorian",
    passport_country: "Ivory Coast",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Ivorian nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Ivorian citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  // ── Group F ────────────────────────────────────────────────

  {
    team_id: "cuw",
    nationality: "Dutch (Curacaoan)",
    passport_country: "Netherlands",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Curacao nationals travel on Netherlands passports and are part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Netherlands passport holders can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Netherlands is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "ned",
    nationality: "Dutch",
    passport_country: "Netherlands",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Netherlands is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Dutch nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Netherlands is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "jpn",
    nationality: "Japanese",
    passport_country: "Japan",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Japan is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Japanese nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Japan is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "tun",
    nationality: "Tunisian",
    passport_country: "Tunisia",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Tunisian nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Tunisian citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  // ── Group G ────────────────────────────────────────────────

  {
    team_id: "bel",
    nationality: "Belgian",
    passport_country: "Belgium",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Belgium is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Belgian nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Belgium is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "irn",
    nationality: "Iranian",
    passport_country: "Iran",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Iranian nationals require a US tourist visa. Processing can be lengthy with additional security screening. Apply many months in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Iranian citizens need a Canadian visitor visa. Processing times can be lengthy. Apply well in advance.",
      },
    ],
  },

  {
    team_id: "egy",
    nationality: "Egyptian",
    passport_country: "Egypt",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Egyptian nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Egyptian citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "nzl",
    nationality: "New Zealander",
    passport_country: "New Zealand",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "New Zealand is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "New Zealand nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "New Zealand is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  // ── Group H ────────────────────────────────────────────────

  {
    team_id: "esp",
    nationality: "Spanish",
    passport_country: "Spain",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Spain is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Spanish nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Spain is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "uru",
    nationality: "Uruguayan",
    passport_country: "Uruguay",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Uruguay was removed from the US Visa Waiver Program in 2003. A B1/B2 tourist visa is required. Apply at the US Embassy.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Uruguayan nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Uruguayan citizens generally need a visitor visa. Those with a valid US non-immigrant visa or a Canadian visa from the past 10 years may qualify for an eTA for air travel instead.",
      },
    ],
  },

  {
    team_id: "ksa",
    nationality: "Saudi",
    passport_country: "Saudi Arabia",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Saudi nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Saudi citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "cpv",
    nationality: "Cape Verdean",
    passport_country: "Cape Verde",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Cape Verdean nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Cape Verdean citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  // ── Group I ────────────────────────────────────────────────

  {
    team_id: "fra",
    nationality: "French",
    passport_country: "France",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "France is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "French nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "France is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "sen",
    nationality: "Senegalese",
    passport_country: "Senegal",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Senegalese nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Senegalese citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "nor",
    nationality: "Norwegian",
    passport_country: "Norway",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Norway is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Norwegian nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Norway is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "arg",
    nationality: "Argentine",
    passport_country: "Argentina",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Argentina was removed from the US Visa Waiver Program in 2002. A B1/B2 tourist visa is required. Apply at the US Embassy.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Argentine nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Argentine citizens generally need a visitor visa. Those with a valid US non-immigrant visa or a Canadian visa from the past 10 years may qualify for an eTA for air travel instead.",
      },
    ],
  },

  // ── Group J ────────────────────────────────────────────────

  {
    team_id: "aut",
    nationality: "Austrian",
    passport_country: "Austria",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Austria is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Austrian nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Austria is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  {
    team_id: "alg",
    nationality: "Algerian",
    passport_country: "Algeria",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Algerian nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Algerian citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "jor",
    nationality: "Jordanian",
    passport_country: "Jordan",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Jordanian nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Jordanian citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "por",
    nationality: "Portuguese",
    passport_country: "Portugal",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Portugal is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Portuguese nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Portugal is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  // ── Group K ────────────────────────────────────────────────

  {
    team_id: "col",
    nationality: "Colombian",
    passport_country: "Colombia",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Colombian nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Colombian nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Colombian citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "uzb",
    nationality: "Uzbek",
    passport_country: "Uzbekistan",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Uzbek nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Uzbek citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "eng",
    nationality: "British (English)",
    passport_country: "United Kingdom",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "UK nationals travel on British passports and are part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "UK passport holders can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "UK is visa-exempt for Canada. An eTA is required when arriving by air. Apply online before your flight.",
      },
    ],
  },

  {
    team_id: "cro",
    nationality: "Croatian",
    passport_country: "Croatia",
    entry_requirements: [
      {
        country: "USA",
        requirement: "esta",
        max_stay_days: 90,
        document: "ESTA ($21)",
        note: "Croatia is part of the US Visa Waiver Program. Apply for ESTA at least 72 hours before departure.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Croatian nationals can enter Mexico visa-free for up to 180 days for tourism (EU member state).",
      },
      {
        country: "Canada",
        requirement: "eta",
        max_stay_days: 180,
        document: "eTA (CA$7)",
        note: "Croatia is visa-exempt for Canada. An eTA is required when arriving by air.",
      },
    ],
  },

  // ── Group L ────────────────────────────────────────────────

  {
    team_id: "gha",
    nationality: "Ghanaian",
    passport_country: "Ghana",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Ghanaian nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Tourist visa",
        note: "Visa required for Mexican entry. However, holders of a valid US, UK, Canada, Japan, or Schengen visa may enter Mexico visa-free for up to 180 days.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Ghanaian citizens need a Canadian visitor visa. Apply online or at a VAC well in advance.",
      },
    ],
  },

  {
    team_id: "pan",
    nationality: "Panamanian",
    passport_country: "Panama",
    entry_requirements: [
      {
        country: "USA",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "B1/B2 Tourist visa",
        note: "Panamanian nationals require a US tourist visa. Apply at the US Embassy well in advance.",
      },
      {
        country: "Mexico",
        requirement: "visa-free",
        max_stay_days: 180,
        document: "No visa needed",
        note: "Panamanian nationals can enter Mexico visa-free for up to 180 days for tourism.",
      },
      {
        country: "Canada",
        requirement: "visa-required",
        max_stay_days: 180,
        document: "Visitor visa (TRV)",
        note: "Panamanian citizens generally need a visitor visa. Those with a valid US non-immigrant visa or a Canadian visa from the past 10 years may qualify for an eTA for air travel instead.",
      },
    ],
  },
];
