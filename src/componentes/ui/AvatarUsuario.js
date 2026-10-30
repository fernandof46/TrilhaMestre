import React, { createContext, useContext, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { estilos } from './estilos';

// Contexto para avisar o Fallback caso a imagem quebre ou não exista
const ContextoAvatar = createContext({
  imagemCarregouComSucesso: false,
  setImagemCarregouComSucesso: () => {},
});

/**
 * COMPONENTE RAIZ: AvatarUsuario (Avatar)
 * Caixa circular base do avatar.
 */
export function AvatarUsuario({ children, style, ...props }) {
  const [imagemCarregouComSucesso, setImagemCarregouComSucesso] = useState(false);

  return (
    <ContextoAvatar.Provider
      value={{ imagemCarregouComSucesso, setImagemCarregouComSucesso }}
    >
      <View style={[estilos.avatarContainer, style]} {...props}>
        {children}
      </View>
    </ContextoAvatar.Provider>
  );
}

/**
 * COMPONENTE IMAGEM: AvatarImagem (AvatarImage)
 * Renderiza a foto do usuário da rede ou local.
 */
export function AvatarImagem({ src, source, style, ...props }) {
  const { setImagemCarregouComSucesso } = useContext(ContextoAvatar);
  const fonte = source || (src ? { uri: src } : null);

  if (!fonte) return null;

  return (
    <Image
      source={fonte}
      style={[{ width: '100%', height: '100%' }, style]}
      onLoad={() => setImagemCarregouComSucesso(true)}
      onError={() => setImagemCarregouComSucesso(false)}
      {...props}
    />
  );
}

/**
 * COMPONENTE FALLBACK: AvatarFallback (AvatarFallback)
 * Exibido quando a imagem ainda está carregando ou falhou (ex: mostra as iniciais "FB").
 */
export function AvatarFallback({ children, style, ...props }) {
  const { imagemCarregouComSucesso } = useContext(ContextoAvatar);

  // Se a imagem carregou perfeitamente, oculta o fallback
  if (imagemCarregouComSucesso) return null;

  return (
    <View
      style={[
        {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={estilos.avatarTextoFallback}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

// Aliases em inglês para manter 100% de compatibilidade
export const Avatar = AvatarUsuario;
export const AvatarImage = AvatarImagem;
export const AvatarFallback = AvatarFallback;