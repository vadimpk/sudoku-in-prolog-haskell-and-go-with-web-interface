# sudoku-in-prolog-haskell-and-go-with-web-interface

### description
This project contains implementation of a very famous puzzle game a.k.a "Sudoku" in 3 different languages, each representing a different branch in programming:
- 🪄 Prolog (logical programming) 
- 💪 Golang (imperative programming)
- 🗿 Haskell (functional programming)

### how to run ?
There is a web interface for visulization of the game (`web/` folder). You can run it using `Live server` extension in VS code (or any other way if you think you're smart).

Web interface connects to any implementation using HTTP, so each implementation (except Haskell🗿) also has a server. To run a server you can use `makefile` like this:

```bash
make prolog-server # runs prolog server
make golang-server # runs golang server (no way...)
```

Then just use the web version in the browser. If you don't have a browser...🤦‍♂️ – you can use any implementation directly via console.

### why this project?
for the power and glory of logical programming