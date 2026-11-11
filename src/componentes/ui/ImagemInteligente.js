import React from 'react';
import { ImagemResponsiva } from './ImagemResponsiva';

export function ImagemInteligente({
  fonte,
  src,
  tipoAjuste,
  aoOcorrerErro,
  estiloPersonalizado,
  ...outrasPropriedades
}) {
  return (
    <ImagemResponsiva
      fonte={fonte}
      src={src}
      tipoAjuste={tipoAjuste}
      aoOcorrerErro={aoOcorrerErro}
      estiloPersonalizado={estiloPersonalizado}
      {...outrasPropriedades}
    />
  );
}

export default ImagemInteligente;
