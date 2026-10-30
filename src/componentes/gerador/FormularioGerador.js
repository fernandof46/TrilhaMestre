// components/FormularioGerador.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import GrupoDeEscolha from './GrupoDeEscolha';
import { estilos } from './estilos';
import { cores } from './cores';

// Opções estáticas para horas e semanas
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

/**
 * Componente Formulário do Gerador (FormularioGerador)
 * Permite ao usuário configurar os parâmetros para a criação de um roadmap de aprendizado.
 * 
 * @param {Function} aoGerar - Função executada ao submeter o formulário com os dados preenchidos.
 * @param {boolean} estaGerando - Estado de carregamento enquanto o roadmap é gerado.
 * @param {string} erro - Mensagem de erro caso ocorra alguma falha na requisição.
 */
export default function FormularioGerador({ aoGerar, estaGerando, erro }) {
  // Estados locais para controle dos inputs
  const [topico, definirTopico] = useState('');
  const [tipoMeta, definirTipoMeta] = useState('aprender');
  const [nivel, definirNivel] = useState('iniciante');
  const [horas, definirHoras] = useState(8);
  const [semanas, definirSemanas] = useState(12);
  const [contexto, definirContexto] = useState('');
  const [tocado, definirTocado] = useState(false);

  // Validação: Tópico precisa ter pelo menos 3 caracteres preenchidos
  const eInvalido = topico.trim().length < 3;

  /**
   * Função executada ao enviar o formulário
   */
  const lidarComEnvio = () => {
    definirTocado(true);
    if (eInvalido) return;

    // Dispara a função recebida por props com os dados estruturados em PT-BR
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
    <View style={estilos.formularioContainer}>
      
      {/* Campo: Tópico / Objetivo Principal */}
      <View style={estilos.grupoCampo}>
        <Text style={estilos.rotuloCampo}>
          O que você quer aprender ou construir?
        </Text>
        <TextInput
          style={estilos.entradaTexto}
          value={topico}
          onChangeText={definirTopico}
          placeholder="Ex.: tocar violão, ciência de dados, marcenaria..."
          placeholderTextColor={cores.descricao}
        />
        {tocado && eInvalido ? (
          <Text style={estilos.textoErroValidacao}>
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

      {/* Seção dupla: Horas por semana e Prazo desejado */}
      <GrupoDeEscolha
        rotulo="Horas por semana"
        variante="pills"
        opcoes={OPCOES_HORAS}
        valorSelecionado={horas}
        aoMudarValor={definirHoras}
      />

      <GrupoDeEscolha
        rotulo="Prazo desejado"
        variante="pills"
        opcoes={OPCOES_SEMANAS}
        valorSelecionado={semanas}
        aoMudarValor={definirSemanas}
      />

      {/* Campo: Contexto Extra (Textarea) */}
      <View style={estilos.grupoCampo}>
        <Text style={estilos.rotuloCampo}>
          Contexto extra (opcional)
        </Text>
        <TextInput
          style={estilos.entradaTextoLongo}
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
        <View style={estilos.containerErroServidor}>
          <Text style={estilos.textoErroServidor}>⚠️ {erro}</Text>
        </View>
      ) : null}

      {/* Botão de Submissão / Geração */}
      <TouchableOpacity
        style={[estilos.botaoGerar, estaGerando && { opacity: 0.6 }]}
        onPress={lidarComEnvio}
        disabled={estaGerando}
        activeOpacity={0.8}
      >
        {estaGerando ? (
          <>
            <ActivityIndicator size="small" color={cores.botoesTexto} />
            <Text style={estilos.textoBotaoGerar}>Gerando estratégia...</Text>
          </>
        ) : (
          <Text style={estilos.textoBotaoGerar}>
            Gerar meu roadmap ➔
          </Text>
        )}
      </TouchableOpacity>

    </View>
  );
}