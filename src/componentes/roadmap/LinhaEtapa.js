import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * MAPEAMENTO DE ÍCONES POR TIPO DE MATERIAL
 * Associa o tipo de recurso sugerido ao ícone correspondente do Feather.
 */
function obterIconePorTipoRecurso(tipo = '') {
  const tipoTratado = tipo.toLowerCase();
  switch (tipoTratado) {
    case 'video':
      return 'video';
    case 'curso':
      return 'award';
    case 'doc':
      return 'file-text';
    case 'livro':
      return 'book';
    case 'pratica':
    case 'ferramenta':
      return 'tool';
    case 'comunidade':
      return 'users';
    default:
      return 'external-link';
  }
}

/**
 * COMPONENTE: LinhaEtapa (Substituto do StepRow)
 * 
 * Finalidade: Renderiza um passo de estudo específico com checkbox de conclusão,
 * tempo estimado, orientações práticas, critérios de sucesso, links gratuitos e tutor.
 * 
 * @param {object} etapa - Objeto com os detalhes { title, est_minutes, description, practice, success_criteria, resources }
 * @param {boolean} concluida - Indica se a etapa está marcada como concluída
 * @param {function} onAlternarConclusao - Dispara a alternância de status da etapa
 * @param {function} onAbrirTutor - Abre o chat de IA de dúvidas sobre esta etapa
 */
export default function LinhaEtapa({
  etapa,
  concluida = false,
  onAlternarConclusao,
  onAbrirTutor,
}) {
  /**
   * Abre links externos com segurança no navegador padrão do aparelho
   * @param {string} url - Link do vídeo, documentação ou curso
   */
  const abrirLinkExterno = async (url) => {
    if (!url) return;

    try {
      const suportado = await Linking.canOpenURL(url);
      if (suportado) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Aviso', 'Não foi possível abrir o link solicitado.');
      }
    } catch (erro) {
      Alert.alert('Erro', 'Ocorreu uma falha ao tentar abrir o recurso.');
    }
  };

  const listaRecursos = etapa?.resources || [];

  return (
    <View
      style={[
        estilos.containerLinhaEtapa,
        concluida && estilos.containerEtapaConcluida,
      ]}
    >
      <View style={estilos.linhaConteudoEtapa}>
        
        {/* 1. BOTÃO DE CONCLUSÃO (CHECKBOX) */}
        <TouchableOpacity
          style={estilos.botaoAlternarConclusaoEtapa}
          onPress={onAlternarConclusao}
          hitSlop={12}
          activeOpacity={0.7}
        >
          <Feather
            name={concluida ? 'check-circle' : 'circle'}
            size={20}
            color={concluida ? cores.confirmar : cores.descricao}
          />
        </TouchableOpacity>

        {/* 2. ÁREA DE DETALHES E CONTEÚDO */}
        <View style={estilos.areaInformacoesEtapa}>
          
          {/* Título e Estimativa de Minutos */}
          <View style={estilos.linhaTituloEEstimativa}>
            <Text
              style={[
                estilos.textoTituloEtapa,
                concluida && estilos.textoTituloEtapaConcluido,
              ]}
            >
              {etapa?.title || 'Passo de Estudo'}
            </Text>

            {etapa?.est_minutes ? (
              <View style={estilos.emblemaMinutosEtapa}>
                <Feather name="clock" size={10} color={cores.descricao} />
                <Text style={estilos.textoMinutosEtapa}>
                  {etapa.est_minutes} min
                </Text>
              </View>
            ) : null}
          </View>

          {/* Descrição resumida da etapa */}
          {etapa?.description ? (
            <Text style={estilos.textoDescricaoEtapa}>
              {etapa.description}
            </Text>
          ) : null}

          {/* Orientações Práticas */}
          {etapa?.practice ? (
            <View style={estilos.blocoDestaquePratica}>
              <Feather name="tool" size={12} color={cores.descricao} />
              <Text style={estilos.textoConteudoPratica}>
                <Text style={estilos.textoRotuloPratica}>Prática: </Text>
                {etapa.practice}
              </Text>
            </View>
          ) : null}

          {/* Critério de Sucesso ("Pronto quando:") */}
          {etapa?.success_criteria ? (
            <View style={estilos.blocoDestaqueCriterio}>
              <Feather name="target" size={12} color={cores.confirmar} />
              <Text style={estilos.textoConteudoCriterio}>
                <Text style={estilos.textoRotuloCriterio}>Pronto quando: </Text>
                {etapa.success_criteria}
              </Text>
            </View>
          ) : null}

          {/* 3. RECURSOS E LINKS GRATUITOS (VÍDEOS, CURSOS, ARTIGOS) */}
          {listaRecursos.length > 0 ? (
            <View style={estilos.areaRecursosLinks}>
              {listaRecursos.map((recurso, indice) => {
                const nomeIcone = obterIconePorTipoRecurso(recurso?.type);

                return (
                  <TouchableOpacity
                    key={`recurso-${indice}`}
                    style={estilos.botaoRecursoExterno}
                    onPress={() => abrirLinkExterno(recurso?.url)}
                    activeOpacity={0.7}
                  >
                    <Feather name={nomeIcone} size={12} color={cores.confirmar} />

                    <Text
                      style={estilos.textoTituloRecurso}
                      numberOfLines={1}
                    >
                      {recurso?.title || 'Acessar material'}
                    </Text>

                    {recurso?.provider ? (
                      <Text style={estilos.textoProvedorRecurso}>
                        {recurso.provider}
                      </Text>
                    ) : null}

                    <Feather name="external-link" size={11} color={cores.descricao} />
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {/* 4. BOTÃO PARA CHAMAR O TUTOR DE IA */}
          <TouchableOpacity
            style={estilos.botaoChamarTutorEtapa}
            onPress={onAbrirTutor}
            activeOpacity={0.7}
          >
            <Feather name="headphones" size={13} color={cores.confirmar} />
            <Text style={estilos.textoBotaoChamarTutor}>
              Tutor da etapa
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
}