import { CertificateSection } from "@/components/public/CertificateSection";
import HeadingPage from "@/components/public/HeadingPage";
import { SkillsSection } from "@/components/public/SkillsSection";
import { Button } from "@/components/ui/button";
import { getAllStaticJSON } from "@/lib/public-static";
import Link from "next/link";

export default function HomePage() {
  const title = "Hi, I’m Rahmat Ardiansyah";
  const description =
    "This is my digital garden - a growing collection of notes, experiments, and projects around modern web development and digital tools.";

  const contact = getAllStaticJSON().find(({ slug }) => slug === "Contact");

  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${contact.data.email}&su=${encodeURIComponent(
    "Halo Rahmat - saya mau bikin project"
  )}&body=${encodeURIComponent(
    `Halo,\n\nSaya tertarik membuat project website. Ini sedikit info yang mungkin membantu:\n\n- Nama:\n- Website saat ini (jika ada):\n- Tujuan / target:\n- Preferensi desain / referensi:\n\nBisa kita atur jadwal ngobrol? Terima kasih.\n`
  )}`;

  return (
    <div>
      <HeadingPage title={title} description={description}>
        <div className="mt-4">
          <Button asChild>
            <Link href={gmailHref}>Get in touch</Link>
          </Button>
        </div>
      </HeadingPage>
      <SkillsSection />
      <CertificateSection />
    </div>
  );
}
