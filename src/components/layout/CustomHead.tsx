import Head from 'next/head';

interface CustomHeadProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
}

const CustomHead = ({
  title = 'KIN',
  description = 'KIN 공연 예매 사이트입니다.',
  ogTitle,
  ogDescription,
  ogUrl = 'https://kin-booking.vercel.app',
  ogImage = 'https://kin-booking.vercel.app/images/logo_normal.png',
  ogImageAlt = 'KIN 공연 예매'
}: CustomHeadProps) => {
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta name="description" content={description}/>
      <meta name="robots" content="index, follow"/>

      {/* Open Graph */}
      <meta property="og:title" content={finalOgTitle}/>
      <meta property="og:description" content={finalOgDescription}/>
      <meta property="og:type" content="website"/>
      <meta property="og:url" content={ogUrl}/>
      <meta property="og:site_name" content="KIN"/>
      <meta property="og:image" content={ogImage}/>
      <meta property="og:image:width" content="1200"/>
      <meta property="og:image:height" content="630"/>
      <meta property="og:image:alt" content={ogImageAlt}/>
      <meta property="og:locale" content="ko_KR"/>
      <meta property="og:image:type" content="image/png"/>
      <meta property="og:image:secure_url" content={ogImage}/>

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content={finalOgTitle}/>
      <meta name="twitter:description" content={finalOgDescription}/>
      <meta name="twitter:image" content={ogImage}/>

      {/* Favicon & App Icons */}
      <link rel="apple-touch-icon" sizes="57x57" href="/fabicon/apple-icon-57x57.png"/>
      <link rel="apple-touch-icon" sizes="60x60" href="/fabicon/apple-icon-60x60.png"/>
      <link rel="apple-touch-icon" sizes="72x72" href="/fabicon/apple-icon-72x72.png"/>
      <link rel="apple-touch-icon" sizes="76x76" href="/fabicon/apple-icon-76x76.png"/>
      <link rel="apple-touch-icon" sizes="114x114" href="/fabicon/apple-icon-114x114.png"/>
      <link rel="apple-touch-icon" sizes="120x120" href="/fabicon/apple-icon-120x120.png"/>
      <link rel="apple-touch-icon" sizes="144x144" href="/fabicon/apple-icon-144x144.png"/>
      <link rel="apple-touch-icon" sizes="152x152" href="/fabicon/apple-icon-152x152.png"/>
      <link rel="apple-touch-icon" sizes="180x180" href="/fabicon/apple-icon-180x180.png"/>
      <link rel="icon" type="image/png" sizes="192x192" href="/fabicon/android-icon-192x192.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/fabicon/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="96x96" href="/fabicon/favicon-96x96.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/fabicon/favicon-16x16.png"/>
      <link rel="manifest" href="/fabicon/manifest.json"/>
      <meta name="msapplication-TileColor" content="#ffffff"/>
      <meta name="msapplication-TileImage" content="/fabicon/ms-icon-144x144.png"/>
      <meta name="theme-color" content="#ffffff"/>
    </Head>
  );
};

export default CustomHead; 