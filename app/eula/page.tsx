import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Termos de Uso - DataSIN",
  description: "Leia os Termos de Uso do sistema DataSIN.",
};

export default function TermsPage() {
  return (
    <main className="p-6 font-sans text-gray-900 dark:text-white dark:bg-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Termos de Uso</h1>
      <p className="mb-4">
        Bem-vindo ao sistema DataSIN. Este documento descreve os termos e condições de uso aplicáveis ao uso deste sistema. Ao acessar ou utilizar qualquer funcionalidade do DataSIN ("Sistema"), você declara ter lido, compreendido e aceito os presentes Termos de Uso. Caso não concorde, solicitamos que interrompa imediatamente o uso.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Aceitação dos Termos</h2>
      <p className="mb-4">
        Ao utilizar o Sistema, você reconhece que leu, compreendeu e concorda com estes Termos de Uso, incluindo quaisquer políticas e diretrizes aqui mencionadas. O uso contínuo do Sistema após eventuais alterações nos Termos constitui sua aceitação das modificações. Caso não concorde, o acesso deverá ser descontinuado.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Finalidade do Sistema</h2>
      <p className="mb-4">
        O DataSIN foi desenvolvido para oferecer uma interface eficiente para consulta de dados da base de preços do Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil (SINAPI) e outras bases de dados que podem ser incluídas conforme as atualizações do Sistema. O objetivo principal é auxiliar profissionais e empresas do setor da construção civil na busca por informações precisas e relevantes. Ressaltamos que o Sistema é uma ferramenta complementar e não substitui consultas oficiais ou documentos emitidos por órgãos competentes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Uso Adequado</h2>
      <p className="mb-4">
        O uso do DataSIN deve seguir as boas práticas e normas éticas. É estritamente proibido:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Utilizar o Sistema para fins ilegais, fraudulentos ou que infrinjam direitos de terceiros.</li>
        <li>Tentar acessar áreas restritas ou sistemas não autorizados relacionados ao DataSIN.</li>
        <li>Usar robôs, scripts ou qualquer outro método automatizado para coletar dados do Sistema.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Limitações e Isenção de Responsabilidade</h2>
      <p className="mb-4">
        Apesar dos esforços para garantir que os dados apresentados sejam precisos e atualizados, o DataSIN é fornecido "no estado em que se encontra", sem garantias explícitas ou implícitas de qualquer natureza. Não nos responsabilizamos por:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Erros ou imprecisões nos dados apresentados.</li>
        <li>Perdas ou danos decorrentes do uso das informações fornecidas pelo Sistema.</li>
        <li>Interrupções temporárias no funcionamento do Sistema devido a manutenção, atualizações ou problemas técnicos.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Propriedade Intelectual</h2>
      <p className="mb-4">
        Todo o conteúdo do DataSIN, incluindo textos, gráficos, logotipos, ícones, imagens, vídeos, códigos de programação e funcionalidades, é protegido por direitos autorais e outras leis de propriedade intelectual. Você não está autorizado a modificar, reproduzir, distribuir ou criar trabalhos derivados com base no conteúdo do Sistema sem autorização expressa e por escrito.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Privacidade e Proteção de Dados</h2>
      <p className="mb-4">
        O DataSIN respeita a sua privacidade. Qualquer informação pessoal coletada durante o uso do Sistema será tratada em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Para mais detalhes, consulte nossa Política de Privacidade.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Alterações nos Termos de Uso</h2>
      <p className="mb-4">
        Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações serão publicadas nesta página, e recomendamos que os usuários revisem periodicamente este documento para manter-se informados. O uso contínuo do Sistema após alterações constitui aceitação dos novos termos.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">8. Legislação e Foro</h2>
      <p className="mb-4">
        Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa ou controvérsia será submetida ao foro da comarca de Parnaíba, Piauí, excluindo-se qualquer outro, por mais privilegiado que seja.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">9. Contato</h2>
      <p className="mb-4">
        Caso tenha dúvidas, sugestões ou precise de suporte relacionado ao uso do Sistema DataSIN, entre em contato conosco através dos canais oficiais disponibilizados no Sistema.
      </p>

      <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>

      <div className="mt-5">
        <span className="text-blue-500 hover:underline">
          <Link href={"/"}>
            <span>⏎ Retornar ao DataSIN</span>
          </Link>
        </span>
      </div>
    </main>
  );
}