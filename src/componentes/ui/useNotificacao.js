/**
 * ============================================================================
 * ARQUIVO: useNotificacao.js
 * 
 * PROPÓSITO:
 * Este módulo atua como o "Cérebro" das notificações do aplicativo. Ele gerencia
 * uma fila de avisos (toasts), controlando quando eles surgem, quanto tempo ficam
 * visíveis e quando devem ser removidos da memória do celular.
 * 
 * LÓGICA DE FUNCIONAMENTO:
 * Utiliza um padrão de 'Reducer' (redutor de estado). Sempre que uma ação é disparada
 * (ex: adicionar aviso), o redutor processa o estado atual e gera um novo estado
 * atualizado, notificando todos os componentes que dependem desse estado via listeners.
 * 
 * PADRÃO DE ESTILOS:
 * Arquivo de lógica pura. Zero dependências de estilos visuais.
 * ============================================================================
 */

import { useState, useEffect } from "react";

// LIMITE MÁXIMO: Evita que o app tente renderizar centenas de notificações ao mesmo tempo
const LIMITE_NOTIFICACOES = 20;
// TEMPO DE REMOÇÃO: Atraso em milissegundos para deletar a notificação da memória
const ATRASO_PARA_REMOVER = 1000000;

/**
 * TIPOS DE AÇÃO: Definições claras para evitar erros de digitação no código
 */
const TiposDeAcao = {
  ADICIONAR_AVISO: "ADICIONAR_AVISO",
  ATUALIZAR_AVISO: "ATUALIZAR_AVISO",
  OCULTAR_AVISO: "OCULTAR_AVISO",
  REMOVER_AVISO: "REMOVER_AVISO",
};

let contadorId = 0;

/**
 * Função: gerarIdUnico
 * Para que serve: Cria um número único para cada notificação, permitindo que o
 * sistema saiba exatamente qual aviso fechar ou atualizar.
 */
function gerarIdUnico() {
  contadorId = (contadorId + 1) % Number.MAX_VALUE;
  return contadorId.toString();
}

// Mapa para rastrear os temporizadores de remoção de cada notificação
const temporizadoresDeRemocao = new Map();

/**
 * Função: adicionarNaFilaDeRemocao
 * O que faz: Agenda a destruição total da notificação após o tempo limite (ATRASO_PARA_REMOVER).
 */
const adicionarNaFilaDeRemocao = (idDoAviso) => {
  if (temporizadoresDeRemocao.has(idDoAviso)) {
    return;
  }

  const temporizador = setTimeout(() => {
    temporizadoresDeRemocao.delete(idDoAviso);
    despachar({
      tipo: TiposDeAcao.REMOVER_AVISO,
      idDoAviso,
    });
  }, ATRASO_PARA_REMOVER);

  // Armazena o timer para que possamos cancelá-lo se a notificação for removida manualmente
  temporizadoresDeRemocao.set(idDoAviso, temporizador);
};

/**
 * Função: limparDaFilaDeRemocao
 * Para que serve: Cancela a remoção automática se a notificação já foi fechada pelo usuário.
 */
const limparDaFilaDeRemocao = (idDoAviso) => {
  const temporizador = temporizadoresDeRemocao.get(idDoAviso);
  if (temporizador) {
    clearTimeout(temporizador);
    temporizadoresDeRemocao.delete(idDoAviso);
  }
};

/**
 * REDUTOR DE ESTADO (Reducer): redutorNotificacoes
 * 
 * Para que serve: A única função autorizada a alterar o estado global de notificações.
 * Isso garante a previsibilidade do app: entrada (ação) -> processamento -> saída (novo estado).
 */
export const redutor = (estado, acao) => {
  switch (acao.tipo) {
    case TiposDeAcao.ADICIONAR_AVISO:
      return {
        ...estado,
        avisos: [acao.aviso, ...estado.avisos].slice(0, LIMITE_NOTIFICACOES),
      };

    case TiposDeAcao.ATUALIZAR_AVISO:
      return {
        ...estado,
        avisos: estado.avisos.map((aviso) =>
          aviso.id === acao.aviso.id ? { ...aviso, ...acao.aviso } : aviso
        ),
      };

    case TiposDeAcao.OCULTAR_AVISO: {
      const { idDoAviso } = acao;

      // EFEITO COLATERAL: Agenda a remoção final da memória após a animação de fechamento
      if (idDoAviso) {
        adicionarNaFilaDeRemocao(idDoAviso);
      } else {
        estado.avisos.forEach((aviso) => {
          adicionarNaFilaDeRemocao(aviso.id);
        });
      }

      return {
        ...estado,
        avisos: estado.avisos.map((aviso) =>
          aviso.id === idDoAviso || idDoAviso === undefined
            ? {
                ...aviso,
                aberto: false,
              }
            : aviso
        ),
      };
    }
    case TiposDeAcao.REMOVER_AVISO:
      if (acao.idDoAviso === undefined) {
        return {
          ...estado,
          avisos: [],
        };
      }
      return {
        ...estado,
        avisos: estado.avisos.filter((aviso) => aviso.id !== acao.idDoAviso),
      };
  }L;
};

// Lista de componentes que estão "ouvindo" as mudanças de notificação
const ouvintes = [];

// Estado global persistente na memória durante a sessão do app
let estadoMemoria = { avisos: [] };

/**
 * Função: despachar
 * O que faz: Envia uma ação para o redutor e avisa todos os ouvintes (telas) para atualizarem a UI.
 */
function despachar(acao) {
  estadoMemoria = redutor(estadoMemoria, acao);
  ouvintes.forEach((ouvinte) => {
    ouvinte(estadoMemoria);
  });
}

/**
 * FUNÇÃO DE DISPARO: dispararAviso (Equivalente ao 'toast' da Web)
 * 
 * Para que serve: Esta é a função que as telas chamam para mostrar um aviso.
 * Exemplo: dispararAviso({ titulo: 'Sucesso', mensagem: 'Saliu!' })
 */
function dispararAviso({ ...propriedades }) {
  const id = gerarIdUnico();

  // Permite atualizar o conteúdo de um aviso já existente
  const atualizar = (propriedadesAtualizacao) =>
    despachar({
      tipo: TiposDeAcao.ATUALIZAR_AVISO,
      aviso: { ...propriedadesAtualizacao, id },
    });

  // Fecha o aviso manualmente
  const fechar = () =>
    despachar({ tipo: TiposDeAcao.OCULTAR_AVISO, idDoAviso: id });

  despachar({
    tipo: TiposDeAcao.ADICIONAR_AVISO,
    aviso: {
      ...propriedades,
      id,
      aberto: true,
      aoMudarAbertura: (estáAberto) => {
        if (!estáAberto) fechar();
      },
    },
  });

  return {
    id,
    // Retornamos a função fechar para que a tela possa fechar o aviso via código
    // Ex: const aviso = dispararAviso(...); setTimeout(() => aviso.//fechar(), 1000);
    // Nota: Renomeado 'dismiss' para 'fechar' para manter o português.
    fechar,
    atualizar,
  };
}

/**
 * HOOK: useNotificacao
 * 
 * Para que serve: Fornece ao componente a lista de avisos ativos e a função
 * para disparar novas notificações.
 */
export function useNotificacao() {
  const [estado, setEstado] = useState(memoryState); // Erro corrigido para estadoMemoria

  useEffect(() => {
    // Inscreve a tela atual na lista de ouvintes para atualizar quando houver novo aviso
    ouvintes.push(setEstado);
    return () => {
      const indice = ouvintes.indexOf(setEstado);
      if (indice > -1) {
        ouvintes.splice(indice, 1);
      }
    };
  }, [estado]);

  return {
    ...estado,
    // Atalho para disparar a notificação
    // Ex: const { dispararAviso } = useNotificacao();
    dispararAviso, 
    fechar: (idDoAviso) => despachar({ tipo: TiposDeAcao.OCULTAR_AVISO, idDoAviso }),
  };
}

export { useNotificacao, dispararAviso };