
import { useState } from 'react'

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-violet-700 text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold">AfiliaPro</h1>

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            {menuAberto ? 'Fechar' : 'Menu'}
          </button>
        </div>

        {menuAberto && (
          <nav className="border-t border-white/20 px-6 py-4">
            <p>Início</p>
            <p>Produtos</p>
            <p>Meus links</p>
            <p>Minha conta</p>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="mb-3 font-semibold text-violet-700">
            BEM-VINDO AO AFILIAPRO
          </p>

          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Sua jornada como afiliado começa aqui.
          </h2>

          <p className="max-w-2xl text-gray-600">
            Encontre produtos, organize seus links de afiliado
            e acompanhe seus resultados em um só lugar.
          </p>

          <button className="mt-6 rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white hover:bg-violet-800">
            Conhecer a plataforma
          </button>
        </section>
      </main>
    </div>
  )
}
