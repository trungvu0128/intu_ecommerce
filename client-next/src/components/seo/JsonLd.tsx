const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://intuoo.com';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'INTU∞',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  description: 'Premium Vietnamese streetwear brand offering curated collections of jackets, bombers, and modern rebel fashion.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+84-931-202-22',
    contactType: 'customer service',
    email: 'intuoo@gmail.com',
    availableLanguage: ['English', 'Vietnamese'],
  },
  sameAs: [],
};

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'INTU∞',
  url: BASE_URL,
  description: 'Premium Streetwear & High Fashion from Vietnam',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/category/shop-all?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const storeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'INTU∞',
  url: BASE_URL,
  description: 'Shop premium Vietnamese streetwear – jackets, bombers, denim & modern rebel fashion.',
  currenciesAccepted: 'VND',
  priceRange: '$$',
  hasMerchantReturnPolicy: {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'VN',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 7,
  },
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
    </>
  );
}
