import {getRequestConfig} from 'next-intl/server';
import { headers} from 'next/headers';

export default getRequestConfig(async () => {
  const acceptLanguage = (await headers()).get('accept-language');
  const locale =  acceptLanguage?.split(',')[0] || 'vi';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

