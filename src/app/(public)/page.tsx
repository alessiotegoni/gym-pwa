import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Dumbbell, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col space-y-8 pb-16">
      {/* Hero Section */}
      <section
        className="relative h-[300px] flex items-center justify-center  xl:rounded-br-xl xl:rounded-bl-xl
      overflow-hidden"
      >
        <Image
          src="https://cyan-tropical-guanaco-792.mypinata.cloud/ipfs/bafkreidu5kwiizafpajpctmxci2tvpsdqinjhqnejeb3gm7kqbzpq2kzba"
          alt="School of tabata"
          fill
          className="aspect-video object-cover"
        />
        {/* <div
          className="absolute inset-0 bg-black dark:bg-opacity-50 flex items-center justify-center
        xl:rounded-br-xl xl:rounded-bl-xl"
        >
          <h1 className="text-4xl font-bold text-white text-center">
            Benvenuti a Tabata
          </h1>
        </div> */}
      </section>

      {/* About Section */}
      <section className="px-4">
        <h2 className="text-2xl font-semibold mb-4">Chi Siamo</h2>
        <p className="dark:text-slate-300">
          Tabata è il luogo perfetto per raggiungere i tuoi obiettivi di
          fitness. Con attrezzature all'avanguardia e istruttori esperti, ti
          aiuteremo a trasformare il tuo corpo e la tua mente.
        </p>
      </section>

      {/* Features Section */}
      <section className="px-4">
        <h2 className="text-2xl font-semibold mb-4">I Nostri Servizi</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Dumbbell, title: "Attrezzature Moderne" },
            { icon: Clock, title: "Orari Flessibili" },
            { icon: CheckCircle, title: "Istruttori Qualificati" },
            { icon: Calendar, title: "Classi Varie" },
          ].map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col lg:p-10 items-center p-4"
            >
              <feature.icon className="size-8 dark:text-primary mb-2 lg:size-12" />
              <h3 className="text-sm lg:text-base font-medium text-center">
                {feature.title}
              </h3>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4">
        <h2 className="text-2xl font-semibold mb-4">Abbonamenti</h2>
        <Card>
          <CardHeader>
            <CardTitle>Abbonamento Mensile</CardTitle>
            <CardDescription>
              Accesso illimitato a tutti i servizi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">€50/mese</p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full
             font-bold"
              asChild
            >
              <Link href="/sign-up">Iscriviti Ora</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      {/* Trial Period Section */}
      <section className="px-4">
        <h2 className="text-2xl font-semibold mb-4">Periodo di Prova</h2>
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Prova Gratuita</CardTitle>
            <CardDescription>Sperimenta Tabata senza impegno</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <p className="">
              Offriamo un periodo di prova di 7 giorni per farti conoscere la
              nostra palestra e i nostri servizi.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/sign-up?trial=true">Richiedi Prova Gratuita</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
