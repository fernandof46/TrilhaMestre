// components/FormularioGerador.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import GrupoDeEscolha from './GrupoDeEscolha';
import { estilos as e, espaco, fonte, raio } from './estilos';
import { cores } from './cores';

const OPCOES_HORAS = [
  { valor: 4, rotulo: '4 h' },
  { valor: 8, rotulo: '8 h' },
  { valor: 12, rotulo: '12 h' },
  { valor: 20, rotulo: '20 h' },
  { valor: 30, rotulo: '30 h+' },
];

const OPCOES_SEMANAS = [
  { valor: 4, rotulo: '4 sem' },
  { valor: 8, rotulo: '8 sem' },
  { valor: 12, rotulo: '12 sem' },
  { valor: 24, rotulo: '24 sem' },
];

export default function FormularioGerador({ aoGerar, estaGerando, erro }) {
  const [topico, definirTopico] = useState('');
  const [tipoMeta, definirTipoMeta] = useState('aprender');
  const [nivel, definirNivel] = useState('iniciante');
  const [horas, definirHoras] = useState(8);
  const [semanas, definirSemanas] = useState(12);
  const [contexto, definirContexto] = useState('');
  const [tocado, definirTocado] = useState(false);

  const eInvalido = topico.trim().length < 3;

  const lidarComEnvio = () => {
    definirTocado(true);
    if (eInvalido) return;

    aoGerar({
      topico: topico.trim(),
      tipoMeta,
      nivel,
      horasPorSemana: horas,
      semanasHorizonte: semanas,
      contexto: contexto.trim(),
    });
  };

  return (
    /* gap: espaco.xl distribui todos os blocos da página de forma uniforme */
    <View style={[e.larguraTotal, { gap: espaco.xl, paddingBottom: espaco.xxl }]}>
      
      {/* Campo: Tópico / Objetivo Principal */}
      <View style={{ gap: espaco.sm }}>
        <Text style={e.rotuloDestaque}>
          O que você quer aprender ou construir?
        </Text>
        <TextInput
          style={[
            e.rebaixada,
            {
              borderRadius: raio.md,
              borderColor: eInvalido && tocado ? cores.cancelar : cores.bordaInput,
              paddingHorizontal: espaco.lg,
              paddingVertical: espaco.lg,
              fontSize: fonte.md,
              color: cores.titulos,
            },
          ]}
          value={topico}
          onChangeText={definirTopico}
          placeholder="Ex.: tocar violão, ciência de dados, marcenaria..."
          placeholderTextColor={cores.descricao}
        />
        {tocado && eInvalido ? (
          <Text style={e.textoErro}>
            Descreva seu objetivo com pelo menos 3 caracteres.
          </Text>
        ) : null}
      </View>

      {/* Grupo de Escolha: Tipo de Meta */}
      <GrupoDeEscolha 
        rotulo="Qual é a sua meta?" 
        opcoes={[
          { valor: 'aprender', rotulo: 'Aprender', dica: 'Dominar um assunto do zero' },
          { valor: 'construir', rotulo: 'Construir', dica: 'Criar um projeto prático' }
        ]} 
        valorSelecionado={tipoMeta} 
        aoMudarValor={definirTipoMeta} 
      />

      {/* Grupo de Escolha: Nível Atual */}
      <GrupoDeEscolha 
        rotulo="Seu nível hoje" 
        opcoes={[
          { valor: 'iniciante', rotulo: 'Iniciante' },
          { valor: 'intermediario', rotulo: 'Intermediário' },
          { valor: 'avancado', rotulo: 'Avançado' }
        ]} 
        valorSelecionado={nivel} 
        aoMudarValor={definirNivel} 
      />

      {/* Horas por semana */}
      <GrupoDeEscolha
        rotulo="Horas por semana"
        variante="pills"
        opcoes={OPCOES_HORAS}
        valorSelecionado={horas}
        aoMudarValor={definirHoras}
      />

      {/* Prazo desejado */}
      <GrupoDeEscolha
        rotulo="Prazo desejado"
        variante="pills"
        opcoes={OPCOES_SEMANAS}
        valorSelecionado={semanas}
        aoMudarValor={definirSemanas}
      />

      {/* Campo: Contexto Extra (Textarea) */}
      <View style={{ gap: espaco.sm }}>
        <Text style={e.rotuloDestaque}>
          Contexto extra (opcional)
        </Text>
        <TextInput
          style={[
            e.rebaixada,
            {
              borderRadius: raio.md,
              paddingHorizontal: espaco.lg,
              paddingVertical: espaco.lg,
              fontSize: fonte.md,
              color: cores.titulos,
              minHeight: 100,
              textAlignVertical: 'top', // Faz o texto começar no topo no Android
            },
          ]}
          value={contexto}
          onChangeText={definirContexto}
          multiline={true}
          numberOfLines={4}
          placeholder="Ex.: quero usar isso no meu trabalho, tenho provas em 3 meses..."
          placeholderTextColor={cores.descricao}
        />
      </View>

      {/* Exibição de Erro do Servidor, se houver */}
      {erro ? (
        <View style={e.bannerAlertaDestrutivo}>
          <Text style={e.textoErro}>⚠️ {erro}</Text>
        </View>
      ) : null}

      {/* Botão de Submissão / Geração */}
      <TouchableOpacity
        style={[
          e.botaoPrimario,
          { height: 48, borderRadius: raio.md, marginTop: espaco.sm },
          estaGerando && e.botaoDesabilitado,
        ]}
        onPress={lidarComEnvio}
        disabled={estaGerando}
        activeOpacity={0.8}
      >
        {estaGerando ? (
          <>
            <ActivityIndicator size="small" color={cores.titulos} />
            <Text style={e.textoTituloItem}>Gerando estratégia...</Text>
          </>
        ) : (
          <Text style={e.textoDescricao}>
            Gerar minha trilha ➔
          </Text>
        )}
      </TouchableOpacity>

    </View>
  );
}
