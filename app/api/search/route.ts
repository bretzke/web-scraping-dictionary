import { MeaningsProps } from "@/interfaces/Meanings";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

const SPACE_STRING = " ";

enum Dictionaries {
  RELATED_WORDS = "https://dicionariocriativo.com.br",
  MEANINGS = "https://www.dicio.com.br",
}

export async function POST(req: NextRequest) {
  const word = ((await req.json())?.word as string).toLowerCase();
  const [relatedWordsResponse, meaningsAndDefinitionsResponse] =
    await Promise.all([
      fetch(
        `${Dictionaries.RELATED_WORDS}/${word.replaceAll(SPACE_STRING, "_")}`
      ),
      fetch(
        `${Dictionaries.MEANINGS}/${word
          .replaceAll(SPACE_STRING, "-")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")}`
      ),
    ]);

  if (!relatedWordsResponse.ok && !meaningsAndDefinitionsResponse.ok) {
    throw new Error(`Response status: ${relatedWordsResponse.status}`);
  }

  const [relatedWordsHtml, meaningsAndDefinitionsHtml] = await Promise.all([
    relatedWordsResponse.text().then((response) => cheerio.load(response)),
    meaningsAndDefinitionsResponse
      .text()
      .then((response) => cheerio.load(response)),
  ]);

  const relatedWords: string[] = [];
  const meanings: MeaningsProps[] = [];

  relatedWordsHtml("section#analogico ul li").each((_, element) => {
    const text = relatedWordsHtml(element).text();

    if (text !== word) {
      relatedWords.push(text);
    }
  });

  let lastClassification = "";
  meaningsAndDefinitionsHtml("p.significado span").each((_, element) => {
    const isClassification = meaningsAndDefinitionsHtml(element).hasClass("cl");
    const text = meaningsAndDefinitionsHtml(element).text();

    if (isClassification) {
      meanings.push({ label: text, classifications: [] });
      lastClassification = text;
      return;
    }

    const classification = meanings.find(
      (meaning) => meaning.label === lastClassification
    );

    classification?.classifications.push(text);
  });

  return NextResponse.json({ relatedWords, meanings });
}
