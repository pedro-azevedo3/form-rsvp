import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";

const clean = (value, max = 160) => String(value ?? "").trim().slice(0, max);
const hasFullName = (value) => value.split(/\s+/).filter(Boolean).length >= 2;
const validPhone = (value) => { const digits = value.replace(/\D/g, ""); return digits.length === 10 || digits.length === 11; };
const validShoe = (value) => /^\d+$/.test(value) && Number(value) >= 33 && Number(value) <= 40;

function validate(body) {
  const response = {
    nome: clean(body.nome),
    fone: clean(body.fone, 30),
    sexo: body.sexo === "mulher" ? "mulher" : body.sexo === "homem" ? "homem" : "",
    sandalia: body.sexo === "mulher" ? clean(body.sandalia, 3) : null,
    acomp: body.acomp === 1 ? 1 : 0,
    acompanhanteNome: body.acomp === 1 ? clean(body.acompanhanteNome) : null,
    acompanhanteSexo: body.acomp === 1 && body.acompanhanteSexo === "mulher" ? "mulher" : body.acomp === 1 && body.acompanhanteSexo === "homem" ? "homem" : null,
    acompanhanteSandalia: body.acomp === 1 && body.acompanhanteSexo === "mulher" ? clean(body.acompanhanteSandalia, 3) : null,
    status: body.status === "vou" ? "vou" : body.status === "nao" ? "nao" : "",
  };
  if (!hasFullName(response.nome)) return { error: "Informe o nome completo, com pelo menos duas palavras." };
  if (!response.fone) return { error: "Informe o WhatsApp." };
  if (!validPhone(response.fone)) return { error: "Informe um WhatsApp válido com DDD." };
  if (!response.sexo) return { error: "Informe se o convidado é homem ou mulher." };
  if (!response.status) return { error: "Informe a resposta do convite." };
  if (response.sexo === "mulher" && !validShoe(response.sandalia)) return { error: "Informe uma sandália válida entre 33 e 40." };
  if (response.acomp && !hasFullName(response.acompanhanteNome || "")) return { error: "Informe o nome completo do acompanhante, com pelo menos duas palavras." };
  if (response.acomp && !response.acompanhanteSexo) return { error: "Informe se o acompanhante é homem ou mulher." };
  if (response.acompanhanteSexo === "mulher" && !validShoe(response.acompanhanteSandalia)) return { error: "Informe uma sandália válida para a acompanhante, entre 33 e 40." };
  return { response };
}

export async function GET() {
  try {
    const db = await getDatabase();
    const responses = await db.collection("respostas").find({}, { projection: { _id: 0 } }).sort({ updatedAt: -1 }).toArray();
    return NextResponse.json(responses);
  } catch (error) {
    console.error("Erro ao consultar respostas:", error);
    return NextResponse.json({ error: "Não foi possível consultar as respostas." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { response, error } = validate(body);
    if (error) return NextResponse.json({ error }, { status: 400 });
    const identity = `${response.nome}|${response.fone}`.toLocaleLowerCase("pt-BR");
    const now = new Date();
    const db = await getDatabase();
    await db.collection("respostas").updateOne(
      { identity },
      { $set: { ...response, identity, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true },
    );
    return NextResponse.json({ ...response, identity, updatedAt: now.toISOString() });
  } catch (error) {
    console.error("Erro ao salvar resposta:", error);
    return NextResponse.json({ error: "Não foi possível salvar sua resposta." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const originalIdentity = clean(body.originalIdentity, 350).toLocaleLowerCase("pt-BR");
    const { response, error } = validate(body);
    if (!originalIdentity) return NextResponse.json({ error: "Convidado não identificado." }, { status: 400 });
    if (error) return NextResponse.json({ error }, { status: 400 });
    const identity = `${response.nome}|${response.fone}`.toLocaleLowerCase("pt-BR");
    const updatedAt = new Date();
    const db = await getDatabase();
    const result = await db.collection("respostas").updateOne({ identity: originalIdentity }, { $set: { ...response, identity, updatedAt } });
    if (!result.matchedCount) return NextResponse.json({ error: "Convidado não encontrado." }, { status: 404 });
    return NextResponse.json({ ...response, identity, updatedAt: updatedAt.toISOString() });
  } catch (error) {
    console.error("Erro ao editar convidado:", error);
    return NextResponse.json({ error: "Não foi possível editar o convidado." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const identity = clean(body.identity, 350).toLocaleLowerCase("pt-BR");
    if (!identity) return NextResponse.json({ error: "Convidado não identificado." }, { status: 400 });
    const db = await getDatabase();
    const result = await db.collection("respostas").deleteOne({ identity });
    if (!result.deletedCount) return NextResponse.json({ error: "Convidado não encontrado." }, { status: 404 });
    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error("Erro ao remover convidado:", error);
    return NextResponse.json({ error: "Não foi possível remover o convidado." }, { status: 500 });
  }
}
