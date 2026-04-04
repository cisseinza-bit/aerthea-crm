// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma  = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ── Agents ────────────────────────────────────────────────────────────────
  const agents = [
    { name: "ELODIE", role: "Audit & Research — scrape, analyse, rapport", script: "brand_scraper.py" },
    { name: "ATLAS",  role: "Campagnes visuelles — génère les images",     script: "campaign_generator.py" },
    { name: "FELIX",  role: "Devis & Facturation — PDF auto",              script: "invoice.py" },
    { name: "IRIS",   role: "Emails & Communication",                       script: "email_sender.py" },
    { name: "ZARA",   role: "Try-On & Modèles virtuels",                   script: "tryon.py" },
  ];

  for (const agent of agents) {
    await prisma.agent.upsert({
      where:  { name: agent.name },
      update: {},
      create: agent,
    });
  }
  console.log("  Agents: OK");

  // ── Clients ───────────────────────────────────────────────────────────────
  const lapiraterie = await prisma.client.upsert({
    where:  { id: "client_lapiraterie" },
    update: {},
    create: {
      id:      "client_lapiraterie",
      name:    "Inza — La Piraterie",
      email:   "contact@lapiraterie.fr",
      company: "La Piraterie",
      color:   "#C8003C",
      status:  "active",
    },
  });

  const sdc = await prisma.client.upsert({
    where:  { id: "client_sdc" },
    update: {},
    create: {
      id:      "client_sdc",
      name:    "Saudi Desert Control",
      email:   "contact@sdc.sa",
      company: "Saudi Desert Control",
      color:   "#2D6A4F",
      status:  "active",
    },
  });

  await prisma.client.upsert({
    where:  { id: "client_9mm" },
    update: {},
    create: {
      id:      "client_9mm",
      name:    "9MM Energy",
      email:   "contact@9mm.fr",
      company: "9MM Energy",
      color:   "#FF0000",
      status:  "prospect",
    },
  });
  console.log("  Clients: OK");

  // ── Project La Piraterie ──────────────────────────────────────────────────
  const proj1 = await prisma.project.upsert({
    where:  { id: "proj_lapiraterie_reels" },
    update: {},
    create: {
      id:         "proj_lapiraterie_reels",
      title:      "Campagne Reels IA — Lancement Collection",
      status:     "in_progress",
      progress:   45,
      budget:     "1200",
      clientId:   lapiraterie.id,
      shareToken: "share_lapiraterie_001",
    },
  });

  const phases1 = [
    { title: "Brief & Direction artistique", status: "done",        order: 1 },
    { title: "Génération images ATLAS",      status: "in_progress", order: 2 },
    { title: "Animation Kling 2.6",          status: "pending",     order: 3 },
    { title: "Captions & Calendrier",        status: "pending",     order: 4 },
    { title: "Livraison client",             status: "pending",     order: 5 },
  ];

  for (const phase of phases1) {
    await prisma.phase.upsert({
      where:  { id: `phase_lp_${phase.order}` },
      update: {},
      create: { id: `phase_lp_${phase.order}`, ...phase, projectId: proj1.id },
    });
  }
  console.log("  Project La Piraterie: OK");

  // ── Project SDC ───────────────────────────────────────────────────────────
  const proj2 = await prisma.project.upsert({
    where:  { id: "proj_sdc_film" },
    update: {},
    create: {
      id:         "proj_sdc_film",
      title:      "Campagne Film 60s — Désertification",
      status:     "pending",
      progress:   10,
      budget:     "3500",
      clientId:   sdc.id,
      shareToken: "share_sdc_001",
    },
  });

  const phases2 = [
    { title: "Brief bilingue AR/FR",         status: "done",    order: 1 },
    { title: "Script 8 plans",               status: "pending", order: 2 },
    { title: "Génération images ATLAS",      status: "pending", order: 3 },
    { title: "Voix off + sous-titres",       status: "pending", order: 4 },
    { title: "Montage final + livraison",    status: "pending", order: 5 },
  ];

  for (const phase of phases2) {
    await prisma.phase.upsert({
      where:  { id: `phase_sdc_${phase.order}` },
      update: {},
      create: { id: `phase_sdc_${phase.order}`, ...phase, projectId: proj2.id },
    });
  }
  console.log("  Project SDC: OK");

  console.log("\nSeed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
