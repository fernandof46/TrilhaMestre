import React from 'react';
import { View } from 'react-native';

/**
 * COMPONENTE: ProporcaoTela (Substituto do AspectRatio)
 * 
 * Finalidade: Garante que vídeos, imagens ou cards mantenham uma proporção
 * fixa (ex: 16/9, 4/3, 1/1) independente do tamanho da tela do celular.
 * 
 * @param {number} ratio - A proporção desejada (ex: 16/9, 4/3, 1). Padrão: 16/9.
 * @param {object} style - Estilos extras passados pelo componente pai.
 */
export default function ProporcaoTela({ ratio = 16 / 9, children, style, ...props }) {
  return (
    <View
      style={[
        {
          width: '100%',
          aspectRatio: ratio,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

// Alias em inglês para manter 100% de compatibilidade com imports legados
export const AspectRatio = ProporcaoTela;