# Prompt

Let me research the current Geoscape/PSMA and NSW Spatial Services licensing terms to see what they permit regarding persistent storage and redistribution.Now I have enough to give you a thorough answer. Let me also quickly check which specific Geoscape layers your platform is consuming, since the answer depends heavily on the product tier.The uploaded file doesn't appear to be on disk, but I have enough from the research and your project context to give a comprehensive answer. The short version is: **it depends entirely on which Geoscape product tier you're consuming, and the answer splits into three distinct categories.**

---

## NSW Spatial Services data — generally permissive

NSW Spatial Services data accessed from their Spatial Web Services is licensed under Creative Commons Attribution (CC BY), and under the NSW Government Open Data Policy, spatial data is made available under open access licenses to support new and innovative uses. CC BY 4.0 permits persistent storage, adaptation, redistribution — including commercially — provided attribution is maintained. So for the NSW SS layers you're already caching, persistent storage in PostGIS and redistribution to end users is permitted, subject to:

- Correct attribution: `© Department of Customer Service [date of extraction]`
- The data is only current at the time and date of transmission — so you should display the extraction/cache date to users
- Compliance with the Australian Privacy Principles

## Geoscape open data products (G-NAF, Administrative Boundaries) — also permissive

The Australian Government has negotiated the release of Administrative Boundaries under an open CC BY 4.0 licence. G-NAF Core is also available as open data, licensed under a CC BY 4.0 EULA. These can be persistently stored and redistributed with attribution. G-NAF has one additional restriction: the data must not be used for the generation of an address or compilation of addresses for the sending of mail unless each address has been verified as capable of receiving mail by reference to a secondary source.

So if any of your in-AOI Geoscape layers are Administrative Boundaries or G-NAF, you're clear.

## Geoscape commercial products (Buildings, Cadastre, Property, etc.) — restrictive, and this is where the problem lies

The Geoscape commercial licence terms (both the Direct Licence via partners like Precisely and the General Terms v2.0) are significantly more restrictive. The key constraints from the Direct Licence Terms:

- You must only use the Data and any Derived Material internally within your own business for the purposes of your day-to-day business operations
- You cannot make the Data or any Derived Material available to any other person
- You cannot use the Data or Derived Material to develop capability, products, services, outputs or other material for commercialisation or potential commercialisation

And critically, the definition of "Derived Material" is very broad: any product, service, output or other material that is created or developed using the Data, which may or may not contain some Data, and includes any product, service, output or other material that is created or developed using Derived Material. That recursive definition means even a PostGIS table of derived geometry (e.g. building footprints clipped to an AOI, or property boundaries simplified/transformed) is Derived Material and cannot be redistributed to end users.

---

## Practical answer for your platform

There are really only two paths to redistributing Geoscape commercial data to end users:

1. **Use only the open-data products** (G-NAF, Administrative Boundaries) for persistent caching — these are CC BY 4.0 and fully redistributable. For Buildings/Cadastre/Property geometry, continue consuming via API at runtime (the current live-dependency pattern).

2. **Negotiate a custom agreement with Geoscape** that explicitly permits redistribution or end-user access. The General Terms v2.0 has a custom agreement path, and the licence allows exceptions "with prior written consent". Given that your platform serves NSW rural community fire safety (BCYCA, Mondrook, Tinonee), there may be a public-interest case to make — Geoscape is government-owned and has provisions for government and community use.

Before going further, a couple of clarifying questions: which specific Geoscape layers are you consuming via the live dependency right now — is it Buildings, Cadastre, Property, or primarily the open-data tiers? And is the platform accessing Geoscape through a partner (e.g. Precisely) or directly via Geoscape Hub? The licence terms differ between those channels and that affects what's negotiable.
