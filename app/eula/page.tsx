import React from "react";

export const metadata = {
  title: "Termos de Uso - SEINFRA Parnaíba",
  description: "Leia os termos de uso do sistema SEINFRA Parnaíba.",
};

export default function TermsPage() {
  return (
    <main className="p-6 font-sans text-gray-900 dark:text-white dark:bg-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Termos de Uso</h1>
      <p className="mb-4">
        Ao utilizar este sistema, você concorda com os seguintes termos de uso. Caso não concorde, recomendamos que interrompa o uso deste sistema imediatamente.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Objetivo</h2>
      <p className="mb-4">
        Este sistema foi desenvolvido para facilitar a consulta de dados da SINAPI-PI, utilizando palavras-chave para uma experiência mais rápida e eficiente. Ele é apenas uma ferramenta de suporte e não substitui consultas oficiais ou documentos formais.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Limitações</h2>
      <p className="mb-4">
        Os dados disponibilizados são de fontes confiáveis, mas não garantimos sua total precisão ou atualização. O uso das informações é de responsabilidade do usuário.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Isenção de Responsabilidade</h2>
      <p className="mb-4">
        O sistema não se responsabiliza por quaisquer danos, prejuízos ou problemas causados pelo uso indevido das informações apresentadas. Ele é oferecido "como está" e deve ser usado com cautela.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Direitos Autorais</h2>
      <p className="mb-4">
        Todos os direitos relacionados ao conteúdo e design deste sistema são reservados. A reprodução ou distribuição não autorizada é proibida.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Alterações nos Termos</h2>
      <p className="mb-4">
        Os termos de uso podem ser alterados a qualquer momento, sem aviso prévio. Recomendamos que você revise esta página regularmente.
      </p>
      <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>
    </main>
  );
}