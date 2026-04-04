export const dynamic = "force-dynamic";

export default function CampaignsPage() {
  return (
    <div className="p-8 min-h-screen bg-[#0A0A0A]">
      <div className="mb-8">
        <p className="text-[#D8FF57] text-xs font-mono tracking-widest uppercase">Aerthea CRM</p>
        <h1 className="text-2xl font-bold text-[#F5F5F5] mt-1">Campagnes</h1>
      </div>
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-12 text-center">
        <p className="text-[#D8FF57] text-3xl mb-4">◧</p>
        <p className="text-[#F5F5F5] text-sm font-semibold">Module Campagnes</p>
        <p className="text-[#888888] text-xs mt-2 font-mono">Bientôt disponible — génération de campagnes IA depuis aethera-studio/</p>
      </div>
    </div>
  );
}
