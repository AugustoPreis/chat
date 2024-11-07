import { message } from 'antd';

export function copiar(texto) {
  navigator.clipboard.writeText(texto);
  message.success('Texto copiado para a área de transferência!');
}