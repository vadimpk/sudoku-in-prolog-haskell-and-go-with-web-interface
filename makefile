prolog-server:
	cd prolog; swipl -s sudoku -s server

golang-server:
	cd golang; go run ./...