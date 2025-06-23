import {getRequestConfig} from 'next-intl/server';
import { headers} from 'next/headers';

export default getRequestConfig(async () => {
  const acceptLanguage = (await headers()).get('accept-language');
  let locale = 'vi';
  if (acceptLanguage) {
    const firstLang = acceptLanguage.split(',')[0].toLowerCase();
    if (firstLang.startsWith('vi')) {
      locale = 'vi';
    } else if (firstLang.startsWith('en')) {
      locale = 'en-US';
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

