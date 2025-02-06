'use client'

import Link from "next/link";
import Image from "next/image";

export default function PrivacyPolicy() {
  return (
    <div className="p-6 font-sans dark:bg-gray-900 dark:text-white bg-white text-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="my-10">
        <Link href={'/'}>
            <Image
                src="/logo.png"
                width={200}
                height={200}
                alt="dataSIN"
                className="mb-4"
            />
        </Link>
        </div>
        {/* Cabeçalho */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
        </header>

        {/* Seção 1 - Introdução */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold">1. Introdução</h2>
          <p>
            Bem-vindo ao <strong>DataSIN</strong>! Esta política explica como lidamos com suas informações ao usar nossa plataforma.
            Nosso objetivo é fornecer um serviço eficiente e transparente para consultas de preços e itens do SINAPI, SICRO e Pregão Eletrônico 133/2023 da Prefeitura de Parnaíba.
          </p>
        </section>

        {/* Seção 2 - Dados Coletados */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold">2. Dados Coletados</h2>
          <p>
            O <strong>DataSIN</strong> não exige cadastro de usuários nem coleta dados pessoais sensíveis. Entretanto, podemos processar e armazenar os seguintes dados:
          </p>
          <ul className="list-disc pl-6">
            <li><strong>Consultas realizadas:</strong> Podemos registrar palavras-chave pesquisadas para melhorar a eficiência da ferramenta.</li>
            <li><strong>Cookies e dados de navegação:</strong> Utilizamos cookies para armazenar preferências do usuário, como modo claro/escuro.</li>
            <li><strong>Dados técnicos:</strong> Registros básicos como tipo de dispositivo e navegador podem ser armazenados anonimamente para fins de análise.</li>
          </ul>
        </section>

        {/* Seção 3 - Uso das Informações */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold">3. Uso das Informações</h2>
          <p>
            Os dados coletados são usados exclusivamente para:
          </p>
          <ul className="list-disc pl-6">
            <li>Melhorar a experiência do usuário na plataforma.</li>
            <li>Garantir o bom funcionamento da ferramenta.</li>
            <li>Identificar possíveis falhas ou otimizações no sistema.</li>
          </ul>
        </section>

        {/* Seção 4 - Compartilhamento de Dados */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold">4. Compartilhamento de Dados</h2>
          <p>
            O <strong>DataSIN</strong> não vende, compartilha ou transfere suas informações para terceiros. Dados agregados e estatísticos podem ser analisados internamente para aprimorar o sistema, sem identificação individual dos usuários.
          </p>
        </section>

        {/* Seção 5 - Cookies */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold">5. Uso de Cookies</h2>
          <p>
            Utilizamos cookies para armazenar preferências do usuário, como o modo de exibição (claro/escuro). Você pode desativar os cookies no seu navegador, mas algumas funcionalidades podem ser afetadas.
          </p>
        </section>

        {/* Seção 6 - Segurança */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold">6. Segurança</h2>
          <p>
            Adotamos medidas para proteger os dados processados pelo <strong>DataSIN</strong>, mas lembramos que nenhuma transmissão pela internet é 100% segura. Não armazenamos informações pessoais críticas ou confidenciais.
          </p>
        </section>

        {/* Seção 7 - Alterações na Política */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold">7. Alterações nesta Política</h2>
          <p>
            Esta Política de Privacidade pode ser atualizada periodicamente. Caso ocorram mudanças significativas, informaremos os usuários por meio do próprio site.
          </p>
        </section>

        {/* Seção 8 - Contato */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold">8. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato pelo e-mail:{" "}
            <a
              href="mailto:contato@datasin.com.br"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              contato@datasin.com.br
            </a>.
          </p>
        </section>

        <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        {/* Link para voltar */}
        <div className="text-center mt-8">
          <Link href="/">
            <span className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer">
              Voltar para a Página Inicial
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}