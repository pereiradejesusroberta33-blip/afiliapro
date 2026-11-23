
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function App() {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCarregando(true)
    setMensagem('')

    try {
      if (modo === 'cadastro') {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            data: { full_name: nome },
          },
        })

        if (error) throw error
        setMensagem('Cadastro realizado! Verifique seu e-mail para confirmar a conta.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        })

        if (error) throw error
        setMensagem('Login realizado com sucesso!')
      }
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : 'Ocorreu um erro.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-violet-700">AfiliaPro</h1>
          <p className="mt-2 text-gray-500">
            Sua plataforma de marketing de afiliados
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setModo('login')}
            className={`rounded-lg py-3 font-semibold ${
              modo === 'login'
                ? 'bg-violet-700 text-white'
                : 'text-gray-600'
            }`}
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => setModo('cadastro')}
            className={`rounded-lg py-3 font-semibold ${
              modo === 'cadastro'
                ? 'bg-violet-700 text-white'
                : 'text-gray-600'
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={entrar} className="space-y-4">
          {modo === 'cadastro' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-600"
                placeholder="Seu nome"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-600"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              required
              type="password"
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-600"
              placeholder="Mínimo de 6 caracteres"
            />
          </div>

          <button
            disabled={carregando}
            className="w-full rounded-xl bg-violet-700 py-3 font-semibold text-white hover:bg-violet-800 disabled:opacity-60"
          >
            {carregando
              ? 'Aguarde...'
              : modo === 'login'
                ? 'Entrar na plataforma'
                : 'Criar minha conta'}
          </button>
        </form>

        {mensagem && (
          <p className="mt-5 rounded-lg bg-violet-50 p-3 text-sm text-violet-800">
            {mensagem}
          </p>
        )}
      </section>
    </main>
  )
}
