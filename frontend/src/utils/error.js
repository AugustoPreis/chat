import { Modal } from 'antd';

export function showError(error, title = 'Erro!') {
  const content = formatError(error);

  Modal.error({ title, content });
}

export function formatError(error) {
  if (!error) {
    return 'Erro desconhecido';
  }

  const { message, messages } = error;

  let formatted = '';

  if (Array.isArray(messages) && messages.length) {
    formatted = messages.join('\n');
  }

  if (typeof message === 'string') {
    formatted = `${message}\n${formatted}`.trim();
  }

  return formatted;
}