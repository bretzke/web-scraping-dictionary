"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MeaningsProps } from "@/interfaces/Meanings";
import { Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

interface DictionaryDataProps {
  word: string;
  relatedWords: string[];
  meanings: MeaningsProps[];
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dictionaryData, setDictionaryData] = useState<DictionaryDataProps>({
    word: "",
    relatedWords: [],
    meanings: [],
  });

  async function getRelatedWords(word: string) {
    setInputValue(word);
    setIsSubmitting(true);

    setDictionaryData({ word, relatedWords: [], meanings: [] });

    const response = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({
        word: word,
      }),
    });

    const data = await response.json();

    setDictionaryData((prevState) => ({
      ...prevState,
      relatedWords: data.relatedWords,
      meanings: data.meanings,
    }));

    setIsSubmitting(false);
  }

  const hasData = useMemo(() => {
    return (
      (dictionaryData.relatedWords.length > 0 ||
        dictionaryData.meanings.length > 0) &&
      !isSubmitting
    );
  }, [
    dictionaryData.relatedWords.length,
    isSubmitting,
    dictionaryData.meanings.length,
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2 items-center">
        <Image
          src="/images/brazil-flag.svg"
          width={50}
          height={50}
          alt="Brazil flag"
        />
        <h1 className="text-3xl font-bold">Dicionário Português</h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getRelatedWords(inputValue);
        }}
      >
        <div className="flex gap-2">
          <Input
            placeholder="Procurar uma palavra..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit" disabled={isSubmitting || !inputValue.length}>
            <Search />
          </Button>
        </div>
      </form>

      {hasData && (
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl">
            Palavra pesquisada: <strong>{dictionaryData.word}</strong>
          </h3>

          <div className="flex gap-4 max-md:flex-col">
            <section className="flex flex-col gap-4 w-1/2 max-md:w-full">
              <div className="flex flex-col w-fit mx-auto">
                <h4 className="text-xl">
                  Significado de {dictionaryData.word}
                </h4>
                <hr className="border-black" />
              </div>

              <div>
                {dictionaryData.meanings.length > 0 ? (
                  dictionaryData.meanings.map((meaning) => (
                    <div key={meaning.label}>
                      <h5 className="italic font-bold">{meaning.label}</h5>
                      {meaning.classifications.map((classification) => (
                        <p key={classification}>{classification}</p>
                      ))}
                    </div>
                  ))
                ) : (
                  <h5 className="text-center font-semibold">
                    Nenhum resultado foi encontrado.
                  </h5>
                )}
              </div>
            </section>

            <section className="flex flex-col gap-4 w-1/2 max-md:w-full">
              <div className="flex flex-col w-fit mx-auto">
                <h4 className="text-xl">Palavras relacionadas</h4>
                <hr className="border-black" />
              </div>
              {dictionaryData.relatedWords.length > 0 ? (
                <div className="mx-auto flex gap-2 flex-wrap">
                  {dictionaryData.relatedWords.map((relatedWord) => (
                    <Button
                      variant="outline"
                      key={relatedWord}
                      onClick={() => getRelatedWords(relatedWord)}
                    >
                      {relatedWord}
                    </Button>
                  ))}
                </div>
              ) : (
                <h5 className="font-semibold text-center">
                  Nenhum resultado foi encontrado.
                </h5>
              )}
            </section>
          </div>
        </div>
      )}

      {!hasData && dictionaryData.word.length > 0 && !isSubmitting && (
        <h3 className="text-2xl text-center">
          Nenhum resultado para <strong>{dictionaryData.word}</strong> foi
          encontrado :(
        </h3>
      )}
    </div>
  );
}

