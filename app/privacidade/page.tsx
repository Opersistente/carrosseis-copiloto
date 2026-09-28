export const metadata = { title: "Política de Privacidade — Projeto Copiloto" };

export default function Privacidade() {
  return (
    <article className="max-w-2xl space-y-5 text-soft leading-relaxed">
      <h1 className="text-2xl font-extrabold text-white">Política de Privacidade</h1>
      <p>Última atualização: 28 de setembro de 2026.</p>
      <p>
        Este aplicativo é usado pelo Projeto Copiloto (Luís Fernando Oliveira, @luisoliver.fernando) para publicar
        conteúdo na própria conta do Instagram e responder automaticamente a comentários feitos nas publicações dessa conta.
      </p>
      <h2 className="text-lg font-bold text-white">Quais dados usamos</h2>
      <p>
        Quando alguém comenta uma palavra-chave numa publicação do @luisoliver.fernando, recebemos da Meta o texto do
        comentário, o identificador do comentário e o nome de usuário de quem comentou. Usamos esses dados só para enviar
        uma mensagem direta de resposta e uma resposta pública ao comentário.
      </p>
      <h2 className="text-lg font-bold text-white">O que não fazemos</h2>
      <p>
        Não armazenamos os comentários nem os dados de quem comentou em banco de dados, não vendemos nem compartilhamos
        esses dados com terceiros e não os usamos para publicidade.
      </p>
      <h2 className="text-lg font-bold text-white">Exclusão de dados</h2>
      <p>
        Como não guardamos dados pessoais, não há registro para apagar. Se quiser confirmar isso ou tirar qualquer dúvida,
        mande uma mensagem direta para @luisoliver.fernando no Instagram.
      </p>
    </article>
  );
}
