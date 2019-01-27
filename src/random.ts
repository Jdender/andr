import { Service, Token } from 'typedi';

export const effectToken = new Token('effects');

export const Effect = () => Service({ id: effectToken, multiple: true });
