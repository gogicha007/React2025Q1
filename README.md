Used api rickandmortyapi.com. Search field looks for the character status: dead or alive.
All tests are in a file - src/results/results.test.tsx

Instructions to run the application:

- git clone https://github.com/gogicha007/React2025Q1.git
- git checkout hooks-and-routing
- npm install
- npm run format:fix
- npm run test
- npm run coverage // to test coverage
- npm run dev

P.S. The details data is loading too fast for the loading indicator to be displayed. You can check its presence in the code (results.tsx, lines:78-88), and there is also a special test for this loader indicator to confirm its presence.
