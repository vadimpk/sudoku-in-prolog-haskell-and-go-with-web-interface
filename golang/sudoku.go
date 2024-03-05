package main

import (
	"math/rand"
)

type sudoku struct {
}

func (s *sudoku) solve(grid *[9][9]int) bool {
	if !s.hasEmptyCell(grid) {
		return true
	}
	for i := 0; i < 9; i++ {
		for j := 0; j < 9; j++ {
			if grid[i][j] == 0 {
				for candidate := 9; candidate >= 1; candidate-- {
					grid[i][j] = candidate
					if s.check(grid) {
						if s.solve(grid) {
							return true
						}
						grid[i][j] = 0
					} else {
						grid[i][j] = 0
					}
				}
				return false
			}
		}
	}
	return false
}

func (s *sudoku) generate() [9][9]int {
	var grid [9][9]int
	numbers := s.randomNumbers()
	for i := 0; i < 9; i++ {
		grid[0][i] = numbers[i]
	}

	s.solve(&grid)

	return grid
}

func (s *sudoku) randomNumbers() [9]int {
	var arr = [9]int{1, 2, 3, 4, 5, 6, 7, 8, 9}
	rand.Shuffle(len(arr), func(i, j int) {
		arr[i], arr[j] = arr[j], arr[i] // Swap the elements.
	})

	return arr
}

func (s *sudoku) checkFull(grid *[9][9]int) bool {
	return s.check(grid) && !s.hasEmptyCell(grid)
}

func (s *sudoku) check(grid *[9][9]int) bool {
	for row := 0; row < 9; row++ {
		counter := [10]int{}
		for col := 0; col < 9; col++ {
			counter[grid[row][col]]++
		}
		if s.hasDuplicates(counter) {
			return false
		}
	}

	//check duplicates by column
	for row := 0; row < 9; row++ {
		counter := [10]int{}
		for col := 0; col < 9; col++ {
			counter[grid[col][row]]++
		}
		if s.hasDuplicates(counter) {
			return false
		}
	}

	//check 3x3 section
	for i := 0; i < 9; i += 3 {
		for j := 0; j < 9; j += 3 {
			counter := [10]int{}
			for row := i; row < i+3; row++ {
				for col := j; col < j+3; col++ {
					counter[grid[row][col]]++
				}
				if s.hasDuplicates(counter) {
					return false
				}
			}
		}
	}

	return true
}

func (s *sudoku) hasEmptyCell(board *[9][9]int) bool {
	for i := 0; i < 9; i++ {
		for j := 0; j < 9; j++ {
			if board[i][j] == 0 {
				return true
			}
		}
	}
	return false
}

func (s *sudoku) hasDuplicates(counter [10]int) bool {
	for i, count := range counter {
		if i == 0 {
			continue
		}
		if count > 1 {
			return true
		}
	}
	return false
}
