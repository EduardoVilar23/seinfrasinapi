import Image from "next/image";
import Link from "next/link";

export default function Custom404() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        {/* Logo */}
        <Image className="w-32 h-auto mb-6" src="/logo.png" width={200} height={200} alt="dataSIN"/>
        <Image className="w-44 h-auto mb-6" src="/assets/404.png" width={600} height={600} alt="dataSIN"/>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Oops! A página que você está procurando não foi encontrada.
        </p>
  
        {/* Botão para retornar à página inicial */}
        <Link
          href="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          ⏎ Retornar ao DataSIN
        </Link>
  
        {/* Design adicional para dar estilo */}
        <div className="absolute bottom-4 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} DataSIN. Todos os direitos reservados.
        </div>
      </div>
    );
  }