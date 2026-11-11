import { useEffect } from "react"; // Importa o ciclo de vida básico do React para gerenciar os efeitos colaterais
import { usePathname } from "expo-router"; // Importa o Hook de navegação do Expo Router para monitorar a tela ativa no dispositivo móvel

/**
 * Componente RolarParaOTopo
 * 
 * Recebe a referência nativa de uma ScrollView/FlatList e volta ao topo ao trocar de rota.
 */
export default function RolarParaOTopo({ referenciaRolagem }) {
  const caminhoAtivo = usePathname();

  useEffect(() => {
    if (!referenciaRolagem || !referenciaRolagem.current) return;
    const temporizador = setTimeout(() => {
      referenciaRolagem.current?.scrollTo({ y: 0, x: 0, animated: false });
    }, 50);
    return () => clearTimeout(temporizador);
  }, [caminhoAtivo, referenciaRolagem]);

  return null; // Componente estritamente comportamental; não renderiza nenhum elemento visual na árvore de componentes (UI)
}
