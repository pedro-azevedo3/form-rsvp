import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";

const clean = (value, max = 160) => String(value ?? "").trim().slice(0, max);

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
  if (response.nome.length < 2 || !response.sexo || !response.status) return { error: "Preencha os dados obrigatórios." };
  if (response.sexo === "mulher" && !response.sandalia) return { error: "Informe o tamanho da sandália." };
  if (response.acomp && (!response.acompanhanteNome || !response.acompanhanteSexo)) return { error: "Informe o nome e o sexo do acompanhante." };
  if (response.acompanhanteSexo === "mulher" && !response.acompanhanteSandalia) return { error: "Informe o tamanho da sandália da acompanhante." };
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
