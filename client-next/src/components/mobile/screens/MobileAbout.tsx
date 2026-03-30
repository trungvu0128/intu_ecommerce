'use client';

import MobileLayout from '@/components/mobile/MobileLayout';

const InfinitySymbol = () => (
  <svg 
    width="100" 
    height="50" 
    viewBox="0 0 120 60" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginBottom: 40 }}
  >
    <path
      d="M60 30C75 45 95 55 105 45C115 35 105 15 90 15C75 15 65 25 60 30M60 30C45 15 25 5 15 15C5 25 15 45 30 45C45 45 55 35 60 30"
      stroke="black"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default function MobileAbout() {
  return (
    <MobileLayout>
      <div style={{
        padding: '60px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#fff',
        color: '#000'
      }}>
        <InfinitySymbol />
        
        <h1 style={{
          fontSize: 18,
          fontWeight: 400,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 48
        }}>
          &quot;ABOUT US&quot;
        </h1>

        <div style={{
          maxWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          fontSize: 11,
          lineHeight: 1.8,
          letterSpacing: '0.05em',
          fontWeight: 300,
          color: '#333'
        }}>
          <p>WE WERE BORN FROM PURE DREAMS, WHERE FREEDOM HAS NO BOUNDARIES.</p>
          <p>WHERE YOUNG SOULS ARE BOTH FRAGILE AND YEAGER TO BREAK THE MOLD.</p>
          <p>FOR US, FASHION IS NOT TO HIDE, BUT TO REVEAL.</p>
          <p>NOT TO FORCE YOURSELF TO STAND OUT, BUT TO BE YOURSELF - NATURALLY DIFFERENT.</p>
          <p>EACH DESIGN IS A PLAY BETWEEN LIGHT AND REBELLION:</p>
          <p>PURE, YET BOLD CUTS.<br/>
          CLEAR DETAILS, YET NOT NAIVE.<br/>
          A BLEND OF THE SWEETNESS OF AN ANGEL AND THE STRENGTH OF A REBEL.</p>
          <p>WE BELIEVE THAT THE MOST BEAUTIFUL REBELLION IS NOT SCREAMING, BUT WHEN YOU DARE TO QUIETLY SHINE IN YOUR OWN WAY.</p>
          <p>WHEN YOU WEAR IT, IT IS NOT JUST CLOTHES BUT WINGS TO FLY, AND A DECLARATION TO BE DIFFERENT.</p>
        </div>

        <div style={{ margin: '60px 0' }}>
          <span style={{
            background: '#000',
            color: '#fff',
            padding: '8px 24px',
            fontSize: 10,
            letterSpacing: '0.2em',
            fontWeight: 500,
            textTransform: 'uppercase'
          }}>
            OUR MISSION
          </span>
        </div>

        <div style={{
          maxWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          fontSize: 11,
          lineHeight: 1.8,
          letterSpacing: '0.05em',
          fontWeight: 300,
          color: '#333'
        }}>
          <p>TO BE AN ASIAN FASHION BRAND WITH A MODERN REBELLIOUS SPIRIT, WHERE BOLDNESS AND PRACTICALITY INTERSECT.</p>
          <p>TO AFFIRM THE LIFESTYLE OF A DISTINCT GENERATION.</p>
          <p>PRODUCT DESIGN BALANCES BETWEEN PRACTICALITY (CAN BE WORN EVERY DAY) AND STATEMENT ELEMENTS (MAKE A DIFFERENCE WHEN APPEARING).</p>
          <p>EMPOWERING VIETNAMESE AND ASIAN YOUTH WITH CONFIDENCE THROUGH FASHION.</p>
          <p>TURNING CLOTHES INTO A LANGUAGE TO TELL PERSONAL STORIES.</p>
          <p>EXPLOITING LOCAL CULTURAL VALUES AND IDENTITIES AND THEN REPRODUCING THEM IN INTERNATIONAL LANGUAGES, TO BRING VIETNAMESE BRAND IMAGES INTO THE GLOBAL FLOW.</p>
          <p>COMMITTING TO SUSTAINABILITY IN MATERIALS AND PRODUCTION, AIMING FOR A LONG-TERM BUSINESS MODEL.</p>
        </div>
      </div>
    </MobileLayout>
  );
}
