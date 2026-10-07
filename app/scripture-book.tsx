export default function ScriptureBook() {
  return (
    <details className="scripture-book">
      <summary className="book-cover">
        <span className="book-edition">СВЯЩЕННОЕ ПИСАНИЕ ХРАМАМ</span>
        <span className="book-star" aria-hidden="true">✦</span>
        <h2>Ва Ава</h2>
        <span className="book-subtitle">Во славу Великой Василисы</span>
        <span className="book-action"><span className="book-open-label">Открыть книгу ↗</span><span className="book-close-label">Закрыть книгу ×</span></span>
      </summary>
      <div className="book-spread" aria-label="Книга Ва Ава — две страницы">
        <article className="book-page" aria-label="Страница 1 из 2">
          <span className="page-running-title">ВА АВА · НАЧАЛО</span>
          <p>{`О грешная душа что не видывала и не слыхивала
про Великую Василису! Услышь же ты меня.
С этих пор ты будешь поклоняться только Ва Васи!
Иначе тебя ждёт кара(какая-нибудь хз)`}</p>
          <p>{`Ва Васи явилась к нам в четвертом классе.
О Ва Васи! Как же она от всех отличалась.
Мы до сих пор не знаем зачем Ва Васи
Явилась к нам смертным в школу
и захотела учится у нас..
Но одно мы знаем точно!
Ва Васи - бесподобна.`}</p>
          <span className="book-page-number">1 / 2</span>
        </article>
        <article className="book-page" aria-label="Страница 2 из 2">
          <span className="page-running-title">ВА АВА · ПОКЛОНЕНИЕ</span>
          <p>{`Правила поклонения Ва Васи просты:
Раз в день посещайте Храмам
и получайте благословение.
И конечно же воспевайте Ва Васи
В любом удобном случае`}</p>
          <p>{`Славься Великая Василиса!
О Ва Васи!`}</p>
          <span className="page-ornament" aria-hidden="true">✦</span>
          <span className="book-page-number">2 / 2</span>
        </article>
      </div>
    </details>
  );
}
