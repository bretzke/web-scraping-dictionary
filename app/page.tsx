"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface DictionaryDataProps {
  word: string;
  synonyms: string[];
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dictionaryData, setDictionaryData] = useState<DictionaryDataProps>({
    word: "",
    synonyms: [],
  });

  async function getWordSynonyms(word: string) {
    setInputValue(word);
    setIsSubmitting(true);

    setDictionaryData({ word, synonyms: [] });

    const response = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({
        word: word,
      }),
    });

    const data = await response.json();

    setDictionaryData((prevState) => ({
      ...prevState,
      synonyms: data.synonyms,
    }));

    setIsSubmitting(false);
  }

  return (
    <section className="p-8 flex flex-col gap-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getWordSynonyms(inputValue);
        }}
      >
        <div className="flex gap-2">
          <Input
            placeholder="Procurar..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit" disabled={isSubmitting || !inputValue.length}>
            <Search />
          </Button>
        </div>
      </form>

      {dictionaryData.word.length > 0 && !isSubmitting && (
        <div className="flex flex-col gap-4">
          {dictionaryData.synonyms.length > 0 && (
            <h3 className="text-2xl">
              Palavra pesquisada: <strong>{dictionaryData.word}</strong>
            </h3>
          )}

          <div className="flex flex-col w-fit">
            <h4 className="text-xl">Sinônimos</h4>
            <hr />
          </div>
          {dictionaryData.synonyms.length > 0 ? (
            <div className="m-auto flex gap-2 flex-wrap">
              {dictionaryData.synonyms.map((synonym) => (
                <Button
                  variant="outline"
                  key={synonym}
                  onClick={() => getWordSynonyms(synonym)}
                >
                  {synonym}
                </Button>
              ))}
            </div>
          ) : (
            <h3 className="text-2xl text-center">
              Nenhum resultado para <strong>{dictionaryData.word}</strong> foi
              encontrado :(
            </h3>
          )}
        </div>
      )}
    </section>
  );
}

