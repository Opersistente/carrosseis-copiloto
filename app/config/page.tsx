import { listPresets } from "@/lib/store";
import { savePresetAction, deletePresetAction } from "@/app/actions";
import ConfigView from "./ConfigView";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const presets = await listPresets();
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-2">Configurações</h1>
      <p className="text-soft text-sm mb-6">
        Estilos de geração — cores, tipografia e as instruções que guiam como o carrossel e o post do
        LinkedIn são escritos. Crie quantos quiser e escolha um diferente por post, na hora de mandar
        pra fila.
      </p>
      <ConfigView presets={presets} savePreset={savePresetAction} deletePreset={deletePresetAction} />
    </div>
  );
}
