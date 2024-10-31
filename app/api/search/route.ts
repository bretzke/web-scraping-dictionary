import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

const SPACE_STRING = " ";
const DICTIONARY_BASE_URL = "https://dicionariocriativo.com.br";

export async function POST(req: NextRequest) {
  const word = ((await req.json())?.word as string).toLowerCase();
  const response = await fetch(
    `${DICTIONARY_BASE_URL}/${word.replaceAll(SPACE_STRING, "_")}`
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const synonyms: string[] = [];

  $("section#analogico ul li").each((_, element) => {
    const text = $(element).text();

    if (text !== word) {
      synonyms.push(text);
    }
  });

  return NextResponse.json({ synonyms });
}
