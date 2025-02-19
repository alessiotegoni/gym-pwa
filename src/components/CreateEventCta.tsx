import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle } from "lucide-react";

export default function CreateEventCta() {
  return (
    <Card className="flex flex-col justify-center items-center bg-secondary">
      <CardHeader>
        <CardTitle className="flex flex-col justify-center items-center gap-4">
          <AlertCircle size={60} />
          <h3 className="text-xl text-muted-foreground">
            Non hai ancora creato un evento
          </h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/admin/events/create">Crea il tuo primo evento</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
