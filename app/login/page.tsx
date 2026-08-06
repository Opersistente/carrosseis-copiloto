export default function LoginPage({
  searchParams,
}: {
  searchParams: { from?: string; error?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form action="/api/login" method="POST" className="card p-8 w-full max-w-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#4DA3FF]" />
          <span className="font-extrabold tracking-wide text-sm text-softer">FÁBRICA DE CARROSSÉIS</span>
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" autoFocus required />
        </div>
        <input type="hidden" name="from" value={searchParams.from || "/"} />
        {searchParams.error && <p className="text-red-400 text-sm">Senha incorreta.</p>}
        <button type="submit" className="btn btn-primary w-full justify-center">Entrar</button>
      </form>
    </div>
  );
}
