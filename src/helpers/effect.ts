import { Service, Token } from 'typedi';

export const effectToken = new Token('effects');

// Used to start up services on init
export const Effect = () => Service({ id: effectToken, multiple: true });
