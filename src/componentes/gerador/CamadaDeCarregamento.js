import React, { useEffect, useState } from 'react';
import { View, Text, Modal, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * LISTA DE MENSAGENS DE STATUS (ETAPAS)
 * Estas mensagens alternam a cada 2.6 segundos para entreter o usuário
 * enquanto o modelo de IA pesquisa e monta a rota de estudos.
 * 
 * <-- PARA EDITAR OU ADICIONAR ETAPAS, ALTERE ESTE ARRAY ABAIXO:
 */
const ETAPAS_DE_PROCESSAMENTO = [
  'Lendo o briefing da sua corrida...',
  'Traçando a estratégia etapa por etapa...',
  'Buscando materiais gratuitos de verdade na web...',
  'Montando módulos, práticas e checkpoints...',
];

/**
 * COMPONENTE: CamadaDeCarregamento
 * 
 * Finalidade: Exibir uma tela de espera sobreposta (Modal) quando a rota
 * de estudos estiver sendo gerada.
 * 
 * @param {string} topico - O assunto/tema que o usuário escolheu aprender.
 * @param {boolean} visivel - Controla se a tela de carregamento deve ser exibida ou ocultada.
 */
export default function CamadaDeCarregamento({ topico, visivel = true }) {
  // Estado que armazena qual frase da lista de etapas está sendo exibida agora
  const [etapaAtual, setEtapaAtual] = useState(0);

  // Efeito que faz a rotação automática das frases a cada 2.6 segundos
  useEffect(() => {
    // Se o modal não estiver visível, não precisa iniciar o temporizador
    if (!visivel) return;

    // Configura o cronômetro para trocar a frase
    const temporizador = setInterval(() => {
      setEtapaAtual((indiceAnterior) => (indiceAnterior + 1) % ETAPAS_DE_PROCESSAMENTO.length);
    }, 2600);

    // Limpeza de memória: desliga o cronômetro se o componente for desmontado
    return () => clearInterval(temporizador);
  }, [visivel]);

  return (
    <Modal
      transparent={true}
      visible={visivel}
      animationType="fade"
      statusBarTranslucent={true} // Cobre inclusive a barra de status no topo
    >
      <View style={estilos.fundoSobreposicao}>
        <View style={estilos.cartaoConteudoCarregamento}>
          
          {/* Círculo com ícone de telemetria/atividade estilo Mercedes F1 */}
          <View style={estilos.circuloIconeCarregamento}>
            <Feather name="activity" size={24} color={cores.confirmar} />
          </View>

          {/* Subtítulo temático de estratégia */}
          <Text style={estilos.textoSubtituloPitWall}>
            Pit wall · gerando estratégia
          </Text>

          {/* Assunto que o usuário solicitou */}
          <Text style={estilos.textoTopicoCarregamento}>
            {topico || 'Preparando sua rota'}
          </Text>

          {/* Frase dinâmica que muda a cada 2.6 segundos */}
          <Text style={estilos.textoEtapaCarregamento}>
            {ETAPAS_DE_PROCESSAMENTO[etapaAtual]}
          </Text>

          {/* Indicador de carregamento circular nativo em Verde Petronas */}
          <View style={estilos.areaIndicadorCarregamento}>
            <ActivityIndicator size="small" color={cores.confirmar} />
          </View>

          {/* Aviso sobre o tempo médio que o usuário deve esperar */}
          <Text style={estilos.textoAvisoEspera}>
            Isso leva de 20 a 60 segundos. Não feche esta tela.
          </Text>

        </View>
      </View>
    </Modal>
  );
}