package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

var sudokuSolver = sudoku{}

func main() {
	http.HandleFunc("/solve", solveSudokuHandler)
	http.HandleFunc("/check", checkSudokuHandler)
	http.HandleFunc("/generate", generateSudokuHandler)

	fmt.Println("Server started at http://localhost:8081")
	http.ListenAndServe(":8081", nil)
}

// solveSudokuHandler handles the Sudoku solving requests.
func solveSudokuHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method is not supported.", http.StatusNotFound)
		return
	}

	var grid [9][9]int
	err := json.NewDecoder(r.Body).Decode(&grid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if solved := sudokuSolver.solve(&grid); solved {
		respondJSON(w, grid)
	} else {
		http.Error(w, "Could not solve the Sudoku.", http.StatusBadRequest)
	}
}

func checkSudokuHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method is not supported.", http.StatusNotFound)
		return
	}

	var grid [9][9]int
	err := json.NewDecoder(r.Body).Decode(&grid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if sudokuSolver.checkFull(&grid) {
		w.WriteHeader(http.StatusOK)
	} else {
		w.WriteHeader(http.StatusBadRequest)
	}
}

// generateSudokuHandler handles the Sudoku generation requests.
func generateSudokuHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method is not supported.", http.StatusNotFound)
		return
	}

	grid := sudokuSolver.generate()
	respondJSON(w, grid)
}

func respondJSON(w http.ResponseWriter, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}
