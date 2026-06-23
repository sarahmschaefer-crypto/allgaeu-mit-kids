// app/about/page.tsx — „Über" im Magazin-Stil (wie Detail-View), ohne Bild.
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShapesBar } from '@/components/shapes/ShapesBar'

export const metadata: Metadata = {
  title: 'Über',
  description: 'Wer hinter Allgäu mit Kids steckt – Purista Merk aus dem Westallgäu.',
}

export default function AboutPage() {
  return (
    <div className="shapes-root">
      <ShapesBar />
      <main className="mag fade-in">
        <Link href="/" className="kicker mag-back">
          ← Zurück zur Startseite
        </Link>

        <header className="mag-top">
          <div className="mag-headcol">
            <div className="kicker mag-eyebrow">Über</div>
            <h1 className="mag-headline">
              Hallo, ich bin <span style={{ color: 'var(--brand-purple)' }}>Purista.</span>
            </h1>
          </div>
          <div className="mag-introcol">
            <hr className="mag-hair" />
            <p className="mag-intro">
              Mama von zwei Kindern, Texterin und Social Media Managerin – und durch und durch
              Westallgäuerin.
            </p>
          </div>
        </header>

        <section className="mag-block">
          <div className="mag-prose">
            <p>
              Ich bin Purista und lebe mit meiner Familie im Westallgäu, wo ich auch aufgewachsen
              bin. Nach 13 Jahren außerhalb des Allgäus zog es mich 2022 zurück in meine alte/neue
              Heimat. Ich wollte meiner Tochter und meinem Sohn eine Kindheit im Grünen bieten, mit
              der Nähe zu den Bergen, aber auch zum Bodensee. Hauptberuflich arbeite ich als Texterin
              und Social Media Managerin in einer Markenagentur im Westallgäu, nebenberuflich schreibe
              ich auch für eigene Kunden Blogbeiträge, Website-Texte und mehr, und bei{' '}
              <a href="https://www.instagram.com/allgaeumitkids/" target="_blank" rel="noopener noreferrer">
                @allgaeumitkids
              </a>{' '}
              zeige ich euch unsere schöne Heimat und was sie für euch und eure Kinder zu bieten hat.
              Ich freue mich sehr, vom Ministerium für Wirtschaft, von der IHK und vom Tourismus
              Marketing Baden-Württemberg als Tourismusheldin 2025 ausgezeichnet worden zu sein.
            </p>
          </div>

          <div>
            <h2 className="mag-h2">Random Facts</h2>
            <div className="mag-prose">
              <p>
                Ich bin von Natur aus neugierig, liebe Flohmärkte und Secondhandläden, Lippenstift
                und Wandern schließen sich für mich nicht aus und ich frühstücke leidenschaftlich
                gerne. Ich habe drei Katzen und liebe Elefanten, fahre gerne Auto und singe dabei
                laut. Meine Lieblingsfarbe ist bunt und ich bin sehr kontaktfreudig. Ich bin für
                alles offen, außer für neue Obstsorten. Ich trage oft auf jedem Fingernagel eine
                andere Nagellackfarbe, kann jeden Song der Backstreet Boys mitsingen und würde gerne
                wieder Klavier spielen lernen. Ich kann gut Haare machen und backen, aber Mathe und
                Basteln gehören nicht zu meinen Stärken. Seit etwa zwei Jahren habe ich endlich einen
                grünen Daumen und sammle aus Versehen Pflanzen. Ich lese hauptsächlich Sachbücher,
                möchte aber wieder mehr Romane lesen. Meine Superpower ist es, meinen Kindern gute
                Lunchboxen zuzubereiten.
              </p>
              <p>
                <a href="http://puristamerk.de" target="_blank" rel="noopener noreferrer">
                  puristamerk.de
                </a>
              </p>
            </div>
          </div>

          <p className="mag-credit">
            Diese Website wurde von Sarah Schäfer gestaltet und gebaut, Digital Product Designerin –
            mehr Infos über{' '}
            <a href="https://sarahfordesign.com" target="_blank" rel="noopener noreferrer">
              sarahfordesign.com
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  )
}
