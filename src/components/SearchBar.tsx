"use client";

import SubmitBtn from "./SubmitBtn";
import { Input } from "./ui/input";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetFilterBtn from "./ResetFilterBtn";

type Props = { search?: string; placeholder?: string };

export default function SearchBar({
  search = "",
  placeholder = "Cerca utente",
}: Props) {
  const [input, setInput] = useState(search);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input) return;

    params.set("search", input);
    router.replace(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="search-user flex gap-1 mt-4 mb-3">
      <Input
        type="text"
        placeholder={placeholder}
        className="font-medium h-10"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <SubmitBtn
        label="Cerca"
        className="max-w-[80px] h-10"
        disabled={!input}
      />
      <ResetFilterBtn
        paramName="search"
        input={input}
        onReset={() => setInput("")}
      />
    </form>
  );
}
