import morgan from 'morgan';

export const requestLogger = morgan(function(tokens, req, res){
  const userId = (req as any).user?.id ?? '-';
  return [
    tokens.method?.(req, res),
    tokens.url?.(req, res),
    tokens.status?.(req, res),
    tokens['response-time']?.(req, res), 'ms',
    'user:', userId,
    '@', new Date().toISOString()
  ].join(' ');
});