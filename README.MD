Aplikacja do wysylania maili

Aplikacja łaczy sie z microserwisem bank-manager i wysyla emaile weryfikujace konta użytkowników.

1. Sposob dzialania
   Aplikacja łaczy sie z systemem kolejkowym RabbitMQ i istniejaca juz kolejka i nasluchuje przychodzacych danych
   zawierajacych dane o uzytkownikach do weryfikacji. Wysylany jest email z linkiem aktywacyjnym do konta zawierajacym
   token potwierdzajacy email.
   Jezeli link weryfikacyjny zostanie aktywowany to rozpoczeta jest faza weryfikacyjna.
   Nawiazywane jest polaczenie z baza danych MongoDB zawierajaca informacje o istniejacych uzytkownikach. Nastepnie sprawdzane jest czy uzytkownik z podanym w linku url tokenem weryfikacyjnym istnieje. Jesli tak to pole weryfikujace
   uzytkownika zmieniane jest na true (confirmed: true) i token weryfikacyjny jest wyczyszczany.
   Jesli wszystkie kroki przebiegly pomyslnie, to uzytkownik jest juz zweryfikowany i otrzymuje dostep do uslug zawartych
   w serwisie bankowym.

2. Podzial aplikacji

   - controllers:
     - sendEmail - wysyla email pod podany adres email z linkiem weryfikacyjnym
     - verifyEmail - po aktywacji linku weryfikacyjnego (z przychodzacej wiadomosci email) podejmuje czynnosci weryfikacyjne nowego uzytkownika.
   - db: tworzenie polaczen z bazami danych
   - errors: customowe bledy
   - middleware: obsluga bledow i przekierowan na nieistniejace adresy

3. Uruchomienie środowisk
   I. Aplikacja uruchamiana w kontenerach dockerowych.
   Uruchamiane sa wszystkie serwisy polaczone w aplikacje (zawarte w pliku docker-compose.yml)
   By uruchomic aplikacje wymagana jest instalacja:

   - docker
   - docker compose
   - node

   1. Przejdz do lokalizacji w ktorej znajduje sie plik docker-compose.yml
   2. Wprowadz komende [ docker compose up ]
      Poczekaj az wszystkie kontenery sie wybuduja i aplikacje zaczna dzialac
      (pojawia sie komunikaty 'Server is running... ').
      Aplikacje domyslnie uruchamiane sa w trybie dewelopera i mozliwe jest przelaczenia na tryb produkcyjny, przez zmiane przypisanej wartosci zmiennej srodowiskowej NODE_ENV na production.

   II. Aplikacja uruchamiana bez dockera (uruchamia wylacznie mikroserwis do wysylania emaili. By podejmowal jakies akcje musisz uruchomic reszte srodowisk oraz stworzyc dockerowy kontener rabbitmq,
   see: https://cloudinfrastructureservices.co.uk/create-rabbitmq-docker-container-image/ )

   Przejdz do folderu bank-emailer i uruchom komende [ npm start ]
