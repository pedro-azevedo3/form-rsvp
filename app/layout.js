import "./globals.css";

export const metadata = {
  title: "Formatura 2026 — Guilherme Henrique",
  description: "Confirmação de presença para a formatura de Guilherme Henrique em Direito.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
