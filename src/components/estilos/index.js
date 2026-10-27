// components/estilos/index.js
import { StyleSheet } from 'react-native';
import { cores } from '../cores'; // Importa do arquivo de cores traduzido

export const estilos = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: cores.bkprincipal,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  areaTitulo: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.titulos,
    textAlign: 'center',
  },
  textoDescricao: {
    fontSize: 14,
    color: cores.descricao,
    textAlign: 'center',
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.botoesTexto,
    textAlign: 'center',
  },
  botaoConfirmar: {
    height: 48,
    width: '100%',
    backgroundColor: cores.confirmar,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: cores.bordaBotao,
    borderWidth: 1,
    marginVertical: 8,
  },
  
  // Estilos específicos para o Grupo de Escolha (GrupoDeEscolha)
  grupoEscolhaRotulo: {
    marginBottom: 8,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: cores.descricao,
    fontWeight: '600',
  },
  grupoEscolhaContainerOpcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  grupoEscolhaVarianteCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
    minWidth: '30%',
  },
  grupoEscolhaVariantePill: {
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  grupoEscolhaBotaoInativo: {
    borderColor: cores.bordaInput,
    backgroundColor: cores.bksecundario,
  },
  grupoEscolhaBotaoAtivo: {
    borderColor: cores.bordaEspecial,
    backgroundColor: 'rgba(0, 161, 156, 0.15)',
    borderWidth: 1.5,
  },
  grupoEscolhaRotuloOpcao: {
    fontSize: 14,
    fontWeight: '500',
    color: cores.textoComum,
  },
  grupoEscolhaTextoAtivo: {
    color: cores.titulos,
  },
  grupoEscolhaDicaOpcao: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    color: cores.descricao,
  },
  grupoEscolhaTextoDicaAtivo: {
    color: cores.textoComum,
  },
});