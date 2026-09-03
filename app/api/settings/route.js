import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";

const defaults = {
  totalConvites: 18,
  mensagemWhatsApp: "Você foi muito importante para que eu chegasse até aqui! Quero celebrar essa conquista com você. Confirme sua presença na minha formatura: https://guilherme-henrique-direito.up.railway.app/",
};

export async function GET() {
  try {
    const db = await getDatabase();
    const settings = await db.collection("configuracoes").findOne({ key: "principal" }, { projection: { _id: 0, key: 0 } });
    return NextResponse.json({ ...defaults, ...settings });
  } catch (error) {
    console.error("Erro ao consultar configurações:", error);
    return NextResponse.json(defaults);
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const update = {};
    if (Number.isInteger(body.totalConvites) && body.totalConvites >= 0 && body.totalConvites <= 400) update.totalConvites = body.totalConvites;
    if (typeof body.mensagemWhatsApp === "string" && body.mensagemWhatsApp.trim()) update.mensagemWhatsApp = body.mensagemWhatsApp.trim().slice(0, 1000);
    const db = await getDatabase();
    await db.collection("configuracoes").updateOne({ key: "principal" }, { $set: { ...update, updatedAt: new Date() }, $setOnInsert: { key: "principal" } }, { upsert: true });
    return NextResponse.json(update);
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return NextResponse.json({ error: "Não foi possível salvar as configurações." }, { status: 500 });
  }
}
